import { describe, it, expect } from 'vitest'
import { generateRatePath, runSimulations } from './montecarlo'

describe('generateRatePath', () => {
  it('指定月数のパスを返す', () => {
    const path = generateRatePath(150, 0, 0.1, 12)
    expect(path).toHaveLength(12)
  })

  it('初月は initialRate と等しい', () => {
    const path = generateRatePath(150, 0, 0.1, 12)
    expect(path[0]).toBe(150)
  })

  it('ボラティリティが0の場合は全月が同じ値（ドリフトなし）', () => {
    const path = generateRatePath(150, 0, 0, 12)
    path.forEach(r => expect(r).toBeCloseTo(150))
  })

  it('レートが正の値を保つ', () => {
    const path = generateRatePath(150, 0, 0.3, 120)
    path.forEach(r => expect(r).toBeGreaterThan(0))
  })
})

describe('runSimulations', () => {
  it('指定シミュレーション数の配列を返す', () => {
    const paths = runSimulations(150, 0, 0.1, 12, 100)
    expect(paths).toHaveLength(100)
  })

  it('各パスの長さが months と等しい', () => {
    const paths = runSimulations(150, 0, 0.1, 12, 10)
    paths.forEach(p => expect(p).toHaveLength(12))
  })

  it('全パスの初月が initialRate と等しい', () => {
    const paths = runSimulations(150, 0, 0.1, 12, 10)
    paths.forEach(p => expect(p[0]).toBe(150))
  })
})
