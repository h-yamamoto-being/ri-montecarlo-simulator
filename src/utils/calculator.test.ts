import { describe, it, expect } from 'vitest'
import { calcScenarioCosts, findCheapest } from './calculator'
import type { ScenarioParams, ScenarioCosts } from '../types'

const DEFAULT_PARAMS: ScenarioParams = {
  hourlyRate: 8.896,
  hoursPerMonth: 730,
  riPartialUpfront: 27275,
  riPartialMonthly: 2272.93,
}

// rates[0] = 現在（チャート表示用）、rates[1..12] = 支払い月
const FLAT_RATES_160 = [160, ...Array(12).fill(160)]

describe('calcScenarioCosts', () => {
  it('オンデマンド：全月一定レートの場合、月額×12ヶ月分の合計になる', () => {
    const costs = calcScenarioCosts(DEFAULT_PARAMS, FLAT_RATES_160)
    const expectedMonthlyUSD = DEFAULT_PARAMS.hourlyRate * DEFAULT_PARAMS.hoursPerMonth
    const expected = expectedMonthlyUSD * 160 * 12
    expect(costs.onDemand).toBeCloseTo(expected, 0)
  })

  it('RI前払いなし：オンデマンドの72%になる', () => {
    const costs = calcScenarioCosts(DEFAULT_PARAMS, FLAT_RATES_160)
    expect(costs.riNoUpfront).toBeCloseTo(costs.onDemand * 0.72, 0)
  })

  it('RI全額前払い：年間一括（月額×12×68%）を1ヶ月目レートで円換算', () => {
    const costs = calcScenarioCosts(DEFAULT_PARAMS, FLAT_RATES_160)
    const onDemandMonthlyUSD = DEFAULT_PARAMS.hourlyRate * DEFAULT_PARAMS.hoursPerMonth
    const expectedUSD = onDemandMonthlyUSD * 12 * 0.68
    expect(costs.riFullUpfront).toBeCloseTo(expectedUSD * 160, 0)
  })

  it('RI一部前払い：前払い分は1ヶ月目レート、月額分は各月レートで計算される', () => {
    // rates[0]=現在（チャート用）、rates[1..12]=支払い月 (160〜171)
    const rates = [159, ...Array(12).fill(0).map((_, i) => 160 + i)]
    const monthlyRates = rates.slice(1)
    const costs = calcScenarioCosts(DEFAULT_PARAMS, rates)
    const expectedUpfront = DEFAULT_PARAMS.riPartialUpfront * monthlyRates[0]
    const expectedMonthly = monthlyRates.reduce((s, r) => s + DEFAULT_PARAMS.riPartialMonthly * r, 0)
    expect(costs.riPartialUpfront).toBeCloseTo(expectedUpfront + expectedMonthly, 0)
  })

  it('RI全額前払い：為替レートが変動しても1ヶ月目レートのみ使用する', () => {
    const ratesA = [0, 150, ...Array(11).fill(200)]
    const ratesB = [0, 150, ...Array(11).fill(100)]
    const costsA = calcScenarioCosts(DEFAULT_PARAMS, ratesA)
    const costsB = calcScenarioCosts(DEFAULT_PARAMS, ratesB)
    expect(costsA.riFullUpfront).toBeCloseTo(costsB.riFullUpfront, 0)
  })

  it('レートが0の場合は全シナリオが0円になる', () => {
    const costs = calcScenarioCosts(DEFAULT_PARAMS, Array(13).fill(0))
    expect(costs.onDemand).toBe(0)
    expect(costs.riNoUpfront).toBe(0)
    expect(costs.riPartialUpfront).toBe(0)
    expect(costs.riFullUpfront).toBe(0)
  })
})

describe('findCheapest', () => {
  it('最も小さい値のシナリオキーを返す', () => {
    const costs: ScenarioCosts = {
      onDemand: 1000,
      riNoUpfront: 800,
      riPartialUpfront: 750,
      riFullUpfront: 700,
    }
    expect(findCheapest(costs)).toBe('riFullUpfront')
  })

  it('全て同じ場合は onDemand を返す', () => {
    const costs: ScenarioCosts = {
      onDemand: 500,
      riNoUpfront: 500,
      riPartialUpfront: 500,
      riFullUpfront: 500,
    }
    expect(findCheapest(costs)).toBe('onDemand')
  })

  it('riNoUpfront が最安の場合を正しく返す', () => {
    const costs: ScenarioCosts = {
      onDemand: 1000,
      riNoUpfront: 300,
      riPartialUpfront: 400,
      riFullUpfront: 500,
    }
    expect(findCheapest(costs)).toBe('riNoUpfront')
  })
})
