import { type ReactNode } from 'react';

export interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel: string;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  loading?: boolean;
  /** Visual tone for icon + confirm button */
  variant?: 'danger' | 'warning';
  /** Optional extra content below description (e.g. highlighted name) */
  children?: ReactNode;
}

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel,
  onClose,
  onConfirm,
  loading = false,
  variant = 'danger',
  children,
}: ConfirmDialogProps) {
  if (!open) return null;

  const isDanger = variant === 'danger';
  const iconWrap = isDanger
    ? 'bg-rose-100 text-rose-600 ring-rose-200/60'
    : 'bg-amber-100 text-amber-700 ring-amber-200/60';
  const iconClass = isDanger ? 'ri-delete-bin-6-line' : 'ri-error-warning-line';
  const confirmBtn = isDanger
    ? 'bg-rose-600 text-white hover:bg-rose-700 focus-visible:ring-rose-500/40'
    : 'bg-amber-600 text-white hover:bg-amber-700 focus-visible:ring-amber-500/40';

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-gray-900/50 backdrop-blur-[2px] cursor-default"
        aria-label="Close"
        disabled={loading}
        onClick={() => !loading && onClose()}
      />
      <div className="relative w-full max-w-[420px] rounded-2xl bg-white shadow-2xl shadow-gray-900/10 ring-1 ring-gray-200/80 overflow-hidden">
        <div className="p-6 sm:p-7">
          <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-start gap-4">
            <div
              className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ring-1 ${iconWrap}`}
            >
              <i className={`${iconClass} text-2xl`} aria-hidden />
            </div>
            <div className="min-w-0 flex-1 space-y-2">
              <h2
                id="confirm-dialog-title"
                className="text-lg font-bold text-gray-900 leading-snug"
              >
                {title}
              </h2>
              <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
              {children}
            </div>
          </div>
        </div>
        <div className="flex flex-col-reverse sm:flex-row gap-2 sm:justify-end px-6 pb-6 sm:px-7 bg-gray-50/80 border-t border-gray-100">
          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => void onConfirm()}
            className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer transition-colors ${confirmBtn}`}
          >
            {loading ? (
              <i className="ri-loader-4-line animate-spin text-lg" aria-hidden />
            ) : (
              <i className="ri-delete-bin-line text-base" aria-hidden />
            )}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
