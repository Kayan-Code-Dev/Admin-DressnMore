import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { revenueChartData } from '../../../mocks/dashboard';

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white rounded-lg border border-gray-100 px-3 py-2">
        <p className="text-xs text-gray-500 mb-1">{label}</p>
        <p className="text-sm font-bold text-gray-900">${payload[0].value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

export default function RevenueChart() {
  const { t } = useTranslation();
  const [period, setPeriod] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <div className="bg-white rounded-xl p-5 ring-1 ring-gray-100 flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-gray-900">{t('chart.revenue.title')}</h3>
          <p className="text-xs text-gray-400 mt-0.5">{t('chart.revenue.subtitle')}</p>
        </div>
        <div className="flex items-center gap-1 bg-gray-100 rounded-full p-1">
          {(['monthly', 'yearly'] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPeriod(p)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                period === p ? 'bg-white text-gray-900' : 'text-gray-500'
              }`}
            >
              {t(`chart.revenue.${p}`)}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={revenueChartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0d9488" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="revenue" stroke="#0d9488" strokeWidth={2.5} fill="url(#revenueGradient)" dot={false} activeDot={{ r: 5, fill: '#0d9488', strokeWidth: 0 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
