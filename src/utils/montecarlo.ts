/**
 * 正規分布に従う乱数を生成する（Box-Muller法）
 * @param mean 平均
 * @param stddev 標準偏差
 */
export function randomNormal(mean: number, stddev: number): number {
  const u1 = Math.random()
  const u2 = Math.random()
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)
  return mean + stddev * z
}

/**
 * モンテカルロシミュレーションで為替レートのパスを生成する
 * @param initialRate 初期レート
 * @param annualDrift 年率ドリフト（例：0.02 = 2%）
 * @param annualVolatility 年率ボラティリティ（例：0.1 = 10%）
 * @param months シミュレーション月数
 */
export function generateRatePath(
  initialRate: number,
  annualDrift: number,
  annualVolatility: number,
  months: number,
): number[] {
  const dt = 1 / 12
  const monthlyDrift = annualDrift * dt
  const monthlyVol = annualVolatility * Math.sqrt(dt)

  const path: number[] = [initialRate]
  for (let i = 1; i < months; i++) {
    const prev = path[i - 1]
    const shock = randomNormal(0, 1)
    const next = prev * Math.exp(monthlyDrift - 0.5 * monthlyVol ** 2 + monthlyVol * shock)
    path.push(next)
  }
  return path
}

/**
 * 複数のシミュレーションパスを生成する
 * @param initialRate 初期レート
 * @param annualDrift 年率ドリフト
 * @param annualVolatility 年率ボラティリティ
 * @param months シミュレーション月数
 * @param simulations シミュレーション回数
 */
export function runSimulations(
  initialRate: number,
  annualDrift: number,
  annualVolatility: number,
  months: number,
  simulations: number,
): number[][] {
  return Array.from({ length: simulations }, () =>
    generateRatePath(initialRate, annualDrift, annualVolatility, months),
  )
}
