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
    <header class="bg-indigo-700 text-white px-4 py-3 shadow sticky top-0 z-10">
      <div class="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div>
          <h1 class="text-xl font-bold">AWS RDS RI コストシミュレーター</h1>
          <p class="text-indigo-200 text-sm mt-0.5">為替レートをモンテカルロ法でシミュレーションし、4シナリオの年間コストを比較します</p>
        </div>
        <button
          class="shrink-0 bg-white text-indigo-700 hover:bg-indigo-50 font-semibold px-5 py-2 rounded-lg shadow transition-colors"
          data-testid="run-button"
          @click="runSimulation"
        >
          シミュレーション実行
        </button>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 py-6">
      <div class="flex flex-col lg:flex-row gap-6 items-start">

        <!-- 左カラム：設定エリア -->
        <aside class="w-full lg:w-80 xl:w-96 shrink-0 space-y-4 lg:sticky lg:top-6">
          <ScenarioSettings :params="scenarioParams" :errors="scenarioErrors" />
          <MontecarloSettings :params="fxParams" :errors="fxErrors" />

        </aside>

        <!-- 右カラム：結果エリア -->
        <div class="flex-1 space-y-4 min-w-0">
          <template v-if="result">
            <ResultSummary :summary="result.summary" />
            <ResultDistribution :summary="result.summary" />
            <ResultFxChart :runs="result.runs" />
            <ResultDetailTable :runs="result.runs" />
          </template>

          <template v-else>
            <div class="bg-white rounded-lg shadow flex items-center justify-center py-24 text-gray-400">
              <p>左のパネルで設定を確認し、「シミュレーション実行」を押してください</p>
            </div>
          </template>
        </div>

      </div>
    </main>
  </div>
</template>
