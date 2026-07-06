import { redirect } from "next/navigation";
import { isAdminAuthenticated, isAdminConfigured } from "@/lib/auth/admin";
import { getAdminDashboardData } from "@/services/admin.service";
import { isSupabaseConfigured } from "@/services/rsvp.service";
import { AdminHeader } from "@/components/features/admin/admin-header";
import { AdminAttendanceChart } from "@/components/features/admin/admin-attendance-chart";
import { AdminGuestManager } from "@/components/features/admin/admin-guest-manager";
import { AdminRsvpTable } from "@/components/features/admin/admin-rsvp-table";
import { AdminStatsCards } from "@/components/features/admin/admin-stats-cards";
import { AdminExportButtons } from "@/components/features/admin/admin-export-buttons";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  if (!isAdminConfigured()) {
    redirect("/admin");
  }

  if (!(await isAdminAuthenticated())) {
    redirect("/admin");
  }

  if (!isSupabaseConfigured()) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-12">
        <AdminHeader />
        <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 px-6 py-4 text-sm text-amber-800">
          Supabase is not configured. Add your database environment variables to
          load RSVP data.
        </div>
      </div>
    );
  }

  let dashboard;
  try {
    dashboard = await getAdminDashboardData(process.env.NEXT_PUBLIC_SITE_URL);
  } catch {
    return (
      <div className="mx-auto max-w-5xl px-6 py-12">
        <AdminHeader />
        <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 px-6 py-4 text-sm text-red-700">
          Unable to load RSVP data. Check your Supabase connection and try again.
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-8 md:px-8 md:py-10">
      <AdminHeader />

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-serif text-2xl font-medium text-text">Overview</h2>
          <p className="mt-1 text-sm text-text/60">
            Track responses and manage guest invite links.
          </p>
        </div>
        <AdminExportButtons />
      </div>

      <div className="mt-6">
        <AdminStatsCards stats={dashboard.stats} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <AdminAttendanceChart stats={dashboard.stats} />
        <div className="rounded-2xl border border-white/70 bg-white/80 p-6 shadow-sm">
          <h3 className="font-serif text-xl font-medium text-text">
            Quick summary
          </h3>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between gap-4 border-b border-black/5 pb-3">
              <dt className="text-text/60">Response rate</dt>
              <dd className="font-medium text-text">{dashboard.stats.responseRate}%</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-black/5 pb-3">
              <dt className="text-text/60">Total headcount (attending)</dt>
              <dd className="font-medium text-text">
                {dashboard.stats.totalGuestCount}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-text/60">Awaiting response</dt>
              <dd className="font-medium text-text">{dashboard.stats.pending}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="mt-10">
        <AdminGuestManager guests={dashboard.guests} />
      </div>

      <div className="mt-10">
        <AdminRsvpTable rsvps={dashboard.rsvps} />
      </div>
    </div>
  );
}
