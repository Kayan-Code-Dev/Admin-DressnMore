import { useTranslation } from 'react-i18next';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { growthChartData } from '../../../mocks/dashboard';

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white rounded-lg border border-gray-100 px-3 py-2">
        <p className="text-xs text-gray-500 mb-1">{label}</p>
        {payload.map((entry) => (
          <p key={entry.name} className="text-sm font-semibold" style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function GrowthChart() {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-xl p-5 ring-1 ring-gray-100 flex flex-col gap-5">
      <div>
        <h3 className="text-base font-bold text-gray-900">{t('chart.growth.title')}</h3>
        <p className="text-xs text-gray-400 mt-0.5">{t('chart.growth.subtitle')}</p>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={growthChartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }} barGap={4}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} formatter={(value) => <span style={{ color: '#6b7280', fontWeight: 500 }}>{value}</span>} />
          <Bar dataKey="newAteliers" name={t('chart.growth.new_ateliers')} fill="#0d9488" radius={[4, 4, 0, 0]} maxBarSize={20} />
          <Bar dataKey="churned" name={t('chart.growth.churned')} fill="#f43f5e" radius={[4, 4, 0, 0]} maxBarSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
