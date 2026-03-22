<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Line } from 'vue-chartjs'
import type { SimulationRun } from '../types'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const props = defineProps<{
  runs: SimulationRun[]
}>()

const isOpen = ref(true)

const chartData = computed(() => ({
  labels: Array.from({ length: 12 }, (_, i) => `${i + 1}月`),
  datasets: props.runs.map((run, i) => ({
    label: `パターン${i + 1}`,
    data: run.rates,
    borderColor: 'rgba(99, 102, 241, 0.25)',
    borderWidth: 1,
    pointRadius: 0,
    tension: 0.1,
  })),
}))

const chartOptions = {
  responsive: true,
  animation: false as const,
  plugins: {
    legend: { display: false },
    title: { display: false },
    tooltip: { enabled: false },
  },
  scales: {
    y: {
      title: { display: true, text: '円/USD' },
    },
  },
}
</script>

<template>
  <section class="bg-white rounded-lg shadow">
    <button
      class="flex items-center gap-2 w-full px-4 py-3 text-left font-semibold hover:bg-gray-50 rounded-lg"
      @click="isOpen = !isOpen"
      :aria-expanded="isOpen"
    >
      <span :class="['transition-transform text-sm text-gray-400', isOpen ? 'rotate-90' : '']">▶</span>
      全パターンの為替推移
    </button>

    <div v-if="isOpen" class="px-4 pb-4">
      <Line :data="chartData" :options="chartOptions" />
    </div>
  </section>
</template>
