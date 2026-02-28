<template>
  <div class="screen-container">
    <section class="screen-map">
      <div class="map-title">四川省请求流量与攻击线路</div>
      <div ref="mapChartRef" class="map-chart" />
    </section>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import * as echarts from 'echarts';

// 自动从 SC.json 提取四川所有地级市节点和经纬度
const geoCoordMap = ref<Record<string, [number, number]>>({});
const cityNames = ref<string[]>([]);
const attackLines = ref<any[]>([]);
const mapChartRef = ref<HTMLDivElement | null>(null);

function getRandomLines(cityNames: string[], count: number) {
  const lines = [];
  for (let i = 0; i < count; i++) {
    let fromIdx = Math.floor(Math.random() * cityNames.length);
    let toIdx = Math.floor(Math.random() * cityNames.length);
    while (toIdx === fromIdx) toIdx = Math.floor(Math.random() * cityNames.length);
    lines.push([
      { name: cityNames[fromIdx] },
      { name: cityNames[toIdx], value: Math.round(Math.random() * 100 + 20) }
    ]);
  }
  return lines;
}

function convertData(data: any[]) {
  return data.map(item => {
    const fromCoord = geoCoordMap.value[item[0].name];
    const toCoord = geoCoordMap.value[item[1].name];
    if (fromCoord && toCoord) {
      return {
        fromName: item[0].name,
        toName: item[1].name,
        coords: [fromCoord, toCoord],
        value: item[1].value,
      };
    }
    return null;
  }).filter(Boolean);
}

onMounted(() => {
  fetch('/src/assets/geo/SC.json')
    .then(res => res.json())
    .then(scJson => {
      echarts.registerMap('sichuan', scJson);
      // 提取所有地级市名称和经纬度
      const geoMap: Record<string, [number, number]> = {};
      const names: string[] = [];
      (scJson.features || []).forEach((f: any) => {
        const name = f.properties && (f.properties.name || f.properties.NAME);
        const coord = f.properties && f.properties.centroid
          ? f.properties.centroid
          : (f.geometry && f.geometry.coordinates && f.geometry.coordinates[0][0]
              ? f.geometry.coordinates[0][0][0]
              : null);
        // centroid 优先，否则取第一个坐标点
        if (name && coord && Array.isArray(coord)) {
          geoMap[name] = [coord[0], coord[1]];
          names.push(name);
        }
      });
      geoCoordMap.value = geoMap;
      cityNames.value = names;
      attackLines.value = getRandomLines(names, Math.min(30, names.length * 2));
      // 绘制地图
      const mapChart = echarts.init(mapChartRef.value!);
      mapChart.setOption({
        backgroundColor: 'transparent',
        geo: {
          map: 'sichuan',
          roam: true,
          itemStyle: {
            areaColor: '#223b5b',
            borderColor: '#4ec6ff',
            shadowColor: '#0f1c2c',
            shadowBlur: 10,
          },
          emphasis: {
            itemStyle: {
              areaColor: '#2a5caa',
            },
          },
          zoom: 1.2,
          left: 'center',
          top: 'center',
        },
        series: [
          {
            name: '攻击线路',
            type: 'lines',
            coordinateSystem: 'geo',
            zlevel: 2,
            effect: {
              show: true,
              period: 4,
              trailLength: 0.2,
              color: '#fff',
              symbolSize: 4,
            },
            lineStyle: {
              color: '#ff4d4f',
              width: 2,
              opacity: 0.7,
              curveness: 0.3,
            },
            data: convertData(attackLines.value),
            label: { show: false },
          },
          {
            name: '请求节点',
            type: 'effectScatter',
            coordinateSystem: 'geo',
            zlevel: 2,
            rippleEffect: {
              brushType: 'stroke',
            },
            label: { show: false },
            symbolSize: (val: any) => 10,
            itemStyle: {
              color: '#4ec6ff',
            },
            data: names.map(name => ({
              name,
              value: [...geoMap[name], Math.round(Math.random() * 100 + 50)],
            })),
          },
        ],
        tooltip: {
          trigger: 'item',
          formatter: (params: any) => {
            if (params.seriesType === 'lines') {
              return `攻击强度: ${params.data.value}`;
            }
            return '';
          },
        },
      });
    });
});
</script>

<style scoped>
.screen-container {
  background: #101f32;
  min-height: 100vh;
  color: #fff;
  font-family: 'Segoe UI', Arial, sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
}
.screen-map {
  width: 100vw;
  height: 100vh;
  background: rgba(255,255,255,0.04);
  border-radius: 0;
  padding: 0;
  box-shadow: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.map-title {
  text-align: center;
  font-size: 1.3rem;
  color: #4ec6ff;
  margin-bottom: 12px;
  letter-spacing: 2px;
}
.map-chart {
  width: 100vw;
  height: calc(100vh - 40px);
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>