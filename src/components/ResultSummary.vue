<script setup lang="ts">
import { SCENARIO_KEYS, SCENARIO_LABELS } from '../constants'
import type { SimulationSummary } from '../types'

defineProps<{
  summary: SimulationSummary
}>()
</script>

<template>
  <section class="bg-white rounded-lg shadow p-4" data-testid="result-summary">
    <h2 class="text-lg font-semibold mb-4">最安シナリオの集計</h2>

    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <div
        v-for="key in SCENARIO_KEYS"
        :key="key"
        class="border rounded-lg p-3 text-center"
      >
        <p class="text-xs text-gray-500 mb-1">{{ SCENARIO_LABELS[key] }}</p>
        <p class="text-2xl font-bold text-indigo-600">{{ summary.cheapestCount[key] }}<span class="text-sm font-normal text-gray-500">回</span></p>
        <p class="text-sm text-gray-600">{{ summary.cheapestProb[key].toFixed(1) }}%</p>
      </div>
    </div>
  </section>
</template>
