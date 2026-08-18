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

  test('移动端：内容可滚动到底，页脚可见，章节入口可展开', async ({ page }) => {
    const viewport = page.viewportSize()
    test.skip(viewport && viewport.width > 960, '移动章节入口仅平板与移动端显示')
    await page.goto('/', { waitUntil: 'networkidle' })
    await expect(page.locator('.mobile-progress')).toBeVisible()
    await page.locator('.mobile-progress').click()
    await expect(page.locator('.mobile-chapter-sheet')).toBeVisible()
    await expect(page.locator('.mobile-chapter-sheet button')).toHaveCount(6)
    await page.keyboard.press('Escape')
    await expect(page.locator('.mobile-chapter-sheet')).toBeHidden()
    // 移动端 hero 标题不贴顶（在固定导航下方）
    const h1 = await page.locator('#hero-title').boundingBox()
    expect(h1!.y).toBeGreaterThan(40)
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(1200)
    await expect(page.locator('.commerce-footer')).toBeVisible()
  })

  test('移动端：02—06 幕文字进入全幅影像舞台且不横向溢出', async ({ page }) => {
    const viewport = page.viewportSize()
    test.skip(viewport && viewport.width > 700, '沉浸式章节舞台仅手机断点（≤700px）生效')
    await page.goto('/', { waitUntil: 'networkidle' })

    const layout = await page.evaluate(() => {
      const pairs = [
        ['02', '.body-touch', '.touch-copy', '.touch-lens'],
        ['03', '.scenes', '.scene-copy', '.scene-visual'],
        ['04', '.peak-section', '.peak-copy', '.peak-visual'],
        ['05', '.want-section', '.want-copy', '.want-visual'],
        ['06', '.shop-reveal', '.shop-copy', '.shop-visual'],
      ] as const

      const items = pairs.map(([act, sectionSelector, copySelector, visualSelector]) => {
        const section = document.querySelector<HTMLElement>(sectionSelector)!
        const copy = document.querySelector<HTMLElement>(copySelector)!
        const visual = document.querySelector<HTMLElement>(visualSelector)!
        const picture = visual.querySelector<HTMLElement>('.site-picture')!
        const heading = copy.querySelector<HTMLElement>('h2')!
        const headingStyle = getComputedStyle(heading)
        const explicitLines = [...heading.querySelectorAll<HTMLElement>('.t-line')]
        const sectionRect = section.getBoundingClientRect()
        const copyRect = copy.getBoundingClientRect()
        const visualRect = visual.getBoundingClientRect()
        const pictureRect = picture.getBoundingClientRect()
        const pictureStyle = getComputedStyle(picture)
        const overlapWidth = Math.max(0, Math.min(copyRect.right, visualRect.right) - Math.max(copyRect.left, visualRect.left))
        const overlapHeight = Math.max(0, Math.min(copyRect.bottom, visualRect.bottom) - Math.max(copyRect.top, visualRect.top))
        const copyArea = Math.max(1, copyRect.width * copyRect.height)
        return {
          act,
          sectionHeight: sectionRect.height,
          copyLeft: copyRect.left,
          copyRight: copyRect.right,
          visualLeft: visualRect.left,
          visualRight: visualRect.right,
          visualRadius: getComputedStyle(visual).borderRadius,
          pictureHeightRatio: pictureRect.height / sectionRect.height,
          pictureMask: pictureStyle.maskImage !== 'none' ? pictureStyle.maskImage : pictureStyle.webkitMaskImage,
          overlapRatio: (overlapWidth * overlapHeight) / copyArea,
          headingFontSize: Number.parseFloat(headingStyle.fontSize),
          headingLineHeight: Number.parseFloat(headingStyle.lineHeight),
          headingLineCount: heading.getBoundingClientRect().height / Number.parseFloat(headingStyle.lineHeight),
          explicitLineCounts: explicitLines.map((line) => {
            const lineHeight = Number.parseFloat(getComputedStyle(line).lineHeight)
            return line.getBoundingClientRect().height / lineHeight
          }),
        }
      })

      return {
        overflow: document.documentElement.scrollWidth - window.innerWidth,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
        items,
      }
    })

    expect(layout.overflow).toBeLessThanOrEqual(1)
    for (const item of layout.items) {
      expect(item.sectionHeight, `${item.act} 幕高度`).toBeGreaterThanOrEqual(Math.min(layout.viewportHeight, 680))
      expect(item.copyLeft, `${item.act} 幕文案左缘`).toBeGreaterThanOrEqual(0)
      expect(item.copyRight, `${item.act} 幕文案右缘`).toBeLessThanOrEqual(layout.viewportWidth + 1)
      expect(item.visualLeft, `${item.act} 幕影像左缘`).toBeLessThanOrEqual(0)
      expect(item.visualRight, `${item.act} 幕影像右缘`).toBeGreaterThanOrEqual(layout.viewportWidth)
      expect(item.visualRadius, `${item.act} 幕影像圆角`).toBe('0px')
      expect(item.overlapRatio, `${item.act} 幕图文重叠比例`).toBeGreaterThan(.9)
      if (item.act === '02') {
        expect(item.pictureHeightRatio, '02 幕竖幅素材保持整屏').toBeGreaterThan(.95)
      } else {
        expect(item.pictureHeightRatio, `${item.act} 幕横幅素材使用独立影像场`).toBeGreaterThan(.5)
        expect(item.pictureHeightRatio, `${item.act} 幕横幅素材避免过度纵向裁切`).toBeLessThan(.65)
        expect(item.pictureMask, `${item.act} 幕影像边缘融入暗场`).not.toBe('none')
      }
      expect(item.headingFontSize, `${item.act} 幕手机标题字号`).toBeLessThanOrEqual(56)
      expect(item.headingLineCount, `${item.act} 幕标题总行数`).toBeLessThanOrEqual(2.2)
      for (const lineCount of item.explicitLineCounts) {
        if (item.act !== '04') {
          expect(lineCount, `${item.act} 幕语义断句不得二次折行`).toBeLessThanOrEqual(1.2)
        }
      }
    }

    await page.locator('.language-button').click()
    const chineseLayout = await page.evaluate(() => {
      const selectors = ['.body-touch h2', '.scenes h2', '.peak-section h2', '.want-section h2', '.shop-reveal h2']
      return {
        overflow: document.documentElement.scrollWidth - window.innerWidth,
        headings: selectors.map((selector) => {
          const heading = document.querySelector<HTMLElement>(selector)!
          const style = getComputedStyle(heading)
          return {
            selector,
            lineCount: heading.getBoundingClientRect().height / Number.parseFloat(style.lineHeight),
          }
        }),
      }
    })
    expect(chineseLayout.overflow).toBeLessThanOrEqual(1)
    for (const heading of chineseLayout.headings) {
      expect(heading.lineCount, `${heading.selector} 中文标题总行数`).toBeLessThanOrEqual(2.2)
    }
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

  test('桌面端：02 幕保留右侧呼吸，06 幕保持完整横向画幅，无横向溢出', async ({ page }) => {
    const viewport = page.viewportSize()
    test.skip(viewport && viewport.width < 961, '全幅浮现式布局仅桌面端（>960px）')
    await page.goto('/', { waitUntil: 'networkidle' })
    // 全幅浮现式面板不应撑出横向滚动
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
    expect(overflow).toBeLessThanOrEqual(1)
    const touch = await page.locator('.touch-lens').evaluate((el) => {
      const r = el.getBoundingClientRect()
      return { rightGap: window.innerWidth - r.right, radius: getComputedStyle(el).borderRadius }
    })
    expect(touch.rightGap).toBeGreaterThanOrEqual(24)
    expect(touch.rightGap).toBeLessThanOrEqual(64)
    expect(touch.radius).toBe('0px')

    const shop = await page.locator('.shop-visual').evaluate((el) => {
      const r = el.getBoundingClientRect()
      const img = el.querySelector('img')
      const style = img ? getComputedStyle(img) : null
      return {
        ratio: r.width / r.height,
        right: r.right,
        vw: window.innerWidth,
        radius: getComputedStyle(el).borderRadius,
        objectFit: style?.objectFit,
        blend: style?.mixBlendMode,
      }
    })
    expect(shop.ratio).toBeGreaterThan(1.7)
    expect(shop.ratio).toBeLessThan(1.84)
    expect(shop.right).toBeGreaterThanOrEqual(shop.vw - 1)
    expect(shop.radius).toBe('0px')
    expect(shop.objectFit).toBe('cover')
    expect(shop.blend).toBe('normal')

    // 两幕均取消视差放大；渐隐只作用于图片，不影响标签与触碰反馈。
    await expect(page.locator('.touch-waist-img')).not.toHaveAttribute('data-parallax', /.+/)
    await expect(page.locator('.shop-material-img')).not.toHaveAttribute('data-parallax', /.+/)
    const fusion = await page.evaluate(() => {
      const touch = document.querySelector<HTMLElement>('.touch-lens')
      const touchPicture = document.querySelector<HTMLElement>('.touch-lens .site-picture')
      const shopScrim = document.querySelector<HTMLElement>('.shop-visual-scrim')
      const footer = document.querySelector<HTMLElement>('.commerce-footer')
      const maskValue = (el: HTMLElement | null) => {
        if (!el) return ''
        const style = getComputedStyle(el)
        return style.maskImage !== 'none' ? style.maskImage : style.webkitMaskImage
      }
      return {
        touchBackground: touch ? getComputedStyle(touch).backgroundImage : '',
        touchPictureMaskCount: (maskValue(touchPicture).match(/linear-gradient/g) || []).length,
        touchOverlayMasked: touch ? getComputedStyle(touch, '::after').maskImage !== 'none' || getComputedStyle(touch, '::after').webkitMaskImage !== 'none' : false,
        shopScrimMaskCount: (maskValue(shopScrim).match(/linear-gradient/g) || []).length,
        footerBorder: footer ? getComputedStyle(footer).borderTopWidth : '',
      }
    })
    expect(fusion.touchBackground).toBe('none')
    expect(fusion.touchPictureMaskCount).toBeGreaterThanOrEqual(2)
    expect(fusion.touchOverlayMasked).toBe(true)
    expect(fusion.shopScrimMaskCount).toBeGreaterThanOrEqual(2)
    expect(fusion.footerBorder).toBe('0px')
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

  test('右侧章节导航：轨道常驻，列表向左展开且可跳转', async ({ page }) => {
    const viewport = page.viewportSize()
    test.skip(viewport && viewport.width < 961, '章节导航仅桌面端（>960px）显示')
    await page.goto('/', { waitUntil: 'networkidle' })
    const nav = page.locator('.chapter-nav')
    const midY = Math.round(viewport!.height / 2)
    await expect(nav).toBeVisible()
    // 悬停常驻轨道，完整列表向左展开，不会越出视口。
    await page.locator('.chapter-nav__rail').hover()
    await expect(page.locator('.chapter-nav__list')).toHaveClass(/is-open/)
    const listBox = await page.locator('.chapter-nav__list').boundingBox()
    expect(listBox).not.toBeNull()
    expect(listBox!.x).toBeGreaterThanOrEqual(0)
    expect(listBox!.x + listBox!.width).toBeLessThanOrEqual(viewport!.width)
    // 点击第 4 幕跳转
    await page.locator('.chapter-nav__list button').nth(3).click()
    await page.waitForTimeout(900)
    const peakTop = await page.locator('.peak-section').evaluate((el) => Math.round(el.getBoundingClientRect().top))
    expect(peakTop).toBeLessThan(150)
    // 鼠标移开后仅收起列表，进度轨仍可见。
    await page.mouse.move(Math.round(viewport!.width / 2), midY)
    await expect(page.locator('.chapter-nav__list')).not.toHaveClass(/is-open/)
    await expect(nav).toBeVisible()
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
