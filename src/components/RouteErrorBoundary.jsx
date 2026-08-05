import { Component } from 'react'
import { withTranslation } from 'react-i18next'

/**
 * Catches render errors inside a lazily loaded route so one broken page shows
 * a recoverable message instead of blanking the whole site.
 *
 * Class component because error boundaries have no hook equivalent.
 */
class RouteErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    // Left as console output deliberately: there is no error-reporting service
    // wired up yet, and swallowing this silently would make the site hard to
    // debug in production.
    console.error('Route render failed:', error, info)
  }

  render() {
    const { t, children } = this.props

    if (!this.state.hasError) return children

    return (
      <div className="shell flex min-h-[60vh] flex-col items-center justify-center py-section text-center">
        <h1 className="text-display-sm text-bone">{t('common.errorTitle')}</h1>
        <p className="prose-body mt-4">{t('common.errorBody')}</p>
        <button type="button" onClick={() => window.location.reload()} className="btn-primary mt-8">
          {t('common.reload')}
        </button>
      </div>
    )
  }
}

export default withTranslation()(RouteErrorBoundary)
