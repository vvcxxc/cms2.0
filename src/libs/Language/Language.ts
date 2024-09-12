// @ts-nocheck
import sdk from 'sdk'
import EN from './i18n/langEN'
import TH from './i18n/langTH'
import ZH from './i18n/langZH'

const { models } = sdk

export const Language = models.Language

export const t = Language.t

export const globalT = Language._t

export const _t = Language.scope('MesSuite')

export const scope = Language.scope

export const lang = window.app.current.project.current.language

export const getLang = (key: string) => {
  const langMap: Record<string, any> = {
    'en-US': EN,
    th: TH,
    'zh-CN': ZH,
    original: ZH,
  }

  const langKey: Record<string, string> = {
    'en-US': 'EN',
    th: 'TH',
    'zh-CN': 'ZH',
    original: 'ZH',
  }

  return {
    lang: langMap[key] || ZH,
    key: langKey[key],
  }
}

export const getScopeT = (namespace?: string) => {
  if (namespace) {
    return scope(namespace)
  }
  return _t
}
