import Cookie, { CookieAttributes } from 'js-cookie'

export interface ICookieHelper {
  set(name: string, value: string, options?: CookieAttributes): void
  get(name: string, value: string): string
  destroy(name: string): void
}

class CookieHelper implements ICookieHelper {
  set(name: string, value: string, options?: CookieAttributes) {
    Cookie.set(name, value, options)
  }

  get(name: string) {
    return Cookie.get(name) || ''
  }

  destroy(name: string) {
    Cookie.remove(name)
  }
}

export const cookieHelper = new CookieHelper()

export default cookieHelper
