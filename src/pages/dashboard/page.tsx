import AdminLayout from '../../components/feature/AdminLayout';
import StatsCard from '../../components/base/StatsCard';
import RevenueChart from './components/RevenueChart';
import GrowthChart from './components/GrowthChart';
import RecentSubscriptions from './components/RecentSubscriptions';
import RecentActivities from './components/RecentActivities';

const statsCards = [
  { id: 'total_revenue',         value: '$124,580', change: '+12.5%', changeType: 'up'   as const, icon: 'ri-money-dollar-circle-line',  color: 'teal'    as const },
  { id: 'active_subscriptions',  value: '1,284',    change: '+8.2%',  changeType: 'up'   as const, icon: 'ri-checkbox-circle-line',      color: 'emerald' as const },
  { id: 'new_ateliers',          value: '48',       change: '+23.1%', changeType: 'up'   as const, icon: 'ri-store-2-line',              color: 'amber'   as const },
  { id: 'churn_rate',            value: '3.2%',     change: '-0.8%',  changeType: 'down' as const, icon: 'ri-arrow-down-circle-line',    color: 'rose'    as const },
];

export default function DashboardPage() {
  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4">
          {statsCards.map((stat) => (
            <StatsCard
              key={stat.id}
              statKey={stat.id}
              value={stat.value}
              change={stat.change}
              changeType={stat.changeType}
              icon={stat.icon}
              color={stat.color}
            />
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-5 gap-4">
          <div className="col-span-3"><RevenueChart /></div>
          <div className="col-span-2"><GrowthChart /></div>
        </div>

        {/* Tables Row */}
        <div className="grid grid-cols-2 gap-4">
          <RecentSubscriptions />
          <RecentActivities />
        </div>
      </div>
    </AdminLayout>
  );
}
