export type SiteConfig = {
  name: string
  author: string
  description: string
  keywords: Array<string>
  locale: string
  type: string
  publishedTime: string
  twitterCard: string
  url: {
    base: string
    author: string
  }
  links: {
    github: string
  }
  ogImage: string
}

export interface BreadcrumbType {
  label: string
  href: string
  isCurrent?: boolean
}
