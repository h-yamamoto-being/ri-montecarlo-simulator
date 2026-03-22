import { ref, reactive } from 'vue'
import { DEFAULT_SCENARIO_PARAMS, DEFAULT_FX_MODEL_PARAMS, SCENARIO_KEYS } from '../constants'
import type { ScenarioParams, FxModelParams, SimulationResult, SimulationRun, ScenarioKey } from '../types'
import { calcScenarioCosts, findCheapest } from '../utils/calculator'
import { runFxSimulations } from '../utils/montecarlo'

type ScenarioErrors = Partial<Record<keyof ScenarioParams, string>>
type FxErrors = Partial<Record<keyof FxModelParams, string>>

export function useSimulator() {
  const scenarioParams = reactive<ScenarioParams>({ ...DEFAULT_SCENARIO_PARAMS })
  const fxParams = reactive<FxModelParams>({ ...DEFAULT_FX_MODEL_PARAMS })
  const result = ref<SimulationResult | null>(null)
  const scenarioErrors = ref<ScenarioErrors>({})
  const fxErrors = ref<FxErrors>({})

  function validateScenario(): boolean {
    const errors: ScenarioErrors = {}
    const { hourlyRate, hoursPerMonth, riPartialUpfront, riPartialMonthly } = scenarioParams

    if (isNaN(hourlyRate) || hourlyRate < 0.001 || hourlyRate > 999.999) {
      errors.hourlyRate = '0.001〜999.999 の範囲で入力してください'
    }
    if (isNaN(hoursPerMonth) || hoursPerMonth < 1 || hoursPerMonth > 744) {
      errors.hoursPerMonth = '1〜744 の範囲で入力してください'
    }
    if (isNaN(riPartialUpfront) || riPartialUpfront < 0) {
      errors.riPartialUpfront = '0以上の値を入力してください'
    }
    if (isNaN(riPartialMonthly) || riPartialMonthly < 0) {
      errors.riPartialMonthly = '0以上の値を入力してください'
    }

    scenarioErrors.value = errors
    return Object.keys(errors).length === 0
  }

  function validateFx(): boolean {
    const errors: FxErrors = {}
    const rateFields = ['currentRate', 'lowerBound', 'upperBound', 'interventionLine'] as const

    for (const key of rateFields) {
      const v = fxParams[key]
      if (isNaN(v) || v < 1 || v > 999) {
        errors[key] = '1〜999 の範囲で入力してください'
      }
    }
    if (isNaN(fxParams.monthlyVariation) || fxParams.monthlyVariation < 0.1 || fxParams.monthlyVariation > 20) {
      errors.monthlyVariation = '0.1〜20 の範囲で入力してください'
    }
    if (isNaN(fxParams.normalYenStrengthProb) || fxParams.normalYenStrengthProb < 1 || fxParams.normalYenStrengthProb > 99) {
      errors.normalYenStrengthProb = '1〜99 の範囲で入力してください'
    }
    if (isNaN(fxParams.interventionYenStrengthProb) || fxParams.interventionYenStrengthProb < 1 || fxParams.interventionYenStrengthProb > 99) {
      errors.interventionYenStrengthProb = '1〜99 の範囲で入力してください'
    }
    if (isNaN(fxParams.simCount) || !Number.isInteger(fxParams.simCount) || fxParams.simCount < 10 || fxParams.simCount > 1000) {
      errors.simCount = '10〜1000 の整数で入力してください'
    }

    fxErrors.value = errors
    return Object.keys(errors).length === 0
  }

  function runSimulation() {
    const scenarioOk = validateScenario()
    const fxOk = validateFx()
    if (!scenarioOk || !fxOk) return

    const ratePaths = runFxSimulations(fxParams)
    const runs: SimulationRun[] = ratePaths.map(rates => {
      const costs = calcScenarioCosts(scenarioParams, rates)
      return { rates, costs, cheapest: findCheapest(costs) }
    })

    const cheapestCount = Object.fromEntries(
      SCENARIO_KEYS.map(k => [k, 0]),
    ) as Record<ScenarioKey, number>
    runs.forEach(run => cheapestCount[run.cheapest]++)

    const n = runs.length
    const cheapestProb = Object.fromEntries(
      SCENARIO_KEYS.map(k => [k, (cheapestCount[k] / n) * 100]),
    ) as Record<ScenarioKey, number>

    const minCost = Object.fromEntries(
      SCENARIO_KEYS.map(k => [k, Math.min(...runs.map(r => r.costs[k]))]),
    ) as Record<ScenarioKey, number>

    const maxCost = Object.fromEntries(
      SCENARIO_KEYS.map(k => [k, Math.max(...runs.map(r => r.costs[k]))]),
    ) as Record<ScenarioKey, number>

    const avgCost = Object.fromEntries(
      SCENARIO_KEYS.map(k => [k, runs.reduce((s, r) => s + r.costs[k], 0) / n]),
    ) as Record<ScenarioKey, number>

    result.value = {
      runs,
      summary: { cheapestCount, cheapestProb, minCost, maxCost, avgCost },
    }
  }

  return {
    scenarioParams,
    fxParams,
    result,
    scenarioErrors,
    fxErrors,
    validateScenario,
    validateFx,
    runSimulation,
  }
}
