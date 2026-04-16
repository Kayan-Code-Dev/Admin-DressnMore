import { useTranslation } from 'react-i18next';
import { type ReactNode } from 'react';

type StatusVariant =
  | 'active'
  | 'suspended'
  | 'pending'
  | 'trial'
  | 'cancelled'
  | 'expired'
  | 'rejected'
  | 'approved'
  | 'paid'
  | 'refunded';

interface StatusBadgeProps {
  status: StatusVariant | string;
  size?: 'sm' | 'md';
}

const statusConfig: Record<string, { classes: string; dot: string }> = {
  active:    { classes: 'bg-emerald-50 text-emerald-700', dot: 'bg-emerald-500' },
  approved:  { classes: 'bg-emerald-50 text-emerald-800', dot: 'bg-emerald-600' },
  suspended: { classes: 'bg-rose-50 text-rose-700',      dot: 'bg-rose-500'    },
  pending:   { classes: 'bg-amber-50 text-amber-700',    dot: 'bg-amber-500'   },
  trial:     { classes: 'bg-teal-50 text-teal-700',      dot: 'bg-teal-500'    },
  cancelled: { classes: 'bg-gray-100 text-gray-600',     dot: 'bg-gray-400'    },
  rejected:  { classes: 'bg-rose-50 text-rose-800',      dot: 'bg-rose-500'    },
  expired:   { classes: 'bg-gray-100 text-gray-500',     dot: 'bg-gray-400'    },
  paid:      { classes: 'bg-emerald-50 text-emerald-700',dot: 'bg-emerald-500' },
  refunded:  { classes: 'bg-rose-50 text-rose-700',      dot: 'bg-rose-500'    },
  failed:    { classes: 'bg-red-50 text-red-700',        dot: 'bg-red-500'     },
};

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const { t } = useTranslation();
  const config = statusConfig[status] ?? { classes: 'bg-gray-100 text-gray-600', dot: 'bg-gray-400' };
  const padding = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';
  const label = t(`status.${status}`, { defaultValue: status });

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium ${padding} ${config.classes}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {label}
    </span>
  );
}

interface PlanBadgeProps {
  plan?: string | null;
}

const planColors: Record<string, string> = {
  Starter:    'bg-gray-100 text-gray-700',
  Pro:        'bg-teal-50 text-teal-700',
  Enterprise: 'bg-amber-50 text-amber-700',
  basic:        'bg-gray-100 text-gray-700',
  professional: 'bg-teal-50 text-teal-700',
  enterprise:   'bg-amber-50 text-amber-700',
};

function planTierLookupKey(plan: string): string {
  return plan.trim().toLowerCase().replace(/\s+/g, '_');
}

export function PlanBadge({ plan }: PlanBadgeProps) {
  const { t } = useTranslation();
  const key = (plan ?? '').trim();
  if (!key) {
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-500">
        —
      </span>
    );
  }
  const normalized =
    key.charAt(0).toUpperCase() + key.slice(1).toLowerCase();
  const cls =
    planColors[key] ??
    planColors[key.toLowerCase()] ??
    planColors[normalized] ??
    'bg-gray-100 text-gray-600';
  const tierKey = planTierLookupKey(key);
  const label = t(`plan_tiers.${tierKey}`, { defaultValue: key });
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${cls}`}>
      {label}
    </span>
  );
}

interface ActionIconButtonProps {
  icon: string;
  label: string;
  onClick?: () => void;
  variant?: 'default' | 'danger' | 'warning' | 'success';
  children?: ReactNode;
  disabled?: boolean;
  /** Adds `animate-spin` to the icon (e.g. with `ri-loader-4-line`) */
  spinIcon?: boolean;
}

export function ActionIconButton({
  icon,
  label,
  onClick,
  variant = 'default',
  disabled,
  spinIcon,
}: ActionIconButtonProps) {
  const variantClass = {
    default: 'text-gray-500 hover:text-teal-600 hover:bg-teal-50',
    danger:  'text-gray-500 hover:text-rose-600 hover:bg-rose-50',
    warning: 'text-gray-500 hover:text-amber-600 hover:bg-amber-50',
    success: 'text-gray-500 hover:text-emerald-600 hover:bg-emerald-50',
  }[variant];

  return (
    <button
      type="button"
      title={label}
      disabled={disabled}
      onClick={onClick}
      className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
        disabled
          ? 'opacity-40 cursor-not-allowed text-gray-400'
          : `cursor-pointer ${variantClass}`
      }`}
    >
      <i className={`${icon} text-base ${spinIcon ? 'animate-spin' : ''}`} />
    </button>
  );
}
