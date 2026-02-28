<!-- src/views/SichuanMap.vue -->
<template>
  <div ref="chartRef" style="width: 100%; height: 600px"></div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts';
import {onMounted, ref} from 'vue';
import sichuanGeoJson from '@/assets/geo/SC.json'; // 本地引入

const chartRef = ref<HTMLDivElement | null>(null);

onMounted(() => {
  if (!chartRef.value) return;

  const chart = echarts.init(chartRef.value);
  chart.showLoading();

  // 注册四川省地图
  echarts.registerMap('Sichuan', sichuanGeoJson as any);

  chart.hideLoading();

  const option = {
    title: {
      text: '四川省各市人口数据演示',
      subtext: '数据为模拟',
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b}<br/>{c} 万人'
    },
    visualMap: {
      min: 50,
      max: 1000,
      left: 'left',
      top: 'bottom',
      text: ['高', '低'],
      inRange: {
        color: ['#e0ffff', '#006edd']
      },
      calculable: true
    },
    series: [
      {
        name: '人口（万人）',
        type: 'map',
        map: 'Sichuan',
        label: {
          show: true
        },
        data: [
          {name: '成都市', value: 2100},
          {name: '绵阳市', value: 700},
          {name: '德阳市', value: 500},
          {name: '南充市', value: 630},
          {name: '遂宁市', value: 430},
          {name: '自贡市', value: 390},
          {name: '攀枝花市', value: 230},
          {name: '泸州市', value: 490},
          {name: '宜宾市', value: 550},
          {name: '乐山市', value: 610},
          {name: '眉山市', value: 480},
          {name: '广元市', value: 370},
          {name: '达州市', value: 660},
          {name: '雅安市', value: 300},
          {name: '资阳市', value: 310},
          {name: '阿坝藏族羌族自治州', value: 150},
          {name: '甘孜藏族自治州', value: 130},
          {name: '凉山彝族自治州', value: 200},
          {name: '广安市', value: 340},
          {name: '巴中市', value: 320},
          {name: '内江市', value: 360}
        ]
      }
    ]
  };

  chart.setOption(option);
});
</script>
