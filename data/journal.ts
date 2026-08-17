/** 夜后手记：本地演示文章。正式内容上线前，字段均为示例文案。 */

export type JournalEntry = {
  slug: string
  eyebrow: { zh: string; en: string }
  title: { zh: string; en: string }
  tagline: { zh: string; en: string }
  body: { zh: string; en: string }
}

export const journalEntries: JournalEntry[] = [
  {
    slug: '1',
    eyebrow: { zh: 'Journal / 文章', en: 'Journal / Note' },
    title: { zh: '等待，\n如何改变房间。', en: 'How waiting\nchanges a room.' },
    tagline: { zh: '关于等待如何改变一间房间。', en: 'How waiting changes a room.' },
    body: {
      zh: '一件物件不是答案。它只是让我们有机会重新注意到身体、光线和时间。正式内容上线前，这里作为本地演示文章。',
      en: 'An object is not an answer. It gives us a reason to notice the body, the light and the time again. This is a local demo article until editorial content is confirmed.',
    },
  },
  {
    slug: '2',
    eyebrow: { zh: 'Journal / 文章', en: 'Journal / Note' },
    title: { zh: '一间房间，\n一种心境。', en: 'A room is\na state of mind.' },
    tagline: { zh: '空间如何替身体保留一段时间。', en: 'How space keeps time for the body.' },
    body: {
      zh: '空间替身体保留一段时间：光线落在哪里，声音停在哪里，都属于我们。这是一篇本地演示文章。',
      en: 'Space keeps time for the body: where light falls, where sound settles — it all belongs to us. This is a local demo article.',
    },
  },
  {
    slug: '3',
    eyebrow: { zh: 'Journal / 文章', en: 'Journal / Note' },
    title: { zh: '给自己\n一段不需解释的时间。', en: 'Permission to\ntake your time.' },
    tagline: { zh: '给自己一段不需要解释的时间。', en: 'A little time that needs no explanation.' },
    body: {
      zh: '不需要向任何人说明为什么慢下来。这是一篇本地演示文章，正式内容上线前不会作为真实编辑内容。',
      en: 'You do not owe anyone an explanation for slowing down. This is a local demo article until editorial content is confirmed.',
    },
  },
]

export const findJournalEntry = (slug: string) => journalEntries.find((entry) => entry.slug === slug)
