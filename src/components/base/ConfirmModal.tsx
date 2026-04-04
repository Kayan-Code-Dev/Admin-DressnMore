import { useTranslation } from 'react-i18next';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  confirmVariant?: 'danger' | 'warning' | 'success';
  onConfirm: () => void;
  onClose: () => void;
}

export default function ConfirmModal({
  isOpen, title, message, confirmLabel, confirmVariant = 'danger', onConfirm, onClose,
}: ConfirmModalProps) {
  const { t } = useTranslation();
  if (!isOpen) return null;

  const btnClass = {
    danger:  'bg-rose-600 hover:bg-rose-700 text-white',
    warning: 'bg-amber-500 hover:bg-amber-600 text-white',
    success: 'bg-teal-600 hover:bg-teal-700 text-white',
  }[confirmVariant];

  const iconClass = {
    danger:  { bg: 'bg-rose-50',  icon: 'ri-error-warning-line text-rose-500' },
    warning: { bg: 'bg-amber-50', icon: 'ri-alert-line text-amber-500' },
    success: { bg: 'bg-teal-50',  icon: 'ri-checkbox-circle-line text-teal-500' },
  }[confirmVariant];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 flex flex-col items-center gap-4 text-center">
          <div className={`w-14 h-14 flex items-center justify-center rounded-full ${iconClass.bg}`}>
            <i className={`${iconClass.icon} text-2xl`} />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">{message}</p>
          </div>
        </div>
        <div className="px-6 pb-5 flex items-center gap-3">
          <button type="button" onClick={onClose}
            className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer whitespace-nowrap transition-colors">
            {t('actions.cancel')}
          </button>
          <button type="button" onClick={() => { onConfirm(); onClose(); }}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium cursor-pointer whitespace-nowrap transition-colors ${btnClass}`}>
            {confirmLabel ?? t('actions.confirm')}
          </button>
        </div>
      </div>
    </div>
  );
}
