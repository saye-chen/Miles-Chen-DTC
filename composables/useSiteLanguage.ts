export type SiteLanguage = 'zh' | 'en'

/** 全站唯一语言状态；组件只读取翻译键，避免中英文在同一状态下混排。 */
export function useSiteLanguage() {
  // 英文是默认国际站语言；用户可通过 Header 切换为中文。
  const language = useState<SiteLanguage>('site-language', () => 'en')
  const toggleLanguage = () => { language.value = language.value === 'zh' ? 'en' : 'zh' }
  return { language, toggleLanguage }
}
