export const ROUTES = {
  HOME: '/',
  CATALOG: '/catalog',
  CATALOG_CATEGORY: '/catalog/:slug',
  PRODUCT: '/catalog/:categorySlug/:productSlug',
  NEWS: '/news',
  NEWS_DETAIL: '/news/:slug',
  ABOUT: '/about',
  CONTACTS: '/contacts',
  DOCS: '/docs',
  CALCULATOR: '/calculator',
  SEARCH: '/search',
} as const

export const CATEGORY_SLUGS = {
  FACADE: 'fasadnye-materialy',
  ROOFING: 'krovlya',
  GUTTERS: 'vodostoki',
  STAIRS: 'lestnitsy',
} as const
