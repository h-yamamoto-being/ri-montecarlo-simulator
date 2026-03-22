import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'

// ResultFxChart（Chart.js 依存）はモック
vi.mock('./components/ResultFxChart.vue', () => ({
  default: defineComponent({
    props: ['runs'],
    template: '<div data-testid="fx-chart" />',
  }),
}))

const { default: App } = await import('./App.vue')

describe('App', () => {
  it('レンダリングされる', () => {
    const wrapper = mount(App)
    expect(wrapper.find('header').exists()).toBe(true)
  })

  it('シミュレーション実行ボタンが存在する', () => {
    const wrapper = mount(App)
    expect(wrapper.find('button').text()).toContain('シミュレーション実行')
  })

  it('初期状態では結果が非表示', () => {
    const wrapper = mount(App)
    expect(wrapper.find('table').exists()).toBe(false)
    expect(wrapper.text()).toContain('シミュレーション実行')
  })

  it('ボタンクリックでシミュレーション結果が表示される', async () => {
    const mockRandom = vi.spyOn(Math, 'random').mockReturnValue(0.5)
    const wrapper = mount(App)
    await wrapper.find('button').trigger('click')
    // ResultSummary, ResultDistribution が表示される
    expect(wrapper.text()).toContain('最安シナリオの集計')
    expect(wrapper.text()).toContain('年間支払額の分布')
    mockRandom.mockRestore()
  })
})
