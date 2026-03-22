<script setup lang="ts">
import { computed } from 'vue'
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
  <section class="bg-white rounded-lg shadow p-4">
    <h2 class="text-lg font-semibold mb-4">全パターンの為替推移</h2>
    <Line :data="chartData" :options="chartOptions" />
  </section>
</template>
