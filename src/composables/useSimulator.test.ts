import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useSimulator } from './useSimulator'
import { SCENARIO_KEYS } from '../constants'

// ---- validateScenario ----

describe('useSimulator - validateScenario', () => {
  it('デフォルト値はバリデーションを通過する', () => {
    const { validateScenario, scenarioErrors } = useSimulator()
    expect(validateScenario()).toBe(true)
    expect(Object.keys(scenarioErrors.value)).toHaveLength(0)
  })

  it('時間単価が 0.001 未満でエラーになる', () => {
    const { scenarioParams, validateScenario, scenarioErrors } = useSimulator()
    scenarioParams.hourlyRate = 0
    validateScenario()
    expect(scenarioErrors.value.hourlyRate).toBeDefined()
  })

  it('時間単価が 999.999 超過でエラーになる', () => {
    const { scenarioParams, validateScenario, scenarioErrors } = useSimulator()
    scenarioParams.hourlyRate = 1000
    validateScenario()
    expect(scenarioErrors.value.hourlyRate).toBeDefined()
  })

  it('時間単価が境界値 0.001 でエラーにならない', () => {
    const { scenarioParams, validateScenario, scenarioErrors } = useSimulator()
    scenarioParams.hourlyRate = 0.001
    validateScenario()
    expect(scenarioErrors.value.hourlyRate).toBeUndefined()
  })

  it('月間稼働時間が 1 未満でエラーになる', () => {
    const { scenarioParams, validateScenario, scenarioErrors } = useSimulator()
    scenarioParams.hoursPerMonth = 0
    validateScenario()
    expect(scenarioErrors.value.hoursPerMonth).toBeDefined()
  })

  it('月間稼働時間が 744 超過でエラーになる', () => {
    const { scenarioParams, validateScenario, scenarioErrors } = useSimulator()
    scenarioParams.hoursPerMonth = 745
    validateScenario()
    expect(scenarioErrors.value.hoursPerMonth).toBeDefined()
  })

  it('RI前払い額が負でエラーになる', () => {
    const { scenarioParams, validateScenario, scenarioErrors } = useSimulator()
    scenarioParams.riPartialUpfront = -1
    validateScenario()
    expect(scenarioErrors.value.riPartialUpfront).toBeDefined()
  })

  it('RI前払い額が 0 でエラーにならない', () => {
    const { scenarioParams, validateScenario, scenarioErrors } = useSimulator()
    scenarioParams.riPartialUpfront = 0
    validateScenario()
    expect(scenarioErrors.value.riPartialUpfront).toBeUndefined()
  })

  it('RI月額が負でエラーになる', () => {
    const { scenarioParams, validateScenario, scenarioErrors } = useSimulator()
    scenarioParams.riPartialMonthly = -1
    validateScenario()
    expect(scenarioErrors.value.riPartialMonthly).toBeDefined()
  })

  it('2 項目同時にエラーが出る', () => {
    const { scenarioParams, validateScenario, scenarioErrors } = useSimulator()
    scenarioParams.hourlyRate = 0
    scenarioParams.hoursPerMonth = 0
    validateScenario()
    expect(scenarioErrors.value.hourlyRate).toBeDefined()
    expect(scenarioErrors.value.hoursPerMonth).toBeDefined()
  })

  it('再バリデートでエラーがクリアされる', () => {
    const { scenarioParams, validateScenario, scenarioErrors } = useSimulator()
    scenarioParams.hourlyRate = 0
    validateScenario()
    expect(scenarioErrors.value.hourlyRate).toBeDefined()
    scenarioParams.hourlyRate = 8.896
    validateScenario()
    expect(scenarioErrors.value.hourlyRate).toBeUndefined()
  })
})

// ---- validateFx ----

