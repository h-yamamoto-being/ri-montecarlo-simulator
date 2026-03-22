import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MontecarloSettings from './MontecarloSettings.vue'
import { DEFAULT_FX_MODEL_PARAMS } from '../constants'
import { reactive } from 'vue'

const makeParams = () => reactive({ ...DEFAULT_FX_MODEL_PARAMS })

describe('MontecarloSettings', () => {
  it('エラーなしでレンダリングされる', () => {
    const wrapper = mount(MontecarloSettings, {
      props: { params: makeParams(), errors: {} },
    })
    expect(wrapper.find('section').exists()).toBe(true)
  })

  it('デフォルトで開いており 8 つの入力フィールドが存在する', () => {
    const wrapper = mount(MontecarloSettings, {
      props: { params: makeParams(), errors: {} },
    })
    expect(wrapper.findAll('input')).toHaveLength(8)
  })

  it('トグルボタンをクリックすると入力フィールドが非表示になる', async () => {
    const wrapper = mount(MontecarloSettings, {
      props: { params: makeParams(), errors: {} },
    })
    await wrapper.find('button').trigger('click')
    expect(wrapper.findAll('input')).toHaveLength(0)
  })

  it('simCount のエラー時に赤枠クラスが付く', () => {
    const wrapper = mount(MontecarloSettings, {
      props: {
        params: makeParams(),
        errors: { simCount: '10〜1000 の整数で入力してください' },
      },
    })
    const inputs = wrapper.findAll('input')
    const lastInput = inputs[inputs.length - 1]
    expect(lastInput.classes()).toContain('border-red-500')
  })

  it('エラーメッセージが表示される', () => {
    const wrapper = mount(MontecarloSettings, {
      props: {
        params: makeParams(),
        errors: { monthlyVariation: '範囲エラー' },
      },
    })
    expect(wrapper.text()).toContain('範囲エラー')
  })
})
