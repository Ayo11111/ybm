import defaultSettings from '@/settings'

const title = defaultSettings.title || '医便民'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}