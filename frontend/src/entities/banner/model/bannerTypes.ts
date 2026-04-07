export interface Banner {
  id: string
  title: string
  subtitle?: string
  buttonText?: string
  buttonLink?: string
  image: string
  mobileImage?: string
  isActive: boolean
  sortOrder: number
}
