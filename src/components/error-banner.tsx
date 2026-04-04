type ErrorBannerProps = {
  message: string
  onDismiss?: () => void
}

export function ErrorBanner({ message, onDismiss }: ErrorBannerProps) {
  return (
    <div className="flex items-center justify-between rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
      <span>{message}</span>
      {onDismiss && (
        <button onClick={onDismiss} className="ml-4 text-destructive/70 hover:text-destructive">
          Dismiss
        </button>
      )}
    </div>
  )
}
