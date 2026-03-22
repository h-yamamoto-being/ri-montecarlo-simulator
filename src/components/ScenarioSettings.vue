<script setup lang="ts">
import type { ScenarioParams } from '../types'

defineProps<{
  params: ScenarioParams
  errors: Partial<Record<keyof ScenarioParams, string>>
}>()
</script>

<template>
  <section class="bg-white rounded-lg shadow p-4">
    <h2 class="text-lg font-semibold mb-4">シナリオ設定</h2>

    <div class="space-y-4">
      <!-- 時間単価 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          時間単価（USD/hour）
        </label>
        <input
          v-model.number="params.hourlyRate"
          type="number"
          step="0.001"
          min="0.001"
          max="999.999"
          :class="[
            'border rounded px-3 py-2 w-full text-sm',
            errors.hourlyRate ? 'border-red-500' : 'border-gray-300',
          ]"
        />
        <p v-if="errors.hourlyRate" class="text-red-500 text-xs mt-1">{{ errors.hourlyRate }}</p>
      </div>

      <!-- 月間稼働時間 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          月間稼働時間（時間）
        </label>
        <input
          v-model.number="params.hoursPerMonth"
          type="number"
          step="1"
          min="1"
          max="744"
          :class="[
            'border rounded px-3 py-2 w-full text-sm',
            errors.hoursPerMonth ? 'border-red-500' : 'border-gray-300',
          ]"
        />
        <p v-if="errors.hoursPerMonth" class="text-red-500 text-xs mt-1">{{ errors.hoursPerMonth }}</p>
      </div>

      <!-- RI一部前払い・前払い額 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          RI一部前払い・前払い額（USD）
        </label>
        <input
          v-model.number="params.riPartialUpfront"
          type="number"
          step="0.01"
          min="0"
          :class="[
            'border rounded px-3 py-2 w-full text-sm',
            errors.riPartialUpfront ? 'border-red-500' : 'border-gray-300',
          ]"
        />
        <p v-if="errors.riPartialUpfront" class="text-red-500 text-xs mt-1">{{ errors.riPartialUpfront }}</p>
      </div>

      <!-- RI一部前払い・月額 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          RI一部前払い・月額（USD）
        </label>
        <input
          v-model.number="params.riPartialMonthly"
          type="number"
          step="0.01"
          min="0"
          :class="[
            'border rounded px-3 py-2 w-full text-sm',
            errors.riPartialMonthly ? 'border-red-500' : 'border-gray-300',
          ]"
        />
        <p v-if="errors.riPartialMonthly" class="text-red-500 text-xs mt-1">{{ errors.riPartialMonthly }}</p>
      </div>
    </div>
  </section>
</template>
