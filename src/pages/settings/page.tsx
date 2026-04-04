import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AdminLayout from '../../components/feature/AdminLayout';
import GeneralSection from './components/GeneralSection';
import EmailSection from './components/EmailSection';
import PaymentSection from './components/PaymentSection';
import SmsSection from './components/SmsSection';

type TabKey = 'general' | 'email' | 'payment' | 'sms';

const tabs: { key: TabKey; icon: string; color: string; activeColor: string }[] = [
  { key: 'general', icon: 'ri-settings-3-line',  color: 'text-gray-400',    activeColor: 'text-teal-600 border-teal-600' },
  { key: 'email',   icon: 'ri-mail-settings-line',color: 'text-gray-400',   activeColor: 'text-teal-600 border-teal-600' },
  { key: 'payment', icon: 'ri-bank-card-line',    color: 'text-gray-400',    activeColor: 'text-teal-600 border-teal-600' },
  { key: 'sms',     icon: 'ri-message-2-line',    color: 'text-gray-400',    activeColor: 'text-teal-600 border-teal-600' },
];

export default function SettingsPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabKey>('general');

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl ring-1 ring-gray-100 overflow-hidden">
          <div className="flex border-b border-gray-100">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2.5 px-6 py-4 text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'border-teal-600 text-teal-700 bg-teal-50/50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="w-4 h-4 flex items-center justify-center">
                    <i className={`${tab.icon} text-base`} />
                  </div>
                  {t(`settings.tabs.${tab.key}`)}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section Content */}
        <div>
          {activeTab === 'general' && <GeneralSection />}
          {activeTab === 'email'   && <EmailSection />}
          {activeTab === 'payment' && <PaymentSection />}
          {activeTab === 'sms'     && <SmsSection />}
        </div>
      </div>
    </AdminLayout>
  );
}
