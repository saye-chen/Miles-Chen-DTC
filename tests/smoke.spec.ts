import { test, expect } from '@playwright/test'

/** 冒烟测试：路由、首屏、商品页、404 语义、语言切换、图片格式、reduced-motion。 */

test.describe('首页', () => {
  test('桌面端：六幕齐全 + 双 CTA + 无控制台错误', async ({ page }) => {
    const errors: string[] = []
    page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()) })
    page.on('pageerror', (err) => errors.push(String(err)))

    await page.goto('/', { waitUntil: 'networkidle' })
    await expect(page).toHaveTitle(/Make room for desire/)
    await expect(page.locator('#hero-title')).toBeVisible()
    await expect(page.locator('.hero-actions .primary-button')).toHaveCount(1)
    await expect(page.locator('.hero-actions .ghost-button')).toHaveCount(1)
    for (const sel of ['.desire-hero', '.body-touch', '.scenes', '.peak-section', '.want-section', '.shop-reveal']) {
      await expect(page.locator(sel)).toHaveCount(1)
    }
    expect(errors).toEqual([])
  })

  test('桌面端：首屏标题不被固定导航遮挡，CTA 可点击跳转', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' })
    const h1 = page.locator('#hero-title')
    const box = await h1.boundingBox()
    expect(box).not.toBeNull()
    // 固定 header 高度约 48–84px，标题顶部应在 header 下方
    expect(box!.y).toBeGreaterThan(40)
    await page.locator('.hero-actions .ghost-button').click()
    await expect(page).toHaveURL(/\/shop/)
  })

  test('影像以 AVIF 下发（<picture> srcset 生效）', async ({ page }) => {
    const avif: string[] = []
    page.on('response', (res) => { if (res.url().includes('.avif')) avif.push(res.url()) })
    await page.goto('/', { waitUntil: 'networkidle' })
    expect(avif.length).toBeGreaterThan(0)
  })

  test('移动端：内容可滚动到底，页脚可见，章节进度存在', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' })
    await expect(page.locator('.mobile-progress')).toBeAttached()
    // 移动端 hero 标题不贴顶（在固定导航下方）
    const h1 = await page.locator('#hero-title').boundingBox()
    expect(h1!.y).toBeGreaterThan(40)
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(1200)
    await expect(page.locator('.commerce-footer')).toBeVisible()
  })

  test('首屏影像铺满视口：右缘与下缘无留白', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' })
    const box = await page.locator('.hero-bg').evaluate((el) => {
      const r = el.getBoundingClientRect()
      return { left: r.left, right: r.right, top: r.top, bottom: r.bottom, vw: window.innerWidth, vh: window.innerHeight }
    })
    expect(box.left).toBeLessThanOrEqual(0)
    expect(box.top).toBeLessThanOrEqual(0)
    expect(box.right).toBeGreaterThanOrEqual(box.vw)
    expect(box.bottom).toBeGreaterThanOrEqual(box.vh)
  })

  test('桌面端：02/06 幕影像铺到视口右缘、无圆角卡片感、无横向溢出', async ({ page }) => {
    const viewport = page.viewportSize()
    test.skip(viewport && viewport.width < 961, '全幅浮现式布局仅桌面端（>960px）')
    await page.goto('/', { waitUntil: 'networkidle' })
    // 全幅浮现式面板不应撑出横向滚动
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
    expect(overflow).toBeLessThanOrEqual(1)
    for (const sel of ['.touch-lens', '.shop-visual']) {
      const box = await page.locator(sel).evaluate((el) => {
        const r = el.getBoundingClientRect()
        return { right: r.right, vw: window.innerWidth, radius: getComputedStyle(el).borderRadius }
      })
      expect(box.right).toBeGreaterThanOrEqual(box.vw - 1)
      expect(box.radius).toBe('0px')
    }
    // 第二幕影像左缘通过 mask 淡出到黑暗（"从暗部里浮现"，去贴图卡片感）
    const masked = await page.locator('.touch-lens').evaluate((el) => {
      const s = getComputedStyle(el)
      return s.maskImage !== 'none' || s.webkitMaskImage !== 'none'
    })
    expect(masked).toBe(true)
  })

  test('语言切换：英文 → 中文（标题与 html lang 同步）', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' })
    await page.locator('.language-button').click()
    await expect(page.locator('#hero-title')).toContainText('承认吧')
    await expect(page).toHaveTitle(/给欲望留一点空间/)
    const lang = await page.locator('html').getAttribute('lang')
    expect(lang).toBe('zh-CN')
  })

  test('reduced-motion：不启动动效，内容默认可见', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/', { waitUntil: 'networkidle' })
    await expect(page.locator('.want-copy h2')).toBeVisible()
    await expect(page.locator('.body-touch h2')).toBeVisible()
  })

  test('右侧章节导航：触发式悬浮，不遮挡背景、不挤压布局', async ({ page }) => {
    const viewport = page.viewportSize()
    test.skip(viewport && viewport.width < 961, '章节导航仅桌面端（>960px）显示')
    await page.goto('/', { waitUntil: 'networkidle' })
    const nav = page.locator('.chapter-nav')
    const zoneX = viewport!.width - 20
    const midY = Math.round(viewport!.height / 2)
    // 静止态：完全透明、不拦截指针
    await expect(nav).toHaveCSS('opacity', '0')
    await expect(nav).toHaveCSS('pointer-events', 'none')
    // 鼠标靠近右缘热区 → 浮现
    await page.mouse.move(zoneX, midY)
    await expect(nav).toHaveCSS('opacity', '1')
    await expect(nav).toHaveCSS('pointer-events', 'auto')
    // 悬停 → 章节列表悬浮展开
    await page.mouse.move(zoneX - 6, midY)
    await expect(page.locator('.chapter-nav__list')).toHaveClass(/is-open/)
    // 点击第 4 幕跳转
    await page.locator('.chapter-nav__list button').nth(3).click()
    await page.waitForTimeout(900)
    const peakTop = await page.locator('.peak-section').evaluate((el) => Math.round(el.getBoundingClientRect().top))
    expect(peakTop).toBeLessThan(150)
    // 鼠标移开后导航重新隐藏
    await page.mouse.move(Math.round(viewport!.width / 2), midY)
    await expect(nav).toHaveCSS('opacity', '0')
  })
})

