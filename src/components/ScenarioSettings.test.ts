import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ScenarioSettings from './ScenarioSettings.vue'
import { DEFAULT_SCENARIO_PARAMS } from '../constants'
import { reactive } from 'vue'

const makeParams = () => reactive({ ...DEFAULT_SCENARIO_PARAMS })

describe('ScenarioSettings', () => {
  it('エラーなしでレンダリングされる', () => {
    const wrapper = mount(ScenarioSettings, {
      props: { params: makeParams(), errors: {} },
    })
    expect(wrapper.find('section').exists()).toBe(true)
  })

  it('4 つの入力フィールドが存在する', () => {
    const wrapper = mount(ScenarioSettings, {
      props: { params: makeParams(), errors: {} },
    })
    expect(wrapper.findAll('input')).toHaveLength(4)
  })

  it('hourlyRate のエラー時に赤枠クラスが付く', () => {
    const wrapper = mount(ScenarioSettings, {
      props: {
        params: makeParams(),
        errors: { hourlyRate: '0.001〜999.999 の範囲で入力してください' },
      },
    })
    const inputs = wrapper.findAll('input')
    expect(inputs[0].classes()).toContain('border-red-500')
  })

  it('エラーメッセージが表示される', () => {
    const wrapper = mount(ScenarioSettings, {
      props: {
        params: makeParams(),
        errors: { hourlyRate: 'テストエラー' },
      },
    })
    expect(wrapper.text()).toContain('テストエラー')
  })

  it('エラーがない場合は赤枠クラスが付かない', () => {
    const wrapper = mount(ScenarioSettings, {
      props: { params: makeParams(), errors: {} },
    })
    wrapper.findAll('input').forEach(input => {
      expect(input.classes()).not.toContain('border-red-500')
    })
  })
})
