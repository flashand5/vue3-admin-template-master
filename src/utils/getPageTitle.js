// 获取页面标题，返回页面标题与主题的拼接
import defaultSettings from '@/settings'

const title = defaultSettings.title || 'HRMPASSM'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
