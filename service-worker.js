const CACHE_NAME = 'browser_extension-v2'
const BASE_URL = '/agents?type=super_agent&from=browser_extension'
const CACHED_URLS = [
  BASE_URL,
  `${BASE_URL}&action=ask_by_image`,
  `${BASE_URL}&action=compare_price`,
  `${BASE_URL}&action=chat_now`,
]

// Disable SW caching on localhost / HTTP to avoid interfering with local dev
const isDev =
  self.location.hostname === 'localhost' ||
  self.location.hostname === '127.0.0.1' ||
  self.location.protocol === 'http:'

let isRefreshPage = false

// Extract `window.genspark_page_id` as a version fingerprint
async function getPageId(response) {
  if (!response) return null
  try {
    const text = await response.clone().text()
    return (
      text.match(/window\.genspark_page_id\s*=\s*['"]([^'"]+)['"]/)?.[1] ?? null
    )
  } catch {
    return null
  }
}

function postRefreshState(target) {
  const msg = {
    type: 'REFRESH_PAGE',
    payload: { is_refresh_page: isRefreshPage },
  }
  if (target) target.postMessage(msg)
  else self.clients.matchAll().then(cs => cs.forEach(c => c.postMessage(msg)))
}

self.addEventListener('message', event => {
  if (event.data?.type === 'GET_IS_REFRESH_PAGE') postRefreshState(event.source)
})

// Stale-while-revalidate for browser_extension entry pages
self.addEventListener('fetch', event => {
  if (isDev) return
  if (!CACHED_URLS.some(url => event.request.url.includes(url))) return

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME)
      const cached = await cache.match(event.request)
      // Clone before returning `cached`: once handed to the browser its body is locked.
      const cachedForCompare = cached?.clone()

      const networkFetch = fetch(event.request)
        .then(response => {
          if (response?.status !== 200) return response
          // Fire-and-forget cache write + version compare so first paint isn't blocked.
          const responseForCompare = response.clone()
          cache
            .put(event.request, response.clone())
            .catch(err => console.log('serverworkerfetcherr cache.put', err))
          ;(async () => {
            const [cachedId, freshId] = await Promise.all([
              getPageId(cachedForCompare),
              getPageId(responseForCompare),
            ])
            isRefreshPage = !(cachedId && freshId && cachedId === freshId)
            postRefreshState()
          })()
          return response
        })
        .catch(err => console.log('serverworkerfetcherr', err))

      return cached || networkFetch
    })()
  )
})
