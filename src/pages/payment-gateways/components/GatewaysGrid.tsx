import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PaymentGateway, GatewayType } from '../../../mocks/paymentGateways';
import ConfirmModal from '../../../components/base/ConfirmModal';

interface GatewaysGridProps {
  gateways: PaymentGateway[];
  onEdit: (g: PaymentGateway) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const TYPE_ICONS: Record<GatewayType, string> = {
  bank: 'ri-bank-line',
  vodafone_cash: 'ri-smartphone-line',
  instapay: 'ri-flashlight-line',
  orange_cash: 'ri-money-dollar-circle-line',
  etisalat_cash: 'ri-sim-card-line',
  fawry: 'ri-store-line',
  other: 'ri-wallet-3-line',
};

const TYPE_BG: Record<GatewayType, string> = {
  bank: 'bg-teal-500',
  vodafone_cash: 'bg-rose-500',
  instapay: 'bg-amber-500',
  orange_cash: 'bg-orange-500',
  etisalat_cash: 'bg-green-500',
  fawry: 'bg-indigo-500',
  other: 'bg-gray-500',
};

const TYPE_LIGHT: Record<GatewayType, string> = {
  bank: 'bg-teal-50 text-teal-700 ring-teal-200',
  vodafone_cash: 'bg-rose-50 text-rose-700 ring-rose-200',
  instapay: 'bg-amber-50 text-amber-700 ring-amber-200',
  orange_cash: 'bg-orange-50 text-orange-700 ring-orange-200',
  etisalat_cash: 'bg-green-50 text-green-700 ring-green-200',
  fawry: 'bg-indigo-50 text-indigo-700 ring-indigo-200',
  other: 'bg-gray-50 text-gray-700 ring-gray-200',
};

export default function GatewaysGrid({ gateways, onEdit, onToggle, onDelete }: GatewaysGridProps) {
  const { t } = useTranslation();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<PaymentGateway | null>(null);
  const [confirmToggle, setConfirmToggle] = useState<PaymentGateway | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (gateways.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-2xl mb-4">
          <i className="ri-bank-card-line text-3xl text-gray-400" />
        </div>
        <p className="text-base font-semibold text-gray-500">{t('payment_gateways.no_gateways')}</p>
        <p className="text-sm text-gray-400 mt-1">أضف أول بوابة دفع يدوية للأتيليهات</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
        {gateways.map((gw) => (
          <div
            key={gw.id}
            className={`bg-white rounded-2xl ring-1 overflow-hidden transition-all ${
              gw.isActive ? 'ring-gray-100' : 'ring-gray-200 opacity-70'
            }`}
          >
            {/* Card Header */}
            <div className="flex items-start justify-between px-5 pt-5 pb-4">
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 flex items-center justify-center rounded-xl ${TYPE_BG[gw.type]} flex-shrink-0`}>
                  <i className={`${TYPE_ICONS[gw.type]} text-xl text-white`} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 leading-snug">{gw.name}</h3>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ring-1 mt-1 ${TYPE_LIGHT[gw.type]}`}>
                    {t(`payment_gateways.types.${gw.type}`)}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                  gw.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${gw.isActive ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                  {gw.isActive ? 'نشطة' : 'غير نشطة'}
                </span>
              </div>
            </div>

            {/* Account Info */}
            <div className="px-5 pb-3 space-y-2.5">
              {/* Account Holder */}
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                  <i className="ri-user-3-line text-gray-400 text-sm" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs text-gray-400">{t('payment_gateways.labels.account_holder')}</span>
                  <p className="text-sm font-medium text-gray-800 truncate">{gw.accountHolder}</p>
                </div>
              </div>

              {/* Account Number */}
              <div className="flex items-center justify-between gap-2 bg-gray-50 rounded-lg px-3 py-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                    <i className="ri-hashtag text-gray-400 text-sm" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs text-gray-400">{t('payment_gateways.labels.account_number')}</span>
                    <p className="text-sm font-mono font-semibold text-gray-900 truncate">{gw.accountNumber}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(gw.id, gw.accountNumber)}
                  className="flex-shrink-0 flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md bg-white ring-1 ring-gray-200 hover:bg-gray-100 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <i className={`${copiedId === gw.id ? 'ri-check-line text-emerald-500' : 'ri-file-copy-line text-gray-500'} text-xs`} />
                  {copiedId === gw.id ? t('payment_gateways.copied') : t('payment_gateways.copy_number')}
                </button>
              </div>

              {/* Bank Name + IBAN (for bank type) */}
              {gw.type === 'bank' && gw.bankName && (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                    <i className="ri-bank-line text-gray-400 text-sm" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs text-gray-400">{t('payment_gateways.labels.bank_name')}</span>
                    <p className="text-sm font-medium text-gray-800 truncate">{gw.bankName}</p>
                  </div>
                </div>
              )}
              {gw.type === 'bank' && gw.iban && (
                <div className="flex items-center justify-between gap-2 bg-teal-50 rounded-lg px-3 py-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                      <i className="ri-bank-card-2-line text-teal-600 text-sm" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs text-teal-500">{t('payment_gateways.labels.iban')}</span>
                      <p className="text-xs font-mono font-semibold text-teal-800 truncate">{gw.iban}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(`iban-${gw.id}`, gw.iban || '')}
                    className="flex-shrink-0 flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md bg-white ring-1 ring-teal-200 hover:bg-teal-50 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <i className={`${copiedId === `iban-${gw.id}` ? 'ri-check-line text-emerald-500' : 'ri-file-copy-line text-teal-500'} text-xs`} />
                    نسخ
                  </button>
                </div>
              )}

              {/* Instructions expandable */}
              <div className="border-t border-gray-100 pt-2.5">
                <button
                  type="button"
                  onClick={() => setExpandedId(expandedId === gw.id ? null : gw.id)}
                  className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 cursor-pointer transition-colors w-full"
                >
                  <div className="w-4 h-4 flex items-center justify-center">
                    <i className="ri-information-line text-sm" />
                  </div>
                  {t('payment_gateways.labels.instructions')}
                  <div className="w-4 h-4 flex items-center justify-center mr-auto">
                    <i className={`${expandedId === gw.id ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'} text-sm`} />
                  </div>
                </button>
                {expandedId === gw.id && (
                  <p className="mt-2 text-xs text-gray-600 leading-relaxed bg-gray-50 rounded-lg p-3">
                    {gw.instructions}
                  </p>
                )}
              </div>
            </div>

            {/* Card Footer */}
            <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 bg-gray-50/60">
              <div className="flex items-center gap-1.5 text-xs text-gray-400">
                <div className="w-4 h-4 flex items-center justify-center">
                  <i className="ri-history-line text-sm" />
                </div>
                <span>{gw.usageCount} {t('payment_gateways.labels.usage')}</span>
                <span className="mx-1">·</span>
                <span>{gw.createdAt}</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => onEdit(gw)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
                  title="تعديل"
                >
                  <i className="ri-edit-line text-sm" />
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmToggle(gw)}
                  className={`w-7 h-7 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
                    gw.isActive
                      ? 'hover:bg-amber-100 text-amber-500 hover:text-amber-700'
                      : 'hover:bg-emerald-100 text-emerald-500 hover:text-emerald-700'
                  }`}
                  title={gw.isActive ? 'إيقاف' : 'تفعيل'}
                >
                  <i className={`${gw.isActive ? 'ri-pause-circle-line' : 'ri-play-circle-line'} text-sm`} />
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(gw)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-rose-100 text-gray-400 hover:text-rose-600 transition-colors cursor-pointer"
                  title="حذف"
                >
                  <i className="ri-delete-bin-line text-sm" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirm */}
      <ConfirmModal
        isOpen={!!confirmDelete}
        title="حذف بوابة الدفع"
        message={t('payment_gateways.confirm_delete')}
        confirmVariant="danger"
        onConfirm={() => {
          if (confirmDelete) onDelete(confirmDelete.id);
          setConfirmDelete(null);
        }}
        onClose={() => setConfirmDelete(null)}
      />

      {/* Toggle Confirm */}
      <ConfirmModal
        isOpen={!!confirmToggle}
        title={confirmToggle?.isActive ? 'إيقاف البوابة' : 'تفعيل البوابة'}
        message={confirmToggle?.isActive
          ? t('payment_gateways.confirm_toggle_off')
          : t('payment_gateways.confirm_toggle_on')}
        confirmVariant={confirmToggle?.isActive ? 'warning' : 'success'}
        onConfirm={() => {
          if (confirmToggle) onToggle(confirmToggle.id);
          setConfirmToggle(null);
        }}
        onClose={() => setConfirmToggle(null)}
      />
    </>
  );
}
