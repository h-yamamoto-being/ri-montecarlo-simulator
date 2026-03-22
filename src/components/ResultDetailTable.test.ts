import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ResultDetailTable from './ResultDetailTable.vue'
import type { SimulationRun } from '../types'

const mockRuns: SimulationRun[] = Array.from({ length: 3 }, (_, i) => ({
  rates: Array.from({ length: 12 }, (_, m) => 160 + m * 0.5),
  costs: { onDemand: 1000000 + i, riNoUpfront: 900000, riPartialUpfront: 850000, riFullUpfront: 800000 },
  cheapest: 'riFullUpfront' as const,
}))

describe('ResultDetailTable', () => {
  it('レンダリングされる', () => {
    const wrapper = mount(ResultDetailTable, { props: { runs: mockRuns } })
    expect(wrapper.find('section').exists()).toBe(true)
  })

  it('デフォルトで折りたたみ状態（テーブルが非表示）', () => {
    const wrapper = mount(ResultDetailTable, { props: { runs: mockRuns } })
    expect(wrapper.find('table').exists()).toBe(false)
  })

  it('ボタンクリックでテーブルが展開される', async () => {
    const wrapper = mount(ResultDetailTable, { props: { runs: mockRuns } })
    await wrapper.find('button').trigger('click')
    expect(wrapper.find('table').exists()).toBe(true)
  })

  it('もう一度クリックで折りたたまれる', async () => {
    const wrapper = mount(ResultDetailTable, { props: { runs: mockRuns } })
    await wrapper.find('button').trigger('click')
    expect(wrapper.find('table').exists()).toBe(true)
    await wrapper.find('button').trigger('click')
    expect(wrapper.find('table').exists()).toBe(false)
  })

  it('展開後に runs 件数分の行が表示される', async () => {
    const wrapper = mount(ResultDetailTable, { props: { runs: mockRuns } })
    await wrapper.find('button').trigger('click')
    const rows = wrapper.findAll('tbody tr')
    expect(rows).toHaveLength(mockRuns.length)
  })

  it('展開後に12ヶ月のレートが表示される', async () => {
    const wrapper = mount(ResultDetailTable, { props: { runs: mockRuns } })
    await wrapper.find('button').trigger('click')
    expect(wrapper.text()).toContain('160.00円')
  })

  it('最安シナリオのラベルが表示される', async () => {
    const wrapper = mount(ResultDetailTable, { props: { runs: mockRuns } })
    await wrapper.find('button').trigger('click')
    expect(wrapper.text()).toContain('RI・全額前払い')
  })
})
