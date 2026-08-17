<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()

const { language } = useSiteLanguage()
const copy = computed(() => language.value === 'zh'
  ? {
      code: props.error.statusCode,
      title: props.error.statusCode === 404 ? '这里只有黑暗。' : '出了点差错。',
      body: props.error.statusCode === 404
        ? '你寻找的那道门不在这里。回到开头，重新走一遍。'
        : '请稍后再试。你的欲望不会跑远。',
      home: '回到首页',
      shop: '进入商店',
    }
  : {
      code: props.error.statusCode,
      title: props.error.statusCode === 404 ? 'Only the dark lives here.' : 'Something went wrong.',
      body: props.error.statusCode === 404
        ? 'The door you are looking for is not here. Return to the beginning and walk it again.'
        : 'Try again in a moment. Your desire will not wander far.',
      home: 'Back home',
      shop: 'Enter the shop',
    })

usePageMeta(() => ({
  title: copy.value.title,
  description: copy.value.body,
}))
</script>

<template>
  <div class="inner-page error-page">
    <SiteHeader />
    <main id="main-content" class="error-page__main">
      <p class="error-page__code">{{ copy.code }}</p>
      <h1 class="art-title error-page__title">{{ copy.title }}</h1>
      <p class="error-page__body">{{ copy.body }}</p>
      <div class="error-page__actions">
        <NuxtLink class="primary-button" to="/">{{ copy.home }} <span>←</span></NuxtLink>
        <NuxtLink class="ghost-button" to="/shop">{{ copy.shop }} <span>→</span></NuxtLink>
      </div>
    </main>
    <SiteFooter />
  </div>
</template>
