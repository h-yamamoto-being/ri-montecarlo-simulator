<script setup lang="ts">
import { ref } from 'vue'
import type { FxModelParams } from '../types'

defineProps<{
  params: FxModelParams
  errors: Partial<Record<keyof FxModelParams, string>>
}>()

const isOpen = ref(true)
</script>

<template>
  <section class="bg-white rounded-lg shadow">
    <button
      class="flex items-center gap-2 w-full px-4 py-3 text-left font-semibold hover:bg-gray-50 rounded-lg"
      @click="isOpen = !isOpen"
      :aria-expanded="isOpen"
    >
      <span :class="['transition-transform text-sm text-gray-400', isOpen ? 'rotate-90' : '']">▶</span>
      為替モデル設定
    </button>

    <div v-if="isOpen" class="px-4 pb-4 space-y-4">
      <!-- 現在レート -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">現在レート（円/USD）</label>
        <input
          v-model.number="params.currentRate"
          type="number"
          step="0.1"
          data-testid="input-current-rate"
          :class="['border rounded px-3 py-2 w-full text-sm', errors.currentRate ? 'border-red-500' : 'border-gray-300']"
        />
        <p v-if="errors.currentRate" class="text-red-500 text-xs mt-1">{{ errors.currentRate }}</p>
      </div>

      <!-- 想定下限 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">想定下限（円）</label>
        <input
          v-model.number="params.lowerBound"
          type="number"
          step="0.1"
          :class="['border rounded px-3 py-2 w-full text-sm', errors.lowerBound ? 'border-red-500' : 'border-gray-300']"
        />
        <p v-if="errors.lowerBound" class="text-red-500 text-xs mt-1">{{ errors.lowerBound }}</p>
      </div>

      <!-- 想定上限 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">想定上限（円）</label>
        <input
          v-model.number="params.upperBound"
          type="number"
          step="0.1"
          :class="['border rounded px-3 py-2 w-full text-sm', errors.upperBound ? 'border-red-500' : 'border-gray-300']"
        />
        <p v-if="errors.upperBound" class="text-red-500 text-xs mt-1">{{ errors.upperBound }}</p>
      </div>

      <!-- 介入ライン -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">介入ライン（円）</label>
        <input
          v-model.number="params.interventionLine"
          type="number"
          step="0.1"
          :class="['border rounded px-3 py-2 w-full text-sm', errors.interventionLine ? 'border-red-500' : 'border-gray-300']"
        />
        <p v-if="errors.interventionLine" class="text-red-500 text-xs mt-1">{{ errors.interventionLine }}</p>
      </div>

      <!-- 月次変動幅 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">月次変動幅（±円）</label>
        <input
          v-model.number="params.monthlyVariation"
          type="number"
          step="0.1"
          min="0.1"
          max="20"
          :class="['border rounded px-3 py-2 w-full text-sm', errors.monthlyVariation ? 'border-red-500' : 'border-gray-300']"
        />
        <p v-if="errors.monthlyVariation" class="text-red-500 text-xs mt-1">{{ errors.monthlyVariation }}</p>
      </div>

      <!-- 通常時円高確率 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">通常時円高確率（%）</label>
        <input
          v-model.number="params.normalYenStrengthProb"
          type="number"
          step="1"
          min="1"
          max="99"
          :class="['border rounded px-3 py-2 w-full text-sm', errors.normalYenStrengthProb ? 'border-red-500' : 'border-gray-300']"
        />
        <p v-if="errors.normalYenStrengthProb" class="text-red-500 text-xs mt-1">{{ errors.normalYenStrengthProb }}</p>
      </div>

      <!-- 介入時円高確率 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">介入時円高確率（%）</label>
        <input
          v-model.number="params.interventionYenStrengthProb"
          type="number"
          step="1"
          min="1"
          max="99"
          :class="['border rounded px-3 py-2 w-full text-sm', errors.interventionYenStrengthProb ? 'border-red-500' : 'border-gray-300']"
        />
        <p v-if="errors.interventionYenStrengthProb" class="text-red-500 text-xs mt-1">{{ errors.interventionYenStrengthProb }}</p>
      </div>

      <!-- シミュレーション回数 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">シミュレーション回数（10〜1000）</label>
        <input
          v-model.number="params.simCount"
          type="number"
          step="1"
          min="10"
          max="1000"
          data-testid="input-sim-count"
          :class="['border rounded px-3 py-2 w-full text-sm', errors.simCount ? 'border-red-500' : 'border-gray-300']"
        />
        <p v-if="errors.simCount" class="text-red-500 text-xs mt-1">{{ errors.simCount }}</p>
      </div>
    </div>
  </section>
</template>
