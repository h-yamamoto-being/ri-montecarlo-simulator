import type { FxModelParams } from '../types'
import { MONTHS } from '../constants'

/**
 * 現在レートと為替モデルパラメータから、ソフトバリアを考慮した
 * 「円高方向に動く確率（0〜1）」を返す。
 *
 * ソフトバリア：
 *   - 上限付近（upperBound - monthlyVariation 〜 upperBound）：円高確率を 1.0 に向けて線形補間
 *   - 下限付近（lowerBound 〜 lowerBound + monthlyVariation）：円高確率を 0.0 に向けて線形補間
 */
export function calcYenStrengthProb(rate: number, params: FxModelParams): number {
  const {
    lowerBound,
    upperBound,
    interventionLine,
    monthlyVariation,
    normalYenStrengthProb,
    interventionYenStrengthProb,
  } = params

  // 介入ライン超えで介入時確率、それ以外は通常時確率（0〜1 に変換）
  const baseProb =
    (rate > interventionLine ? interventionYenStrengthProb : normalYenStrengthProb) / 100

  // 上限付近：円高確率を 1.0 に向けてブレンド
  const upperThreshold = upperBound - monthlyVariation
  if (rate >= upperThreshold) {
    const factor = Math.min(1, (rate - upperThreshold) / monthlyVariation)
    return baseProb + (1 - baseProb) * factor
  }

  // 下限付近：円高確率を 0.0 に向けてブレンド
  const lowerThreshold = lowerBound + monthlyVariation
  if (rate <= lowerThreshold) {
    const factor = Math.min(1, (lowerThreshold - rate) / monthlyVariation)
    return baseProb * (1 - factor)
  }

  return baseProb
}

/**
 * 為替モデルパラメータを受け取り、12ヶ月分の為替レートパスを生成する。
 *
 * 1ヶ月ごとのロジック：
 *   1. 現在レートが介入ラインを超えているか判定
 *   2. 確率に従って円高 or 円安の方向を決定
 *   3. 変動幅（0〜monthlyVariation）をランダムで決定
 *   4. 次月レート = 現在レート ± 変動幅
 *   5. ソフトバリアにより境界付近の確率を補正
 */
export function generateFxPath(params: FxModelParams, months: number = MONTHS): number[] {
  const path: number[] = [params.currentRate]

  for (let i = 1; i <= months; i++) {
    const prev = path[i - 1]
    const probYenStrong = calcYenStrengthProb(prev, params)
    const isYenStrong = Math.random() < probYenStrong
    const variation = Math.random() * params.monthlyVariation
    const next = isYenStrong ? prev - variation : prev + variation
    // レートが0以下にならないよう保護
    path.push(Math.max(0.01, next))
  }

  return path
}

/**
 * simCount 回分の為替パスを生成して返す。
 */
export function runFxSimulations(params: FxModelParams): number[][] {
  return Array.from({ length: params.simCount }, () => generateFxPath(params))
}
