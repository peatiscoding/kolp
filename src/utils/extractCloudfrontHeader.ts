import { Request } from 'koa'
export const getClientDevice = (req: Request): string => {
  const {
    'cloudfront-is-desktop-viewer': isDesktop,
    'cloudfront-is-mobile-viewer': isMobile,
    'cloudfront-is-smarttv-viewer': isSmartTV,
    'cloudfront-is-tablet-viewer': isTablet,
  } = req.headers

  if (isDesktop) {
    return 'desktop'
  } else if (isMobile) {
    return 'mobile'
  } else if (isSmartTV) {
    return 'smartTV'
  } else if (isTablet) {
    return 'tablet'
  }
  return 'Please allowed header on cloudfront'
}
