import { describe, it, expect } from 'vitest'
import { calcYenStrengthProb, generateFxPath, runFxSimulations } from './montecarlo'
import type { FxModelParams } from '../types'

const BASE_PARAMS: FxModelParams = {
  currentRate: 160,
  lowerBound: 150,
  upperBound: 170,
  interventionLine: 160,
  monthlyVariation: 3,
  normalYenStrengthProb: 60,
  interventionYenStrengthProb: 80,
  simCount: 100,
}

describe('calcYenStrengthProb', () => {
  it('介入ライン以下では通常時確率（0.6）を返す', () => {
    const prob = calcYenStrengthProb(155, BASE_PARAMS)
    expect(prob).toBeCloseTo(0.6)
  })

  it('介入ラインを超えると介入時確率（0.8）を返す', () => {
    const prob = calcYenStrengthProb(161, BASE_PARAMS)
    expect(prob).toBeCloseTo(0.8)
  })

  it('上限（170）付近では円高確率が基準値より高くなる', () => {
    const baseProb = calcYenStrengthProb(165, BASE_PARAMS) // upperBound - monthlyVariation = 167付近
    const nearUpperProb = calcYenStrengthProb(169, BASE_PARAMS)
    expect(nearUpperProb).toBeGreaterThan(baseProb)
  })

  it('上限ちょうど（170）では円高確率が1に近づく', () => {
    const prob = calcYenStrengthProb(170, BASE_PARAMS)
    expect(prob).toBeCloseTo(1.0)
  })

  it('下限（150）付近では円高確率が基準値より低くなる', () => {
    const baseProb = calcYenStrengthProb(155, BASE_PARAMS)
    const nearLowerProb = calcYenStrengthProb(151, BASE_PARAMS)
    expect(nearLowerProb).toBeLessThan(baseProb)
  })

  it('下限ちょうど（150）では円高確率が0に近づく', () => {
    const prob = calcYenStrengthProb(150, BASE_PARAMS)
    expect(prob).toBeCloseTo(0.0)
  })

  it('返値は常に 0〜1 の範囲に収まる', () => {
    const rates = [140, 150, 155, 160, 165, 170, 180]
    rates.forEach(rate => {
      const prob = calcYenStrengthProb(rate, BASE_PARAMS)
      expect(prob).toBeGreaterThanOrEqual(0)
      expect(prob).toBeLessThanOrEqual(1)
    })
  })
})

describe('generateFxPath', () => {
  it('指定月数のパスを返す', () => {
    const path = generateFxPath(BASE_PARAMS, 12)
    expect(path).toHaveLength(12)
  })

  it('1ヶ月目は currentRate と等しい', () => {
    const path = generateFxPath(BASE_PARAMS, 12)
    expect(path[0]).toBe(BASE_PARAMS.currentRate)
  })

  it('デフォルトで MONTHS（12）月分を生成する', () => {
    const path = generateFxPath(BASE_PARAMS)
    expect(path).toHaveLength(12)
  })

  it('すべてのレートが正の値を保つ', () => {
    for (let i = 0; i < 20; i++) {
      const path = generateFxPath(BASE_PARAMS, 12)
      path.forEach(rate => expect(rate).toBeGreaterThan(0))
    }
  })

  it('月次変動幅0の場合、全月が初期レートと同じになる', () => {
    const params = { ...BASE_PARAMS, monthlyVariation: 0 }
    const path = generateFxPath(params, 12)
    path.forEach(rate => expect(rate).toBe(BASE_PARAMS.currentRate))
  })
})

describe('runFxSimulations', () => {
  it('simCount 回分のパスを返す', () => {
    const paths = runFxSimulations(BASE_PARAMS)
    expect(paths).toHaveLength(BASE_PARAMS.simCount)
  })

  it('各パスの長さが12になる', () => {
    const paths = runFxSimulations(BASE_PARAMS)
    paths.forEach(path => expect(path).toHaveLength(12))
  })

  it('全パスの1ヶ月目が currentRate になる', () => {
    const paths = runFxSimulations(BASE_PARAMS)
    paths.forEach(path => expect(path[0]).toBe(BASE_PARAMS.currentRate))
  })

  it('simCount を変えると返却配列の長さが変わる', () => {
    const paths = runFxSimulations({ ...BASE_PARAMS, simCount: 10 })
    expect(paths).toHaveLength(10)
  })
})
