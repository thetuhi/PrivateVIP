import { localise } from './localise'

/**
 * FAQPage structured data, generated from the same array the accordion renders
 * so the rich result and the visible page can never drift apart.
 *
 * Lives here rather than beside the component because a module that exports
 * both components and plain functions breaks Vite's fast refresh.
 */
export function faqJsonLd(groups, lang) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: groups.flatMap((group) =>
      group.items.map((item) => ({
        '@type': 'Question',
        name: localise(item.q, lang),
        acceptedAnswer: { '@type': 'Answer', text: localise(item.a, lang) },
      })),
    ),
  }
}

export default faqJsonLd
