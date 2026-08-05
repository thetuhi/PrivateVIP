import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowRight } from 'lucide-react'

import { useSeo } from '../utils/useSeo'

export default function NotFound() {
  const { t } = useTranslation()

  useSeo({
    title: t('common.notFoundTitle'),
    description: t('common.notFoundBody'),
  })

  return (
    <section className="section flex min-h-[70dvh] items-center pt-36">
      <div className="shell max-w-2xl">
        <p className="eyebrow">404</p>
        <h1 className="mt-4 text-display-lg text-balance text-bone">{t('common.notFoundTitle')}</h1>
        <p className="lede mt-6">{t('common.notFoundBody')}</p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link to="/" className="btn-primary">
            {t('common.backHome')}
            <ArrowRight className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
          </Link>
          <Link to="/experiences" className="btn-secondary">
            {t('nav.experiences')}
          </Link>
        </div>
      </div>
    </section>
  )
}