describe('useSimulator - validateFx', () => {
  it('デフォルト値はバリデーションを通過する', () => {
    const { validateFx, fxErrors } = useSimulator()
    expect(validateFx()).toBe(true)
    expect(Object.keys(fxErrors.value)).toHaveLength(0)
  })

  it.each([
    ['currentRate', 0],
    ['currentRate', 1000],
    ['lowerBound', 0],
    ['upperBound', 1000],
    ['interventionLine', 0],
  ] as [keyof ReturnType<typeof useSimulator>['fxParams'], number][])(
    '%s = %d でエラーになる',
    (field, value) => {
      const { fxParams, validateFx, fxErrors } = useSimulator()
      fxParams[field] = value
      validateFx()
      expect((fxErrors.value as Record<string, string>)[field]).toBeDefined()
    },
  )

  it('monthlyVariation が 0.1 未満でエラーになる', () => {
    const { fxParams, validateFx, fxErrors } = useSimulator()
    fxParams.monthlyVariation = 0
    validateFx()
    expect(fxErrors.value.monthlyVariation).toBeDefined()
  })

  it('monthlyVariation が 20 超過でエラーになる', () => {
    const { fxParams, validateFx, fxErrors } = useSimulator()
    fxParams.monthlyVariation = 21
    validateFx()
    expect(fxErrors.value.monthlyVariation).toBeDefined()
  })

  it('normalYenStrengthProb が 1 未満でエラーになる', () => {
    const { fxParams, validateFx, fxErrors } = useSimulator()
    fxParams.normalYenStrengthProb = 0
    validateFx()
    expect(fxErrors.value.normalYenStrengthProb).toBeDefined()
  })

  it('normalYenStrengthProb が 99 超過でエラーになる', () => {
    const { fxParams, validateFx, fxErrors } = useSimulator()
    fxParams.normalYenStrengthProb = 100
    validateFx()
    expect(fxErrors.value.normalYenStrengthProb).toBeDefined()
  })

  it('interventionYenStrengthProb が範囲外でエラーになる', () => {
    const { fxParams, validateFx, fxErrors } = useSimulator()
    fxParams.interventionYenStrengthProb = 0
    validateFx()
    expect(fxErrors.value.interventionYenStrengthProb).toBeDefined()
  })

  it('simCount が 10 未満でエラーになる', () => {
    const { fxParams, validateFx, fxErrors } = useSimulator()
    fxParams.simCount = 9
    validateFx()
    expect(fxErrors.value.simCount).toBeDefined()
  })

  it('simCount が 1000 超過でエラーになる', () => {
    const { fxParams, validateFx, fxErrors } = useSimulator()
    fxParams.simCount = 1001
    validateFx()
    expect(fxErrors.value.simCount).toBeDefined()
  })

  it('simCount が小数でエラーになる', () => {
    const { fxParams, validateFx, fxErrors } = useSimulator()
    fxParams.simCount = 10.5
    validateFx()
    expect(fxErrors.value.simCount).toBeDefined()
  })
})

// ---- runSimulation ----

describe('useSimulator - runSimulation', () => {
  let mockRandom: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    mockRandom = vi.spyOn(Math, 'random').mockReturnValue(0.5)
  })

  afterEach(() => {
    mockRandom.mockRestore()
  })

  it('デフォルト設定でシミュレーション結果が生成される', () => {
    const { result, runSimulation } = useSimulator()
    expect(result.value).toBeNull()
    runSimulation()
    expect(result.value).not.toBeNull()
  })

  it('simCount 件の runs が生成される', () => {
    const { result, runSimulation, fxParams } = useSimulator()
    runSimulation()
    expect(result.value?.runs).toHaveLength(fxParams.simCount)
  })

  it('各 run に rates・costs・cheapest が含まれる', () => {
    const { result, runSimulation } = useSimulator()
    runSimulation()
    const run = result.value!.runs[0]
    expect(run.rates).toHaveLength(13)
    expect(run.costs).toHaveProperty('onDemand')
    expect(run.costs).toHaveProperty('riNoUpfront')
    expect(run.costs).toHaveProperty('riPartialUpfront')
    expect(run.costs).toHaveProperty('riFullUpfront')
    expect(SCENARIO_KEYS).toContain(run.cheapest)
  })

  it('cheapestCount の合計が simCount と等しい', () => {
    const { result, runSimulation, fxParams } = useSimulator()
    runSimulation()
    const total = Object.values(result.value!.summary.cheapestCount).reduce((s, n) => s + n, 0)
    expect(total).toBe(fxParams.simCount)
  })

  it('cheapestProb の合計が 100 になる', () => {
    const { result, runSimulation } = useSimulator()
    runSimulation()
    const total = Object.values(result.value!.summary.cheapestProb).reduce((s, n) => s + n, 0)
    expect(total).toBeCloseTo(100, 5)
  })

  it('minCost <= avgCost <= maxCost（浮動小数点誤差 1円 を許容）', () => {
    const { result, runSimulation } = useSimulator()
    runSimulation()
    const { minCost, avgCost, maxCost } = result.value!.summary
    for (const key of SCENARIO_KEYS) {
      expect(minCost[key]).toBeLessThanOrEqual(avgCost[key] + 1)
      expect(avgCost[key]).toBeLessThanOrEqual(maxCost[key] + 1)
    }
  })

  it('バリデーションエラー時は result が null のまま', () => {
    const { scenarioParams, result, runSimulation } = useSimulator()
    scenarioParams.hourlyRate = -1
    runSimulation()
    expect(result.value).toBeNull()
  })

  it('バリデーションエラー時に scenarioErrors が設定される', () => {
    const { scenarioParams, scenarioErrors, runSimulation } = useSimulator()
    scenarioParams.hourlyRate = -1
    runSimulation()
    expect(scenarioErrors.value.hourlyRate).toBeDefined()
  })
})
