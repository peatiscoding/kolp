import { KolpServiceContext } from '../context'
export const getClientDevice = (ctx: KolpServiceContext): string => {
  const {
    'cloudfront-is-desktop-viewer': isDesktop,
    'cloudfront-is-mobile-viewer': isMobile,
    'cloudfront-is-smarttv-viewer': isSmartTV,
    'cloudfront-is-tablet-viewer': isTablet,
  } = ctx.req.headers

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
