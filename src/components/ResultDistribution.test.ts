import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ResultDistribution from './ResultDistribution.vue'
import type { SimulationSummary } from '../types'

const mockSummary: SimulationSummary = {
  cheapestCount: { onDemand: 10, riNoUpfront: 20, riPartialUpfront: 30, riFullUpfront: 40 },
  cheapestProb: { onDemand: 10, riNoUpfront: 20, riPartialUpfront: 30, riFullUpfront: 40 },
  minCost: { onDemand: 100000, riNoUpfront: 90000, riPartialUpfront: 85000, riFullUpfront: 80000 },
  maxCost: { onDemand: 200000, riNoUpfront: 180000, riPartialUpfront: 170000, riFullUpfront: 160000 },
  avgCost: { onDemand: 150000, riNoUpfront: 135000, riPartialUpfront: 127500, riFullUpfront: 120000 },
}

describe('ResultDistribution', () => {
  it('レンダリングされる', () => {
    const wrapper = mount(ResultDistribution, { props: { summary: mockSummary } })
    expect(wrapper.find('section').exists()).toBe(true)
  })

  it('4 シナリオ分の行が表示される', () => {
    const wrapper = mount(ResultDistribution, { props: { summary: mockSummary } })
    const rows = wrapper.findAll('tbody tr')
    expect(rows).toHaveLength(4)
  })

  it('最小・平均・最大の列ヘッダーが存在する', () => {
    const wrapper = mount(ResultDistribution, { props: { summary: mockSummary } })
    expect(wrapper.text()).toContain('最小')
    expect(wrapper.text()).toContain('平均')
    expect(wrapper.text()).toContain('最大')
  })

  it('formatJpy で円表示される', () => {
    const wrapper = mount(ResultDistribution, { props: { summary: mockSummary } })
    expect(wrapper.text()).toContain('100,000円')
    expect(wrapper.text()).toContain('200,000円')
  })
})
