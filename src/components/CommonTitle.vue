<!-- 标题 -->
<template>
    <div class="card-title" :class="light ? '' : 'font-medium'">
        <span class="marker" v-if="showMarker"></span>
        <slot>{{ title }}</slot>
    </div>
</template>

<script lang="ts" setup>
defineProps<{
    title?: string
    showMarker?: boolean
    light?: boolean
}>()
</script>
<style lang="scss" scoped>
.card-title {
    font-size: 18px;
    font-weight: 500;
    letter-spacing: 0px;
    line-height: 24px;
    color: rgba(34, 34, 34, 1);
    display: flex;
    align-items: center;
    .marker {
        display: inline-block;
        width: 3px;
        height: 14px;
        opacity: 1;
        background: var(--color-theme);
        margin-right: 8px;
    }
}
</style>
