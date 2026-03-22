<script setup lang="ts">
import { SCENARIO_KEYS, SCENARIO_LABELS } from '../constants'
import { formatJpy } from '../utils/format'
import type { SimulationSummary } from '../types'

defineProps<{
  summary: SimulationSummary
}>()
</script>

<template>
  <section class="bg-white rounded-lg shadow p-4">
    <h2 class="text-lg font-semibold mb-4">年間支払額の分布</h2>

    <div class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b">
            <th class="text-left py-2 pr-4 font-medium text-gray-700">シナリオ</th>
            <th class="text-right py-2 px-4 font-medium text-gray-700">最小</th>
            <th class="text-right py-2 px-4 font-medium text-gray-700">平均</th>
            <th class="text-right py-2 px-4 font-medium text-gray-700">最大</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="key in SCENARIO_KEYS" :key="key" class="border-b last:border-0">
            <td class="py-2 pr-4 text-gray-700">{{ SCENARIO_LABELS[key] }}</td>
            <td class="py-2 px-4 text-right text-gray-900">{{ formatJpy(summary.minCost[key]) }}</td>
            <td class="py-2 px-4 text-right font-medium text-indigo-600">{{ formatJpy(summary.avgCost[key]) }}</td>
            <td class="py-2 px-4 text-right text-gray-900">{{ formatJpy(summary.maxCost[key]) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
