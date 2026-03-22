<script setup lang="ts">
import { ref } from 'vue'
import { SCENARIO_KEYS, SCENARIO_LABELS } from '../constants'
import { formatJpy, formatRate } from '../utils/format'
import type { SimulationRun } from '../types'

defineProps<{
  runs: SimulationRun[]
}>()

const isOpen = ref(false)
</script>

<template>
  <section class="bg-white rounded-lg shadow p-4">
    <button
      class="flex items-center gap-2 text-lg font-semibold w-full text-left"
      @click="isOpen = !isOpen"
      aria-expanded="isOpen"
    >
      <span :class="['transition-transform text-sm', isOpen ? 'rotate-90' : '']">▶</span>
      パターンごとの明細
      <span class="text-sm font-normal text-gray-500 ml-1">（{{ runs.length }}件）</span>
    </button>

    <div v-if="isOpen" class="mt-4 overflow-x-auto">
      <table class="text-xs whitespace-nowrap w-full">
        <thead>
          <tr class="border-b bg-gray-50">
            <th class="py-2 px-2 text-left font-medium text-gray-600 sticky left-0 bg-gray-50">#</th>
            <th
              v-for="m in 12"
              :key="m"
              class="py-2 px-2 text-right font-medium text-gray-600"
            >
              {{ m }}月レート
            </th>
            <th
              v-for="key in SCENARIO_KEYS"
              :key="key"
              class="py-2 px-2 text-right font-medium text-gray-600"
            >
              {{ SCENARIO_LABELS[key] }}
            </th>
            <th class="py-2 px-2 text-left font-medium text-gray-600">最安</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(run, i) in runs"
            :key="i"
            class="border-b last:border-0 hover:bg-gray-50"
          >
            <td class="py-1.5 px-2 text-gray-500 sticky left-0 bg-white">{{ i + 1 }}</td>
            <td
              v-for="(rate, m) in run.rates"
              :key="m"
              class="py-1.5 px-2 text-right text-gray-700"
            >
              {{ formatRate(rate) }}
            </td>
            <td
              v-for="key in SCENARIO_KEYS"
              :key="key"
              :class="[
                'py-1.5 px-2 text-right',
                run.cheapest === key ? 'font-bold text-indigo-600' : 'text-gray-700',
              ]"
            >
              {{ formatJpy(run.costs[key]) }}
            </td>
            <td class="py-1.5 px-2 text-gray-700">{{ SCENARIO_LABELS[run.cheapest] }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
