import { test, expect } from '@playwright/test'

test('アプリが正常に起動する', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/ri-montecarlo-simulator/)
})

// ── 1. シミュレーション実行 ─────────────────────────────────────────────────

test.describe('シミュレーション実行', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('デフォルト設定でボタンを押すと結果セクションが表示される', async ({ page }) => {
    await page.click('[data-testid="run-button"]')
    await expect(page.getByText('最安シナリオの集計')).toBeVisible()
    await expect(page.getByText('年間支払額の分布')).toBeVisible()
    await expect(page.getByText('全パターンの為替推移')).toBeVisible()
  })

  test('最安シナリオの集計・年間支払額の分布・為替推移グラフが表示される', async ({ page }) => {
    await page.click('[data-testid="run-button"]')

    // 最安シナリオの集計：4シナリオのラベルと「N回」が表示される
    const summary = page.locator('[data-testid="result-summary"]')
    await expect(summary).toBeVisible()
    await expect(summary.getByText('オンデマンド')).toBeVisible()
    await expect(summary.getByText('RI・前払いなし')).toBeVisible()
    await expect(summary.locator('text=/\\d+回/').first()).toBeVisible()

    // 年間支払額の分布：最小・平均・最大の列ヘッダーが表示される
    await expect(page.getByText('最小')).toBeVisible()
    await expect(page.getByText('平均')).toBeVisible()
    await expect(page.getByText('最大')).toBeVisible()

    // 為替推移グラフのアコーディオンボタンが表示される
    await expect(page.getByRole('button', { name: /全パターンの為替推移/ })).toBeVisible()
  })
})

// ── 2. パラメータ変更と再実行 ─────────────────────────────────────────────

test.describe('パラメータ変更と再実行', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.click('[data-testid="run-button"]')
    await expect(page.locator('[data-testid="result-summary"]')).toBeVisible()
  })

  test('現在レートを変更して再実行すると結果が更新される', async ({ page }) => {
    await page.locator('[data-testid="input-current-rate"]').fill('200')
    await page.click('[data-testid="run-button"]')
    await expect(page.locator('[data-testid="result-summary"]')).toBeVisible()
    await expect(page.getByText('年間支払額の分布')).toBeVisible()
  })

  test('シミュレーション回数を変更すると集計結果のカウントに反映される', async ({ page }) => {
    await page.locator('[data-testid="input-sim-count"]').fill('10')
    await page.click('[data-testid="run-button"]')

    const summary = page.locator('[data-testid="result-summary"]')
    await expect(summary).toBeVisible()

    // 「N回」を全て抽出して合計が 10 になることを確認
    const text = await summary.textContent() ?? ''
    const counts = [...text.matchAll(/(\d+)回/g)].map(m => parseInt(m[1]))
    const total = counts.reduce((a, b) => a + b, 0)
    expect(total).toBe(10)
  })
})

// ── 3. バリデーション ────────────────────────────────────────────────────────

test.describe('バリデーション', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('現在レートに 0 を入力するとエラーが表示される', async ({ page }) => {
    await page.locator('[data-testid="input-current-rate"]').fill('0')
    await page.click('[data-testid="run-button"]')
    await expect(page.getByText('1〜999 の範囲で入力してください').first()).toBeVisible()
  })

  test('シミュレーション回数に 1001 を入力するとエラーが表示される', async ({ page }) => {
    await page.locator('[data-testid="input-sim-count"]').fill('1001')
    await page.click('[data-testid="run-button"]')
    await expect(page.getByText('10〜1000 の整数で入力してください')).toBeVisible()
  })
})

// ── 4. アコーディオン ────────────────────────────────────────────────────────

test.describe('アコーディオン', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.click('[data-testid="run-button"]')
    await expect(page.locator('[data-testid="result-summary"]')).toBeVisible()
  })

  test('パターンごとの明細テーブルをクリックすると展開される', async ({ page }) => {
    // デフォルトで閉じている
    await expect(page.locator('[data-testid="detail-table"]')).not.toBeVisible()
    await page.getByRole('button', { name: /パターンごとの明細/ }).click()
    await expect(page.locator('[data-testid="detail-table"]')).toBeVisible()
  })

  test('もう一度クリックすると閉じる', async ({ page }) => {
    const toggleButton = page.getByRole('button', { name: /パターンごとの明細/ })
    await toggleButton.click()
    await expect(page.locator('[data-testid="detail-table"]')).toBeVisible()
    await toggleButton.click()
    await expect(page.locator('[data-testid="detail-table"]')).not.toBeVisible()
  })
})
