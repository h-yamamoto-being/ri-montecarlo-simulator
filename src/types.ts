export interface ScenarioParams {
  hourlyRate: number        // 時間単価（USD/hour）
  hoursPerMonth: number     // 月間稼働時間（時間）
  riPartialUpfront: number  // RI一部前払い・前払い額（USD）
  riPartialMonthly: number  // RI一部前払い・月額（USD）
}

export interface FxModelParams {
  currentRate: number                 // 現在レート（1ヶ月目）
  lowerBound: number                  // 想定下限
  upperBound: number                  // 想定上限
  interventionLine: number            // 介入ライン
  monthlyVariation: number            // 月次変動幅（±最大幅）
  normalYenStrengthProb: number       // 通常時円高確率（1〜99）
  interventionYenStrengthProb: number // 介入時円高確率（1〜99）
  simCount: number                    // シミュレーション回数（10〜100）
}

export interface ScenarioCosts {
  onDemand: number         // オンデマンド年間支払額（円）
  riNoUpfront: number      // RI前払いなし年間支払額（円）
  riPartialUpfront: number // RI一部前払い年間支払額（円）
  riFullUpfront: number    // RI全額前払い年間支払額（円）
}

export type ScenarioKey = keyof ScenarioCosts

export interface SimulationRun {
  rates: number[]      // 12ヶ月の為替レート
  costs: ScenarioCosts // 各シナリオの年間支払額（円）
  cheapest: ScenarioKey
}

export interface SimulationSummary {
  cheapestCount: Record<ScenarioKey, number> // 最安回数
  cheapestProb: Record<ScenarioKey, number>  // 最安確率（0〜100）
  minCost: Record<ScenarioKey, number>       // 最小年間支払額
  maxCost: Record<ScenarioKey, number>       // 最大年間支払額
  avgCost: Record<ScenarioKey, number>       // 平均年間支払額
}

export interface SimulationResult {
  runs: SimulationRun[]
  summary: SimulationSummary
}
