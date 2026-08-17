/**
 * 临时截图脚本（不入库）：抓取首页 02/06 幕的桌面端与移动端渲染，供人工复核。
 * 用法：node scripts/capture-acts.mjs
 */
import { chromium } from '@playwright/test'

const base = 'http://127.0.0.1:3100'
const out = 'test-results/shots'

const browser = await chromium.launch()

async function shoot(viewport, label) {
  const page = await browser.newPage({ viewport })
  await page.goto(base + '/', { waitUntil: 'networkidle' })
  await page.waitForTimeout(400)

  // 02 幕
  await page.locator('.body-touch').scrollIntoViewIfNeeded()
  await page.waitForTimeout(900)
  await page.locator('.body-touch').screenshot({ path: `${out}/${label}-act02.png` })

  // 06 幕
  await page.locator('.shop-reveal').scrollIntoViewIfNeeded()
  await page.waitForTimeout(900)
  await page.locator('.shop-reveal').screenshot({ path: `${out}/${label}-act06.png` })

  await page.close()
}

await shoot({ width: 1440, height: 900 }, 'desktop')
await shoot({ width: 375, height: 812 }, 'mobile')

await browser.close()
console.log('screenshots saved to', out)
