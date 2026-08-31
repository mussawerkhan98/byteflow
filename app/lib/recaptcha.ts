declare global {
  interface Window {
    grecaptcha?: {
      ready: (callback: () => void) => void
      execute: (siteKey: string, options: { action: string }) => Promise<string>
    }
  }
}

export function getRecaptchaToken(action: string): Promise<string> {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY
  if (!siteKey || typeof window === 'undefined' || !window.grecaptcha) return Promise.resolve('')
  return new Promise((resolve) => {
    window.grecaptcha!.ready(() => {
      window.grecaptcha!.execute(siteKey, { action }).then(resolve).catch(() => resolve(''))
    })
  })
}
