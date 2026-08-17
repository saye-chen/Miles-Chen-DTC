<script setup lang="ts">
const isOpen = ref(false)
const route = useRoute()
const { language, toggleLanguage } = useSiteLanguage()

const label = computed(() => language.value === 'zh' ? {
  feeling: '感受',
  shop: '进入商店',
  journal: 'Journal',
  menu: '打开菜单',
  switch: 'EN',
} : {
  feeling: 'Feeling',
  shop: 'Enter shop',
  journal: 'Journal',
  menu: 'Open menu',
  switch: '中',
})

function closeOnEscape(event: KeyboardEvent) {
  if (event.key === 'Escape') isOpen.value = false
}

onMounted(() => window.addEventListener('keydown', closeOnEscape))
onBeforeUnmount(() => window.removeEventListener('keydown', closeOnEscape))
watch(() => route.fullPath, () => { isOpen.value = false })
</script>

<template>
  <header class="site-header">
    <NuxtLink class="wordmark" to="/" aria-label="Miles Chen home">MILES <span>CHEN</span></NuxtLink>

    <nav class="desktop-nav" aria-label="主导航">
      <NuxtLink to="/#feeling">{{ label.feeling }}</NuxtLink>
      <NuxtLink to="/shop">{{ label.shop }}</NuxtLink>
      <NuxtLink to="/journal">{{ label.journal }}</NuxtLink>
    </nav>

    <button
      class="language-button"
      type="button"
      :aria-label="`Switch language to ${label.switch}`"
      @click="toggleLanguage"
    >
      {{ label.switch }}
    </button>

    <NuxtLink class="header-bag" to="/bag" aria-label="Shopping bag">Bag <span>↗</span></NuxtLink>

    <button
      class="menu-button"
      type="button"
      :aria-expanded="isOpen"
      aria-controls="mobile-nav"
      :aria-label="label.menu"
      @click="isOpen = !isOpen"
    >
      <span></span><span></span>
    </button>

    <nav v-if="isOpen" id="mobile-nav" class="mobile-nav" aria-label="移动端导航">
      <NuxtLink to="/#feeling" @click="isOpen = false">{{ label.feeling }}</NuxtLink>
      <NuxtLink to="/shop" @click="isOpen = false">{{ label.shop }}</NuxtLink>
      <NuxtLink to="/journal" @click="isOpen = false">{{ label.journal }}</NuxtLink>
    </nav>
  </header>
</template>
