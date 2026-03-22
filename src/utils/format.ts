/** 円換算値を「1,234,567円」形式で返す（小数点なし・3桁カンマ） */
export function formatJpy(value: number): string {
  return Math.round(value).toLocaleString('ja-JP') + '円'
}

/** 為替レートを「160.00円」形式で返す */
export function formatRate(value: number): string {
  return value.toFixed(2) + '円'
}
