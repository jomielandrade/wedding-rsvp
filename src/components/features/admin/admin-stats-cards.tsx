import { CheckCircle2, Clock3, Users, UserX } from "lucide-react";
import type { RsvpStats } from "@/types/admin";

interface AdminStatsCardsProps {
  stats: RsvpStats;
}

const cards: Array<{
  key: "attending" | "declining" | "pending" | "invitedHeadcount";
  label: string;
  hint?: string;
  icon: typeof CheckCircle2;
  color: string;
  bg: string;
}> = [
  {
    key: "attending",
    label: "Attending",
    icon: CheckCircle2,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    key: "declining",
    label: "Declining",
    icon: UserX,
    color: "text-rose-600",
    bg: "bg-rose-50",
  },
  {
    key: "pending",
    label: "Pending",
    icon: Clock3,
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    key: "invitedHeadcount",
    label: "Total guests",
    hint: "Invited incl. plus ones",
    icon: Users,
    color: "text-primary",
    bg: "bg-primary/10",
  },
];

export function AdminStatsCards({ stats }: AdminStatsCardsProps) {
  const values = {
    attending: stats.attending,
    declining: stats.declining,
    pending: stats.pending,
    invitedHeadcount: stats.invitedHeadcount,
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.key}
            className="rounded-2xl border border-white/70 bg-white/80 p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-text/60">{card.label}</p>
                {card.hint ? (
                  <p className="mt-0.5 text-xs text-text/45">{card.hint}</p>
                ) : null}
                <p className="mt-2 font-serif text-3xl font-medium text-text">
                  {values[card.key]}
                </p>
              </div>
              <div className={`rounded-xl p-2.5 ${card.bg}`}>
                <Icon className={`h-5 w-5 ${card.color}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
