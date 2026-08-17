/**
 * 站点级 SEO 常量。
 * 注意：正式域名尚未确认，上线前必须替换 SITE_URL 与默认 OG 图。
 */
export const SITE_URL = 'https://mileschen.example.com'
export const SITE_NAME = 'Miles Chen'

export type PageMetaInput = {
  /** 短标题（不含站点名后缀），如「Shop」；模板会自动拼接为 `Shop · Miles Chen` */
  title: string
  description: string
  /** og:image 绝对路径；缺省使用首页演示图（PNG，兼容各平台抓取） */
  image?: string
  type?: 'website' | 'article'
}

/**
 * 全站页面 SEO 统一入口：html lang、canonical、description、
 * Open Graph（locale/url/site_name/type/image）与 Twitter Card。
 * 语言切换时随 useSiteLanguage 自动更新。
 */
export function usePageMeta(input: MaybeRefOrGetter<PageMetaInput>) {
  const { language } = useSiteLanguage()
  const route = useRoute()

  useHead(() => {
    const isZh = toValue(language) === 'zh'
    return {
      htmlAttrs: { lang: isZh ? 'zh-CN' : 'en' },
      link: [{ rel: 'canonical', href: SITE_URL + route.path }],
    }
  })

  useSeoMeta({
    title: () => toValue(input).title,
    description: () => toValue(input).description,
    ogTitle: () => toValue(input).title,
    ogDescription: () => toValue(input).description,
    ogType: () => toValue(input).type ?? 'website',
    ogImage: () => toValue(input).image ?? `${SITE_URL}/images/journey/hero-v2.png`,
    ogLocale: () => toValue(language) === 'zh' ? 'zh_CN' : 'en_US',
    ogUrl: () => SITE_URL + route.path,
    ogSiteName: () => SITE_NAME,
    twitterCard: 'summary_large_image',
  })
}
