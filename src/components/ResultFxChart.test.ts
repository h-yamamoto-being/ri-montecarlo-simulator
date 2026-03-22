import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import type { SimulationRun } from '../types'

// vue-chartjs の Line コンポーネントをモック（jsdom では canvas が動作しないため）
vi.mock('vue-chartjs', () => ({
  Line: defineComponent({
    name: 'Line',
    props: ['data', 'options'],
    template: '<canvas data-testid="chart-canvas" />',
  }),
}))

// モック後にコンポーネントをインポート
const { default: ResultFxChart } = await import('./ResultFxChart.vue')

const mockRuns: SimulationRun[] = Array.from({ length: 5 }, () => ({
  rates: Array(12).fill(160),
  costs: { onDemand: 1000000, riNoUpfront: 900000, riPartialUpfront: 850000, riFullUpfront: 800000 },
  cheapest: 'riFullUpfront' as const,
}))

describe('ResultFxChart', () => {
  it('レンダリングされる', () => {
    const wrapper = mount(ResultFxChart, { props: { runs: mockRuns } })
    expect(wrapper.find('section').exists()).toBe(true)
  })

  it('デフォルトで閉じており、チャートが非表示', () => {
    const wrapper = mount(ResultFxChart, { props: { runs: mockRuns } })
    expect(wrapper.find('[data-testid="chart-canvas"]').exists()).toBe(false)
  })

  it('ボタンクリックでチャートが表示される', async () => {
    const wrapper = mount(ResultFxChart, { props: { runs: mockRuns } })
    await wrapper.find('button').trigger('click')
    expect(wrapper.find('[data-testid="chart-canvas"]').exists()).toBe(true)
  })

  it('もう一度クリックで折りたたまれる', async () => {
    const wrapper = mount(ResultFxChart, { props: { runs: mockRuns } })
    await wrapper.find('button').trigger('click')
    await wrapper.find('button').trigger('click')
    expect(wrapper.find('[data-testid="chart-canvas"]').exists()).toBe(false)
  })

  it('空の runs でもクラッシュしない', () => {
    expect(() => mount(ResultFxChart, { props: { runs: [] } })).not.toThrow()
  })
})
