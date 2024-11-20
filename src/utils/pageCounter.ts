import { Ref } from 'vue'

function pageCounterCallback(
  entries: IntersectionObserverEntry[],
  currentPage: Ref<number, number>,
) {
  let maxIntersection = 0
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i]
    if (entry.intersectionRatio > maxIntersection) {
      currentPage.value = parseInt(entry.target.id.replace('page', ''))
      maxIntersection = entry.intersectionRatio
    }
  }
}

export function usePageCounter(
  containerEl: HTMLElement,
  pageEls: HTMLCollectionOf<Element>,
  currentPage: Ref<number, number>,
) {
  const observer = new IntersectionObserver(
    (entries) => pageCounterCallback(entries, currentPage),
    {
      root: containerEl,
      rootMargin: '0px',
      threshold: [0.5],
    },
  )
  for (let i = 0; i < pageEls.length; i++) {
    observer.observe(pageEls[i])
  }
}
