import { redirect } from "next/navigation";
import { isAdminAuthenticated, isAdminConfigured } from "@/lib/auth/admin";
import { AdminLoginForm } from "@/components/features/admin/admin-login-form";

export default async function AdminLoginPage() {
  if (!isAdminConfigured()) {
    return (
      <main className="mx-auto flex min-h-dvh max-w-md items-center px-6 py-12">
        <div className="w-full rounded-2xl border border-white/70 bg-white/80 p-8 shadow-sm">
          <h1 className="font-serif text-2xl font-medium text-text">
            Admin not configured
          </h1>
          <p className="mt-3 text-sm text-text/70">
            Set <code className="rounded bg-black/5 px-1.5 py-0.5">ADMIN_PASSWORD</code>{" "}
            in your environment variables to enable the dashboard.
          </p>
        </div>
      </main>
    );
  }

  if (await isAdminAuthenticated()) {
    redirect("/admin/dashboard");
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-md items-center px-6 py-12">
      <div className="w-full rounded-2xl border border-white/70 bg-white/80 p-8 shadow-sm">
        <div className="mb-8 text-center">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
            Wedding RSVP
          </p>
          <h1 className="mt-2 font-serif text-3xl font-medium text-text">
            Admin Login
          </h1>
          <p className="mt-2 text-sm text-text/60">
            Enter your password to view responses.
          </p>
        </div>
        <AdminLoginForm />
      </div>
    </main>
  );
}
