import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AdminLayout from '../../components/feature/AdminLayout';
import CouponsTab from './components/CouponsTab';
import ReferralsTab from './components/ReferralsTab';
import FreeTrialsTab from './components/FreeTrialsTab';

type TabKey = 'coupons' | 'referrals' | 'trials';

const tabs: { key: TabKey; icon: string }[] = [
  { key: 'coupons',  icon: 'ri-coupon-line'       },
  { key: 'referrals',icon: 'ri-share-line'         },
  { key: 'trials',   icon: 'ri-gift-line'          },
];

export default function MarketingPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabKey>('coupons');

  return (
    <AdminLayout>
      <div className="flex flex-col gap-5">
        {/* Tab Nav */}
        <div className="bg-white rounded-2xl ring-1 ring-gray-100 overflow-hidden">
          <div className="flex border-b border-gray-100">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button key={tab.key} type="button" onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2.5 px-7 py-4 text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                    isActive ? 'border-teal-600 text-teal-700 bg-teal-50/50' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}>
                  <div className="w-4 h-4 flex items-center justify-center">
                    <i className={`${tab.icon} text-base`} />
                  </div>
                  {t(`marketing.tabs.${tab.key}`)}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'coupons'   && <CouponsTab />}
        {activeTab === 'referrals' && <ReferralsTab />}
        {activeTab === 'trials'    && <FreeTrialsTab />}
      </div>
    </AdminLayout>
  );
}
