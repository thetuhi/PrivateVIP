import { Component } from 'react'
import { withTranslation } from 'react-i18next'
import { RefreshCw, WifiOff, DownloadCloud, TriangleAlert } from 'lucide-react'
import { whatsappLink } from '../utils/contact'
import WhatsAppGlyph from './icons/WhatsAppGlyph'

/**
 * Catches render errors and shows a branded, translated recovery screen instead
 * of a blank page.
 *
 * Class component because error boundaries still have no hook equivalent.
 *
 * Used at two depths, see App.jsx:
 *
 *   scope="route"  inside <main>, so a broken page keeps the header, the
 *                  footer and every escape route around it.
 *   scope="app"    around the whole shell, because the route boundary cannot
 *                  catch a throw from Navbar, Footer or CookieBanner, which sit
 *                  outside it. That was a real hole: a failure in the header
 *                  took the entire site to white with no message at all.
 *
 * The failure is also *classified*, because "something went wrong" is not
 * actionable and the three things that actually go wrong in the field want three
 * different sentences and three different buttons:
 *
 *   offline  the connection dropped. Reloading now will not help; waiting will.
 *   stale    a deploy replaced the chunk this session was mid-way through
 *            fetching. This is the single most common production error in any
 *            code-split SPA and reloading fixes it completely, so it deserves to
 *            say so rather than implying the site is broken.
 *   unknown  a genuine bug. Offer the reload, and offer a person.
 *
 * The technical detail is kept, but folded away in a <details>. A travel client
 * should not be shown a stack trace, and whoever they forward it to needs one,
 * so it is one tap away instead of either missing or in their face.
 */

/**
 * Vite/Rollup code-split failures. The message text differs per browser and per
 * bundler version, so this matches the parts that have stayed stable rather than
 * any single vendor's phrasing.
 */
const STALE_CHUNK = /dynamically imported module|importing a module script failed|chunkloaderror|loading chunk|failed to fetch dynamically/i

function classify(error) {
  // Checked first: offline explains a chunk failure better than the chunk
  // failure does, and a dropped connection is what produces most of them.
  if (typeof navigator !== 'undefined' && navigator.onLine === false) return 'offline'
  if (STALE_CHUNK.test(`${error?.name ?? ''} ${error?.message ?? ''}`)) return 'stale'
  return 'unknown'
}

const ICONS = {
  offline: WifiOff,
  stale: DownloadCloud,
  unknown: TriangleAlert,
}

class RouteErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    // Left as console output deliberately: there is no error-reporting service
    // wired up yet, and swallowing this silently would make the site hard to
    // debug in production.
    console.error('Render failed:', error, info)
    this.setState({ componentStack: info?.componentStack })
  }

  render() {
    const { t, children, scope = 'route' } = this.props
    const { error, componentStack } = this.state

    if (!error) return children

    const kind = classify(error)
    const Icon = ICONS[kind]

    // `stale` is the one kind where reloading is the actual fix rather than a
    // hopeful suggestion, so it gets the primary button. Offline gets it too,
    // because by the time the visitor reads the message they may be back on.
    const detail = [error?.message, componentStack].filter(Boolean).join('\n\n')

    return (
      <div
        role="alert"
        className={`shell flex flex-col items-center justify-center py-section text-center ${
          scope === 'app' ? 'min-h-dvh' : 'min-h-[60vh]'
        }`}
      >
        <Icon className="h-8 w-8 text-brass-500" strokeWidth={1.25} aria-hidden="true" />

        <h1 className="mt-6 text-display-sm text-bone">{t(`common.error.${kind}Title`)}</h1>
        <p className="prose-body mt-4 max-w-prose">{t(`common.error.${kind}Body`)}</p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button type="button" onClick={() => window.location.reload()} className="btn-primary">
            <RefreshCw className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
            {t('common.reload')}
          </button>

          {/* A way to reach a person, not just a way to try again. This is a
              booking site: someone who hit a wall while enquiring should not
              have to find the contact page through a broken interface. */}
          <a
            href={whatsappLink(t('common.error.reportMessage'))}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
          >
            <WhatsAppGlyph className="h-4 w-4" />
            {t('common.error.contact')}
          </a>
        </div>

        {detail && (
          <details className="mt-10 w-full max-w-prose text-left">
            <summary className="cursor-pointer text-xs uppercase tracking-[0.16em] text-bone-muted transition-colors duration-micro ease-enter hover:text-brass-400">
              {t('common.error.details')}
            </summary>
            <pre className="mt-3 max-h-64 overflow-auto rounded-card border border-ink-700 bg-ink-900 p-4 text-left text-xs leading-relaxed text-bone-dim">
              {detail}
            </pre>
          </details>
        )}
      </div>
    )
  }
}

export default withTranslation()(RouteErrorBoundary)
