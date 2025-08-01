<template>
  <div class="hill-chart-wrapper">
    <svg ref="chartEl" class="hill-chart-svg"></svg>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed } from 'vue';
import HillChart from 'hill-chart';
import 'hill-chart/dist/cjs/styles.css';
import { useTodoStore } from '@/stores/todo.store';

const chartEl = ref<SVGElement | null>(null);
const todoStore = useTodoStore();
let chartInstance: HillChart | null = null;

const chartData = computed(() => {
  return todoStore.todos.map(todo => ({
    id: todo.id,
    x: todo.x,
    y: todo.y,
    color: getColorForPoint(todo.x),
    description: todo.text,
    size: 8
  }));
});

function getColorForPoint(x: number): string {
    if (x < 50) return '#4A90E2'; // Uphill - Blue
    if (x > 50) return '#50E3C2'; // Downhill - Green
    return '#F5A623'; // Top of the hill - Orange
}

function initializeChart() {
  if (chartEl.value) {
    if (chartInstance) {
      // HillChart doesn't have a public destroy or update method in the version I checked.
      // The safest way to re-render is to clear the SVG and create a new instance.
      chartEl.value.innerHTML = '';
    }

    const config = {
      target: '.hill-chart-svg',
      // The library seems to calculate width/height automatically based on the SVG element
    };

    chartInstance = new HillChart(chartData.value, config);
    chartInstance.render();

    chartInstance.on('moved', (data: { id: string, x: number, y: number }) => {
      todoStore.updateTodoPosition(data.id, data.x, data.y);
    });
  }
}

// Watch for changes in the todos and re-render the chart
watch(() => todoStore.todos, () => {
  initializeChart();
}, { deep: true });

onMounted(() => {
  initializeChart();
});

onUnmounted(() => {
  if (chartInstance) {
    // There's no official destroy method, so we'll just clear the SVG to be safe.
    if (chartEl.value) {
        chartEl.value.innerHTML = '';
    }
    chartInstance = null;
  }
});

</script>

<style scoped>
.hill-chart-wrapper {
  width: 100%;
  min-height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.hill-chart-svg {
  width: 100%;
  height: 100%;
}
</style>
