import type { ScenarioParams, ScenarioCosts, ScenarioKey } from '../types'

/**
 * 12ヶ月の為替レートを受け取り、4シナリオの年間支払額（円）を返す。
 * @param params シナリオ入力値
 * @param rates  12ヶ月分の為替レート配列（rates[0] が1ヶ月目）
 */
export function calcScenarioCosts(params: ScenarioParams, rates: number[]): ScenarioCosts {
  const { hourlyRate, hoursPerMonth, riPartialUpfront, riPartialMonthly } = params

  const onDemandMonthlyUSD = hourlyRate * hoursPerMonth
  const riNoUpfrontMonthlyUSD = onDemandMonthlyUSD * 0.72
  const riFullUpfrontTotalUSD = onDemandMonthlyUSD * 12 * 0.68

  // オンデマンド：毎月その月の為替レートで円換算
  const onDemand = rates.reduce((sum, rate) => sum + onDemandMonthlyUSD * rate, 0)

  // RI前払いなし：毎月その月の為替レートで円換算
  const riNoUpfront = rates.reduce((sum, rate) => sum + riNoUpfrontMonthlyUSD * rate, 0)

  // RI一部前払い：前払い分は1ヶ月目レート、月額分は毎月のレート
  const riPartialUpfrontCost = riPartialUpfront * rates[0]
  const riPartialMonthlyCost = rates.reduce((sum, rate) => sum + riPartialMonthly * rate, 0)

  // RI全額前払い：年間一括を1ヶ月目レートで円換算、2〜12ヶ月目は0円
  const riFullUpfront = riFullUpfrontTotalUSD * rates[0]

  return {
    onDemand,
    riNoUpfront,
    riPartialUpfront: riPartialUpfrontCost + riPartialMonthlyCost,
    riFullUpfront,
  }
}

/**
 * ScenarioCosts の中から最安シナリオのキーを返す。
 */
export function findCheapest(costs: ScenarioCosts): ScenarioKey {
  return (Object.entries(costs) as [ScenarioKey, number][]).reduce(
    (minKey, [key, val]) => (val < costs[minKey] ? key : minKey),
    'onDemand' as ScenarioKey,
  )
}
