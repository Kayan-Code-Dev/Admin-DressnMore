import { useTranslation } from 'react-i18next';
import { type Payment } from '../../../mocks/payments';

const methodConfig: Record<string, { icon: string; color: string }> = {
  visa:  { icon: 'ri-visa-fill',                   color: 'text-indigo-600' },
  mada:  { icon: 'ri-bank-card-2-line',            color: 'text-emerald-600' },
  stc:   { icon: 'ri-smartphone-line',             color: 'text-teal-600' },
  bank:  { icon: 'ri-bank-line',                   color: 'text-gray-600' },
  cash:  { icon: 'ri-money-dollar-circle-line',    color: 'text-amber-600' },
};

interface InvoiceModalProps {
  payment: Payment | null;
  onClose: () => void;
}

export default function InvoiceModal({ payment, onClose }: InvoiceModalProps) {
  const { t } = useTranslation();
  if (!payment) return null;

  const subtotal = payment.amount;
  const tax = +(subtotal * 0.15).toFixed(2);
  const total = +(subtotal + tax).toFixed(2);
  const method = methodConfig[payment.method] ?? methodConfig.bank;

  const statusColor: Record<string, string> = {
    paid:     'bg-emerald-50 text-emerald-700',
    pending:  'bg-amber-50 text-amber-700',
    refunded: 'bg-rose-50 text-rose-700',
    failed:   'bg-red-50 text-red-700',
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md my-4" onClick={(e) => e.stopPropagation()}>
        {/* Invoice Header */}
        <div className="px-6 pt-6 pb-4 border-b border-gray-100">
          <div className="flex items-start justify-between mb-4">
            <div>
              <img src="https://static.readdy.ai/image/dd76bd9e94ab1e595fa3cdea807c4d5b/3865dc1217a516805dbcd654d744a8d8.png" alt="Dressnmore" className="h-8 w-auto object-contain mb-2" />
              <p className="text-xs text-gray-400">admin@dressnmore.sa</p>
            </div>
            <div className="text-end">
              <p className="text-xs text-gray-400 uppercase tracking-wider">{t('payments.invoice_modal.title')}</p>
              <p className="text-lg font-bold text-gray-900 mt-0.5">{payment.invoiceId}</p>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold mt-1 ${statusColor[payment.status] ?? 'bg-gray-100 text-gray-600'}`}>
                {t(`status.${payment.status}`, { defaultValue: payment.status })}
              </span>
            </div>
          </div>
        </div>

        {/* Dates Row */}
        <div className="px-6 py-3 bg-gray-50 grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs text-gray-400">{t('payments.invoice_modal.issued_date')}</p>
            <p className="font-semibold text-gray-800 mt-0.5">{payment.date}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">{t('payments.invoice_modal.due_date')}</p>
            <p className="font-semibold text-gray-800 mt-0.5">{payment.dueDate}</p>
          </div>
        </div>

        {/* Bill To */}
        <div className="px-6 py-4 border-b border-gray-100">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">{t('payments.invoice_modal.invoice_to')}</p>
          <p className="text-sm font-bold text-gray-900">{payment.atelier}</p>
          <p className="text-xs text-gray-500 mt-0.5">{payment.atelierEmail}</p>
        </div>

        {/* Line Items */}
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between py-2 bg-gray-50 rounded-lg px-3">
            <div>
              <p className="text-sm font-semibold text-gray-800">{payment.plan} Plan</p>
              <p className="text-xs text-gray-400 capitalize">{t('payments.invoice_modal.billing_cycle')}: {t(`subscriptions.${payment.billingCycle}`)}</p>
            </div>
            <p className="text-sm font-bold text-gray-900">${payment.amount.toLocaleString()}</p>
          </div>
        </div>

        {/* Totals */}
        <div className="px-6 py-4 border-b border-gray-100 space-y-2">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>{t('payments.invoice_modal.subtotal')}</span>
            <span>${subtotal.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>{t('payments.invoice_modal.tax')}</span>
            <span>${tax.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-100">
            <span>{t('payments.invoice_modal.total')}</span>
            <span>${total.toLocaleString()}</span>
          </div>
        </div>

        {/* Payment Method */}
        <div className="px-6 py-3 flex items-center gap-2 bg-gray-50">
          <div className={`w-5 h-5 flex items-center justify-center ${method.color}`}>
            <i className={`${method.icon} text-base`} />
          </div>
          <span className="text-sm text-gray-600">{t(`payments.method.${payment.method}`)}</span>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 flex items-center gap-3">
          <button type="button" onClick={() => window.print()}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer whitespace-nowrap transition-colors">
            <i className="ri-printer-line" />{t('payments.invoice_modal.print')}
          </button>
          <button type="button" onClick={onClose}
            className="flex-1 py-2.5 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 cursor-pointer whitespace-nowrap transition-colors">
            {t('payments.invoice_modal.close')}
          </button>
        </div>
      </div>
    </div>
  );
}
