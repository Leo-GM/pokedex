import { STAT_LABEL, displayName } from "@/lib/utils";

const MAX_STAT = 255;

function barColor(value: number) {
  if (value >= 100) return "bg-green-600";
  if (value >= 60) return "bg-amber-500";
  return "bg-red-500";
}

export function StatBar({ name, value }: { name: string; value: number }) {
  const label = STAT_LABEL[name] ?? displayName(name);
  const percent = Math.min(100, Math.round((value / MAX_STAT) * 100));

  return (
    <div className="grid grid-cols-[7.5rem_2.5rem_1fr] items-center gap-3 text-sm">
      <span>{label}</span>
      <span className="font-semibold tabular-nums">{value}</span>
      <div
        role="meter"
        aria-label={label}
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={MAX_STAT}
        className="h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800"
      >
        <div className={`h-full rounded-full ${barColor(value)}`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
