<script setup lang="ts">
import { useSimulator } from './composables/useSimulator'
import ScenarioSettings from './components/ScenarioSettings.vue'
import MontecarloSettings from './components/MontecarloSettings.vue'
import ResultSummary from './components/ResultSummary.vue'
import ResultDistribution from './components/ResultDistribution.vue'
import ResultFxChart from './components/ResultFxChart.vue'
import ResultDetailTable from './components/ResultDetailTable.vue'

const {
  scenarioParams,
  fxParams,
  result,
  scenarioErrors,
  fxErrors,
  runSimulation,
} = useSimulator()
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <header class="bg-indigo-700 text-white px-4 py-4 shadow">
      <h1 class="text-xl font-bold">AWS RDS RI コストシミュレーター</h1>
      <p class="text-indigo-200 text-sm mt-0.5">為替レートをモンテカルロ法でシミュレーションし、4シナリオの年間コストを比較します</p>
    </header>

    <main class="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <!-- 設定パネル -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ScenarioSettings :params="scenarioParams" :errors="scenarioErrors" />
        <MontecarloSettings :params="fxParams" :errors="fxErrors" />
      </div>

      <!-- 実行ボタン -->
      <div class="flex justify-center">
        <button
          class="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3 rounded-lg shadow transition-colors"
          @click="runSimulation"
        >
          シミュレーション実行
        </button>
      </div>

      <!-- 結果パネル -->
      <template v-if="result">
        <ResultSummary :summary="result.summary" />
        <ResultDistribution :summary="result.summary" />
        <ResultFxChart :runs="result.runs" />
        <ResultDetailTable :runs="result.runs" />
      </template>

      <template v-else>
        <div class="text-center text-gray-400 py-12">
          <p>「シミュレーション実行」ボタンを押すと結果が表示されます</p>
        </div>
      </template>
    </main>
  </div>
</template>
