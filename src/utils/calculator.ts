import type { ScenarioParams, ScenarioCosts, ScenarioKey } from '../types'

/**
 * 13点の為替レートを受け取り、4シナリオの年間支払額（円）を返す。
 * @param params シナリオ入力値
 * @param rates  13点の為替レート配列（rates[0] はチャート表示用「現在」、rates[1..12] が支払い月）
 */
export function calcScenarioCosts(params: ScenarioParams, rates: number[]): ScenarioCosts {
  const { hourlyRate, hoursPerMonth, riPartialUpfront, riPartialMonthly } = params

  const onDemandMonthlyUSD = hourlyRate * hoursPerMonth
  const riNoUpfrontMonthlyUSD = onDemandMonthlyUSD * 0.72
  const riFullUpfrontTotalUSD = onDemandMonthlyUSD * 12 * 0.68

  // rates[0] はチャート表示用「現在」、rates[1..12] が支払い月
  const monthlyRates = rates.slice(1)

  // オンデマンド：毎月その月の為替レートで円換算
  const onDemand = monthlyRates.reduce((sum, rate) => sum + onDemandMonthlyUSD * rate, 0)

  // RI前払いなし：毎月その月の為替レートで円換算
  const riNoUpfront = monthlyRates.reduce((sum, rate) => sum + riNoUpfrontMonthlyUSD * rate, 0)

  // RI一部前払い：前払い分は1ヶ月目レート、月額分は毎月のレート
  const riPartialUpfrontCost = riPartialUpfront * monthlyRates[0]
  const riPartialMonthlyCost = monthlyRates.reduce((sum, rate) => sum + riPartialMonthly * rate, 0)

  // RI全額前払い：年間一括を1ヶ月目レートで円換算、2〜12ヶ月目は0円
  const riFullUpfront = riFullUpfrontTotalUSD * monthlyRates[0]

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
