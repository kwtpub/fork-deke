export const PATHS = {
  HOME: '/',
  CATALOG: '/catalog',
  CATALOG_CATEGORY: (slug: string) => `/catalog/${slug}`,
  PRODUCT: (cat: string, slug: string) => `/catalog/${cat}/${slug}`,
  NEWS: '/news',
  NEWS_DETAIL: (slug: string) => `/news/${slug}`,
  ABOUT: '/about',
  CONTACTS: '/contacts',
  DOCS: '/docs',
  CALCULATOR: '/calculator',
  SEARCH: '/search',
  CART: '/cart',
} as const
