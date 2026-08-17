<script setup lang="ts">
/**
 * 响应式图片组件：AVIF → WebP → PNG 逐级回退 + srcset 尺寸协商。
 * 传入 PNG 路径时自动推导同名 AVIF/WebP（见 scripts/optimize-images.mjs）。
 * 传其他格式路径时退化为普通 <img>（src 原样输出）。
 * `parallax` 透传到 <img data-parallax>，供滚动视差插件使用。
 */
const props = withDefaults(defineProps<{
  src: string
  alt: string
  sizes?: string
  imgClass?: string
  parallax?: string
  loading?: 'lazy' | 'eager'
  fetchpriority?: 'high' | 'low' | 'auto'
  decoding?: 'async' | 'sync' | 'auto'
}>(), {
  sizes: '100vw',
  loading: 'lazy',
  fetchpriority: 'auto',
  decoding: 'async',
})

const sources = computed(() => {
  if (!props.src.endsWith('.png')) return null
  const base = props.src.slice(0, -4)
  return {
    avif: `${base}.avif 1536w, ${base}-768.avif 768w`,
    webp: `${base}.webp 1536w, ${base}-768.webp 768w`,
  }
})
</script>

<template>
  <picture class="site-picture">
    <template v-if="sources">
      <source type="image/avif" :srcset="sources.avif" :sizes="sizes" />
      <source type="image/webp" :srcset="sources.webp" :sizes="sizes" />
    </template>
    <img
      :src="src"
      :alt="alt"
      :class="imgClass"
      :data-parallax="parallax"
      :loading="loading"
      :fetchpriority="fetchpriority"
      :decoding="decoding"
    />
  </picture>
</template>
