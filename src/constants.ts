import type { ScenarioParams, FxModelParams, ScenarioKey } from './types'

export const DEFAULT_SCENARIO_PARAMS: ScenarioParams = {
  hourlyRate: 8.896,
  hoursPerMonth: 730,
  riPartialUpfront: 27275,
  riPartialMonthly: 2272.93,
}

export const DEFAULT_FX_MODEL_PARAMS: FxModelParams = {
  currentRate: 160,
  lowerBound: 150,
  upperBound: 170,
  interventionLine: 160,
  monthlyVariation: 3,
  normalYenStrengthProb: 60,
  interventionYenStrengthProb: 80,
  simCount: 100,
}

export const MONTHS = 12

export const SCENARIO_KEYS: ScenarioKey[] = [
  'onDemand',
  'riNoUpfront',
  'riPartialUpfront',
  'riFullUpfront',
]

export const SCENARIO_LABELS: Record<ScenarioKey, string> = {
  onDemand: 'オンデマンド',
  riNoUpfront: 'RI・前払いなし',
  riPartialUpfront: 'RI・一部前払い',
  riFullUpfront: 'RI・全額前払い',
}
