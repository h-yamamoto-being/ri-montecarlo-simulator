import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ResultSummary from './ResultSummary.vue'
import type { SimulationSummary } from '../types'

const mockSummary: SimulationSummary = {
  cheapestCount: { onDemand: 10, riNoUpfront: 20, riPartialUpfront: 30, riFullUpfront: 40 },
  cheapestProb: { onDemand: 10, riNoUpfront: 20, riPartialUpfront: 30, riFullUpfront: 40 },
  minCost: { onDemand: 100000, riNoUpfront: 90000, riPartialUpfront: 85000, riFullUpfront: 80000 },
  maxCost: { onDemand: 200000, riNoUpfront: 180000, riPartialUpfront: 170000, riFullUpfront: 160000 },
  avgCost: { onDemand: 150000, riNoUpfront: 135000, riPartialUpfront: 127500, riFullUpfront: 120000 },
}

describe('ResultSummary', () => {
  it('レンダリングされる', () => {
    const wrapper = mount(ResultSummary, { props: { summary: mockSummary } })
    expect(wrapper.find('section').exists()).toBe(true)
  })

  it('4 シナリオ分の集計が表示される', () => {
    const wrapper = mount(ResultSummary, { props: { summary: mockSummary } })
    expect(wrapper.text()).toContain('オンデマンド')
    expect(wrapper.text()).toContain('RI・前払いなし')
    expect(wrapper.text()).toContain('RI・一部前払い')
    expect(wrapper.text()).toContain('RI・全額前払い')
  })

  it('最安回数が表示される', () => {
    const wrapper = mount(ResultSummary, { props: { summary: mockSummary } })
    expect(wrapper.text()).toContain('40')
  })

  it('確率が表示される', () => {
    const wrapper = mount(ResultSummary, { props: { summary: mockSummary } })
    expect(wrapper.text()).toContain('40.0%')
  })
})