test.describe('商品与商店', () => {
  test('商店页渲染 3 件演示商品，筛选可用', async ({ page }) => {
    await page.goto('/shop', { waitUntil: 'networkidle' })
    await expect(page.locator('.catalog-card')).toHaveCount(3)
    await page.getByRole('button', { name: 'Alone' }).click()
    await expect(page.locator('.catalog-card')).toHaveCount(1)
  })

  test('商品详情可加入购物袋', async ({ page }) => {
    await page.goto('/product/the-object', { waitUntil: 'networkidle' })
    await page.getByRole('button', { name: /Add to bag/ }).click()
    await expect(page.getByRole('link', { name: /View bag/ })).toBeVisible()
  })

  test('未知商品返回真实 404 品牌页', async ({ page }) => {
    const res = await page.goto('/product/unknown-object')
    expect(res?.status()).toBe(404)
    await expect(page.locator('.error-page__title')).toBeVisible()
  })
})

test.describe('路由与 SEO', () => {
  test('未知路径 404 + 品牌错误页', async ({ page }) => {
    const res = await page.goto('/definitely-not-here')
    expect(res?.status()).toBe(404)
    await expect(page.locator('.error-page__title')).toContainText('Only the dark')
  })

  test('信息页白名单：/faq 正常，非白名单 404', async ({ page }) => {
    await page.goto('/faq')
    await expect(page.locator('.info-page h1')).toHaveText('Frequently asked questions')
    const res = await page.goto('/random-page')
    expect(res?.status()).toBe(404)
  })

  test('journal 文章：/journal/2 正常，/journal/99 404', async ({ page }) => {
    await page.goto('/journal/2')
    await expect(page.locator('.article-page')).toBeVisible()
    const res = await page.goto('/journal/99')
    expect(res?.status()).toBe(404)
  })

  test('SSR 输出 canonical 与 description', async ({ page }) => {
    await page.goto('/shop')
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href')
    expect(canonical).toContain('/shop')
    const description = await page.locator('meta[name="description"]').getAttribute('content')
    expect(description).toBeTruthy()
  })
})
