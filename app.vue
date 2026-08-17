<script setup lang="ts">
import { SITE_NAME } from '~/composables/usePageMeta'

// 全站默认：html lang 与标题模板（页面只传短标题，自动拼站点名）
useHead({
  htmlAttrs: { lang: 'en' },
  titleTemplate: (title?: string) => (title ? `${title} · ${SITE_NAME}` : SITE_NAME),
})
</script>

<template>
  <a class="skip-link" href="#main-content">Skip to content</a>
  <NuxtRouteAnnouncer />
  <NuxtPage />
</template>
