import { AppShell } from "@/components/ws";
import { useStore } from "@/lib/store";

export function Settings() {
  const ws = useStore((s) => s.workspace);
  const me = useStore((s) => s.members[0])!;

  return (
    <AppShell crumbs={["Acme Inc.", "Settings"]}>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage your workspace preferences and profile.</p>
      </div>

      <div className="max-w-2xl space-y-6">
        <div className="rounded-xl border border-border bg-card p-6 shadow-card">
          <h2 className="text-base font-semibold text-foreground">Workspace Profile</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">Details about your active organization workspace.</p>
          <div className="mt-4 grid gap-4">
            <div>
              <label className="text-xs font-medium text-foreground">Workspace Name</label>
              <input
                type="text"
                defaultValue={ws.name}
                className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary/60"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-foreground">Workspace Slug</label>
              <input
                type="text"
                defaultValue={ws.slug}
                className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary/60 font-mono"
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-card">
          <h2 className="text-base font-semibold text-foreground">Personal Information</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">Your account credentials and role.</p>
          <div className="mt-4 grid gap-4">
            <div>
              <label className="text-xs font-medium text-foreground">Full Name</label>
              <input
                type="text"
                defaultValue={me.name}
                className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary/60"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-foreground">Email Address</label>
              <input
                type="email"
                defaultValue={me.email}
                className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary/60"
              />
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

export default Settings;
