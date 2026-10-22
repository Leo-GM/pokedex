import { typeLabel, typeStyle } from "@/lib/utils";

export function TypeBadge({ type }: { type: string }) {
  return (
    <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${typeStyle(type)}`}>
      {typeLabel(type)}
    </span>
  );
}
