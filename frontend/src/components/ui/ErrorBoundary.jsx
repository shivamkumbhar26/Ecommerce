import { Component } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo })
    // In production, you'd send this to an error reporting service:
    // e.g. Sentry.captureException(error, { extra: errorInfo })
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-ink-950">
          <div className="max-w-md w-full text-center">
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
            <h1 className="font-display text-2xl font-bold text-ink-50 mb-2">
              Something went wrong
            </h1>
            <p className="text-ink-400 text-sm mb-6">
              An unexpected error occurred. Please try reloading the page.
            </p>

            {import.meta.env.DEV && this.state.error && (
              <details className="text-left bg-ink-900 border border-ink-800 rounded-xl p-4 mb-6">
                <summary className="text-xs text-ink-500 cursor-pointer hover:text-ink-300 mb-2">
                  Error details (dev only)
                </summary>
                <pre className="text-xs text-red-400 overflow-auto whitespace-pre-wrap">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}

            <button
              onClick={this.handleReset}
              className="btn-primary mx-auto"
            >
              <RefreshCw className="w-4 h-4" />
              Reload page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}