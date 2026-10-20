import { useState, useEffect } from "react";
import { Upload, UserPlus, CheckCircle2, Trash2, Loader2 } from "lucide-react";
import { AppShell, Avatar, NewButton, inputCls } from "@/components/ws";
import {
  useGetOrganization,
  useGetOrganizationUsers,
  useUpdateOrganization,
  useInviteMember,
  useRemoveMember,
} from "@/hooks/useOrganization";
import { ConfirmDeleteModal } from "@/components/ConfirmDeleteModal";
import { useAuthStore } from "@/store/useAuthStore";
import { cn } from "@/lib/utils";

type Role = "Owner" | "Admin" | "Member";

const roleCls: Record<Role, string> = {
  Owner: "text-primary border-primary/30 bg-primary/10",
  Admin: "text-blue-500 border-blue-500/30 bg-blue-500/10",
  Member: "text-muted-foreground bg-secondary/80 border-border/50",
};

export function Settings() {
  const currentUser = useAuthStore((s) => s.user);
  const workspaceLogo = useAuthStore((s) => s.workspaceLogo);
  const setWorkspaceLogo = useAuthStore((s) => s.setWorkspaceLogo);

  const { data: organization, isLoading: isOrgLoading } = useGetOrganization();
  const { data: membersData, isLoading: isMembersLoading } = useGetOrganizationUsers();
  const { mutate: updateOrg, isPending: isSaving } = useUpdateOrganization();
  const { mutate: inviteMember, isPending: isInviting } = useInviteMember();
  const { mutate: removeMember, isPending: isRemoving } = useRemoveMember();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [logo, setLogo] = useState<string | null>(workspaceLogo);
  const [email, setEmail] = useState("");
  const [inviteName, setInviteName] = useState("");
  const [role, setRole] = useState<Role>("Member");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [memberToRemove, setMemberToRemove] = useState<any | null>(null);

  // Sync state when organization data loads from backend
  useEffect(() => {
    if (organization) {
      setName(organization.name || "");
      setSlug(organization.slug || "");
    }
  }, [organization]);

  useEffect(() => {
    if (workspaceLogo) {
      setLogo(workspaceLogo);
    }
  }, [workspaceLogo]);

  // Toast auto-dismiss helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleSaveChanges = () => {
    if (!name.trim()) return;
    // Save logo to persistent store
    setWorkspaceLogo(logo);

    updateOrg(
      { name: name.trim(), slug: slug.trim() || undefined },
      {
        onSuccess: () => {
          showToast("Workspace updated successfully");
        },
        onError: (err: any) => {
          const msg = err?.response?.data?.message || "Failed to update workspace";
          showToast(msg);
        },
      }
    );
  };

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@") || isInviting) return;

    inviteMember(
      {
        email: email.trim(),
        name: inviteName.trim() || undefined,
      },
      {
        onSuccess: (res: any) => {
          showToast(res?.message || `Member ${email} added successfully`);
          setEmail("");
          setInviteName("");
        },
        onError: (err: any) => {
          const msg =
            err?.response?.data?.message ||
            (err?.response?.data?.errors && err.response.data.errors[0]?.message) ||
            "Failed to add member to workspace";
          showToast(msg);
        },
      }
    );
  };

  const membersList: any[] = membersData || [];
  const orgName = organization?.name || currentUser?.name ? `${organization?.name || currentUser?.name}'s Org` : "Workspace";

  return (
    <AppShell crumbs={[orgName, "Settings"]}>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground shadow-2xl animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      <div className="mx-auto max-w-3xl space-y-8 animate-in fade-in duration-200">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Workspace settings</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage your organization and team.</p>
        </div>

        {/* Section 1: Organization */}
        <section className="rounded-xl border border-border bg-card shadow-card">
          <div className="border-b border-border p-5">
            <h2 className="font-medium text-foreground">Organization</h2>
            <p className="text-sm text-muted-foreground">Your workspace's public identity.</p>
          </div>

          <div className="space-y-5 p-5">
            {/* Logo Uploader */}
            <div className="flex items-center gap-4">
              <div className="grid size-14 place-items-center overflow-hidden rounded-xl bg-gradient-primary text-xl font-semibold text-primary-foreground shadow-glow">
                {logo ? (
                  <img src={logo} alt="Logo" className="size-full object-cover" />
                ) : (
                  (name ? name[0] : "W").toUpperCase()
                )}
              </div>
              <div className="flex items-center gap-2">
                <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-border bg-secondary/30 px-3 py-1.5 text-sm font-medium text-foreground transition hover:bg-accent cursor-pointer">
                  <Upload className="size-3.5" />
                  Upload logo
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setLogo(reader.result as string);
                        };
                        reader.readAsDataURL(f);
                      }
                    }}
                  />
                </label>
                {logo && (
                  <button
                    type="button"
                    onClick={() => setLogo(null)}
                    className="rounded-md border border-border px-2.5 py-1.5 text-xs text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition cursor-pointer"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>

            {/* Inputs Grid */}
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-1.5 text-sm">
                <span className="text-xs font-medium text-muted-foreground">Workspace name</span>
                <input
                  type="text"
                  value={name}
                  disabled={isOrgLoading || isSaving}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Acme Studio"
                  className={inputCls}
                />
              </label>

              <label className="space-y-1.5 text-sm">
                <span className="text-xs font-medium text-muted-foreground">Slug</span>
                <div className="flex">
                  <span className="rounded-l-md border border-r-0 border-input bg-secondary/80 px-2.5 py-2 text-sm text-muted-foreground select-none">
                    worksphere.io/
                  </span>
                  <input
                    type="text"
                    value={slug}
                    disabled={isOrgLoading || isSaving}
                    onChange={(e) =>
                      setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))
                    }
                    placeholder="my-workspace"
                    className={cn(inputCls, "rounded-l-none")}
                  />
                </div>
              </label>
            </div>
          </div>

          {/* Footer Save Button */}
          <div className="flex justify-end border-t border-border p-4">
            <NewButton
              label={isSaving ? "Saving..." : "Save changes"}
              onClick={handleSaveChanges}
            />
          </div>
        </section>

        {/* Section 2: Members */}
        <section className="rounded-xl border border-border bg-card shadow-card">
          <div className="border-b border-border p-5">
            <h2 className="font-medium text-foreground">Members</h2>
            <p className="text-sm text-muted-foreground">
              {membersList.length} {membersList.length === 1 ? "person has" : "people have"} access to this workspace.
            </p>
          </div>

          {/* Invite Form */}
          <form onSubmit={handleInvite} className="flex flex-col gap-2.5 border-b border-border p-5 sm:flex-row sm:items-center">
            <input
              type="text"
              disabled={isInviting}
              value={inviteName}
              onChange={(e) => setInviteName(e.target.value)}
              placeholder="Teammate name (optional)"
              className={cn(inputCls, "sm:w-48")}
            />
            <input
              type="email"
              required
              disabled={isInviting}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="teammate@company.com"
              className={cn(inputCls, "flex-1")}
            />
            <select
              value={role}
              disabled={isInviting}
              onChange={(e) => setRole(e.target.value as Role)}
              className={cn(inputCls, "sm:w-28 cursor-pointer")}
            >
              <option value="Member">Member</option>
              <option value="Admin">Admin</option>
            </select>
            <button
              type="submit"
              disabled={isInviting || !email.trim()}
              className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-md bg-gradient-primary px-3.5 py-2 text-sm font-medium text-primary-foreground shadow-glow transition hover:brightness-110 active:scale-[0.98] cursor-pointer disabled:opacity-50"
            >
              {isInviting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <UserPlus className="size-4" />
              )}
              <span>{isInviting ? "Adding..." : "Invite Member"}</span>
            </button>
          </form>

          {/* Members List */}
          {isMembersLoading ? (
            <div className="p-6 space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="h-10 rounded-lg bg-secondary/50 animate-pulse" />
              ))}
            </div>
          ) : membersList.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              No members found in this workspace.
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {membersList.map((m, index) => {
                // First registered user or role Owner
                const isOwner = index === 0;
                const isCurrent = m.id === currentUser?.id;
                const memberRole: Role = isOwner ? "Owner" : "Member";

                return (
                  <li
                    key={m.id}
                    className="flex items-center gap-3 px-5 py-3 transition hover:bg-accent/30"
                  >
                    <Avatar m={m} size={32} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-medium text-foreground">{m.name}</p>
                        {isCurrent && (
                          <span className="rounded-md bg-secondary px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
                            You
                          </span>
                        )}
                      </div>
                      <p className="truncate text-xs text-muted-foreground">{m.email}</p>
                    </div>

                    {isOwner ? (
                      <span className={cn("rounded-full border px-2 py-0.5 text-xs font-medium", roleCls.Owner)}>
                        Owner
                      </span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className={cn("rounded-full border px-2 py-0.5 text-xs font-medium", roleCls[memberRole])}>
                          {memberRole}
                        </span>

                        {/* Remove Member Button */}
                        {!isCurrent && (
                          <button
                            type="button"
                            onClick={() => setMemberToRemove(m)}
                            className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition cursor-pointer"
                            title="Remove member from workspace"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        )}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>

      {/* Remove Member Confirmation Alert Modal */}
      <ConfirmDeleteModal
        isOpen={!!memberToRemove}
        onClose={() => setMemberToRemove(null)}
        onConfirm={() => {
          if (memberToRemove) {
            removeMember(memberToRemove.id, {
              onSuccess: () => {
                showToast(`Member ${memberToRemove.name} removed from workspace`);
                setMemberToRemove(null);
              },
              onError: (err: any) => {
                const msg =
                  err?.response?.data?.message || "Failed to remove member";
                showToast(msg);
              },
            });
          }
        }}
        title="Remove Member"
        description="Are you sure you want to remove this member from the workspace? Any tasks assigned to them will become unassigned."
        itemTitle={memberToRemove?.name ? `${memberToRemove.name} (${memberToRemove.email})` : memberToRemove?.email}
        isLoading={isRemoving}
      />
    </AppShell>
  );
}

export default Settings;
