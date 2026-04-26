import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface CredentialsPopupProps {
    isOpen: boolean;
    onClose: () => void;
    email: string;
    password: string;
    tenantName?: string;
}

export default function CredentialsPopup({
    isOpen,
    onClose,
    email,
    password,
    tenantName,
}: CredentialsPopupProps) {
    const { t } = useTranslation();
    const [copiedField, setCopiedField] = useState<'email' | 'password' | null>(null);

    useEffect(() => {
        if (copiedField) {
            const timer = setTimeout(() => setCopiedField(null), 2000);
            return () => clearTimeout(timer);
        }
    }, [copiedField]);

    if (!isOpen) return null;

    const handleCopy = async (text: string, field: 'email' | 'password') => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedField(field);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-in slide-in-from-bottom-4 duration-300">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                            <i className="ri-check-line text-emerald-600 text-xl" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">
                                {t('credentials.popup.title')}
                            </h3>
                            <p className="text-xs text-gray-500 mt-0.5">
                                {t('credentials.popup.subtitle')}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                        <i className="ri-close-line text-xl" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-5 space-y-4">
                    {tenantName && (
                        <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
                            <p className="text-xs text-blue-600 font-medium mb-1">
                                {t('credentials.popup.tenant')}
                            </p>
                            <p className="text-sm font-mono text-blue-900">{tenantName}</p>
                        </div>
                    )}

                    {/* Email Field */}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                            {t('credentials.popup.email')}
                        </label>
                        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-200 group hover:border-teal-300 transition-colors">
                            <i className="ri-mail-line text-gray-400 text-lg" />
                            <code className="flex-1 text-sm font-mono text-gray-800 break-all">
                                {email}
                            </code>
                            <button
                                onClick={() => handleCopy(email, 'email')}
                                className="p-1.5 rounded-lg text-gray-400 hover:text-teal-600 hover:bg-teal-50 transition-all"
                                title={t('credentials.popup.copy')}
                            >
                                {copiedField === 'email' ? (
                                    <i className="ri-check-line text-emerald-500 text-base" />
                                ) : (
                                    <i className="ri-file-copy-line text-base" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Password Field */}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                            {t('credentials.popup.password')}
                        </label>
                        <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-xl border border-amber-200 group hover:border-amber-300 transition-colors">
                            <i className="ri-key-2-line text-amber-600 text-lg" />
                            <code className="flex-1 text-sm font-mono text-gray-800 break-all">
                                {password}
                            </code>
                            <button
                                onClick={() => handleCopy(password, 'password')}
                                className="p-1.5 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-100 transition-all"
                                title={t('credentials.popup.copy')}
                            >
                                {copiedField === 'password' ? (
                                    <i className="ri-check-line text-emerald-500 text-base" />
                                ) : (
                                    <i className="ri-file-copy-line text-base" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Warning */}
                    <div className="flex items-start gap-2 p-3 bg-red-50 rounded-xl border border-red-100">
                        <i className="ri-alert-line text-red-500 text-sm mt-0.5" />
                        <p className="text-xs text-red-700">
                            {t('credentials.popup.warning')}
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center gap-3 p-5 border-t border-gray-100">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                    >
                        {t('credentials.popup.close')}
                    </button>
                    <button
                        onClick={() => {
                            void navigator.clipboard.writeText(`${email}\n${password}`);
                            setCopiedField(null);
                        }}
                        className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-teal-600 rounded-xl hover:bg-teal-700 transition-colors flex items-center justify-center gap-2"
                    >
                        <i className="ri-clipboard-line text-base" />
                        {t('credentials.popup.copy_all')}
                    </button>
                </div>
            </div>
        </div>
    );
}