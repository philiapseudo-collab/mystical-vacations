import { type LucideIcon } from 'lucide-react';

interface DetailBadgeProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
}

export default function DetailBadge({ icon: Icon, label, value }: DetailBadgeProps) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-lg">
      <Icon className="w-5 h-5 text-gold flex-shrink-0" />
      <div className="flex flex-col">
        <span className="text-xs text-slate-500">{label}</span>
        <span className="text-sm font-semibold text-navy">{value}</span>
      </div>
    </div>
  );
}

