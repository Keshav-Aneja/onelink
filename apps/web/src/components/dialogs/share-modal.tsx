import { cn } from "@lib/tailwind-utils";
import { useState } from "react";
import { createPortal } from "react-dom";
import Button from "@components/buttons/button";
import { usePublicShareForCollection } from "@features/shares/public/get";
import { useCreatePublicShare } from "@features/shares/public/create";
import { useUpdatePublicShare } from "@features/shares/public/update";
import { useDeletePublicShare } from "@features/shares/public/delete";
import { useCollectionInvitees } from "@features/shares/users/list";
import { useInviteUser } from "@features/shares/users/invite";
import { useRemoveInvite } from "@features/shares/users/remove";
import { IoCopyOutline, IoCheckmark } from "react-icons/io5";

type Tab = "public" | "users";
type ShareType = "SHALLOW" | "DEEP";

type Props = {
  collectionId: string;
  collectionName: string;
  onClose: () => void;
};

export function ShareModal({ collectionId, collectionName, onClose }: Props) {
  const [tab, setTab] = useState<Tab>("public");
  const [shareType, setShareType] = useState<ShareType>("SHALLOW");
  const [emailInput, setEmailInput] = useState("");
  const [copied, setCopied] = useState(false);

  const { data: publicShareRes } = usePublicShareForCollection(collectionId);
  const { data: inviteesRes } = useCollectionInvitees(collectionId);

  const publicShare = publicShareRes?.data ?? null;
  const invitees = inviteesRes?.data ?? [];

  const createPublicShare = useCreatePublicShare(collectionId);
  const updatePublicShare = useUpdatePublicShare(collectionId);
  const deletePublicShare = useDeletePublicShare(collectionId);
  const inviteUser = useInviteUser(collectionId);
  const removeInvite = useRemoveInvite(collectionId);

  const publicUrl = publicShare
    ? `${window.location.origin}/s/${publicShare.token}`
    : null;

  const handleCopy = () => {
    if (!publicUrl) return;
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") onClose();
  };

  return createPortal(
    <div
      className="fixed inset-0 z-9999 flex items-center justify-center"
      onKeyDown={handleKeyDown}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10000 w-full max-w-md mx-4 bg-theme_primary_black border-2 border-white/20 rounded-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h2 className="text-base font-semibold text-white truncate">Share "{collectionName}"</h2>
          <button
            onClick={onClose}
            className="text-theme_secondary_white/60 hover:text-white transition-colors ml-2 shrink-0"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10">
          <button
            onClick={() => setTab("public")}
            className={cn(
              "flex-1 py-3 text-sm font-medium transition-colors",
              tab === "public"
                ? "text-white border-b-2 border-white"
                : "text-theme_secondary_white/60 hover:text-white",
            )}
          >
            Public link
          </button>
          <button
            onClick={() => setTab("users")}
            className={cn(
              "flex-1 py-3 text-sm font-medium transition-colors",
              tab === "users"
                ? "text-white border-b-2 border-white"
                : "text-theme_secondary_white/60 hover:text-white",
            )}
          >
            Invite people
          </button>
        </div>

        {/* Tab content */}
        <div className="p-6">
          {tab === "public" && (
            <PublicLinkTab
              publicShare={publicShare}
              publicUrl={publicUrl}
              shareType={shareType}
              onShareTypeChange={setShareType}
              copied={copied}
              onCopy={handleCopy}
              isCreating={createPublicShare.isPending}
              isUpdating={updatePublicShare.isPending}
              isDeleting={deletePublicShare.isPending}
              onCreate={() =>
                createPublicShare.mutate({ collection_id: collectionId, share_type: shareType })
              }
              onUpdate={(data) =>
                updatePublicShare.mutate({ id: publicShare!.id, collection_id: collectionId, ...data })
              }
              onDelete={() =>
                deletePublicShare.mutate({ id: publicShare!.id, collection_id: collectionId })
              }
            />
          )}

          {tab === "users" && (
            <InviteUsersTab
              invitees={invitees}
              shareType={shareType}
              onShareTypeChange={setShareType}
              emailInput={emailInput}
              onEmailChange={setEmailInput}
              isInviting={inviteUser.isPending}
              inviteError={inviteUser.error?.message}
              onInvite={() => {
                if (!emailInput.trim()) return;
                inviteUser.mutate(
                  { collection_id: collectionId, email: emailInput.trim(), share_type: shareType },
                  { onSuccess: () => setEmailInput("") },
                );
              }}
              onRemove={(share_id) =>
                removeInvite.mutate({ share_id, collection_id: collectionId })
              }
            />
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}

// ── PublicLinkTab ─────────────────────────────────────────────────────────────

type PublicLinkTabProps = {
  publicShare: any;
  publicUrl: string | null;
  shareType: ShareType;
  onShareTypeChange: (t: ShareType) => void;
  copied: boolean;
  onCopy: () => void;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  onCreate: () => void;
  onUpdate: (data: { share_type?: ShareType; is_active?: boolean }) => void;
  onDelete: () => void;
};

function PublicLinkTab({
  publicShare,
  publicUrl,
  shareType,
  onShareTypeChange,
  copied,
  onCopy,
  isCreating,
  isUpdating,
  isDeleting,
  onCreate,
  onUpdate,
  onDelete,
}: PublicLinkTabProps) {
  if (!publicShare) {
    return (
      <div className="space-y-5">
        <p className="text-sm text-theme_secondary_white/70">
          Anyone with the link can view this collection without signing in.
        </p>

        <DepthSelector value={shareType} onChange={onShareTypeChange} />

        <Button
          onClick={onCreate}
          loading={isCreating}
          className="w-full rounded-md py-2 px-4 text-sm"
        >
          Generate share link
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Status */}
      <div className="flex items-center gap-2 text-sm">
        <span
          className={cn(
            "inline-block w-2 h-2 rounded-full",
            publicShare.is_active ? "bg-green-400" : "bg-red-400",
          )}
        />
        <span className="text-theme_secondary_white/80">
          {publicShare.is_active ? "Link is active" : "Link is disabled"}
          {" · "}
          {publicShare.share_type === "SHALLOW" ? "Shallow" : "Deep"}
        </span>
      </div>

      {/* URL */}
      {publicShare.is_active && publicUrl && (
        <div className="space-y-2">
          <div className="bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm text-theme_secondary_white/80 truncate">
            {publicUrl}
          </div>
          <button
            onClick={onCopy}
            className="flex items-center gap-2 text-sm text-theme_secondary_white/70 hover:text-white transition-colors"
          >
            {copied ? <IoCheckmark className="text-green-400" /> : <IoCopyOutline />}
            {copied ? "Copied!" : "Copy link"}
          </button>
        </div>
      )}

      <hr className="border-white/10" />

      {/* Depth */}
      <div className="space-y-2">
        <p className="text-xs text-theme_secondary_white/60 uppercase tracking-wide">Depth</p>
        <DepthSelector value={publicShare.share_type} onChange={(t) => onUpdate({ share_type: t })} />
      </div>

      <hr className="border-white/10" />

      {/* Toggle active + Delete — side by side */}
      <div className="flex gap-2">
        <Button
          onClick={() => onUpdate({ is_active: !publicShare.is_active })}
          loading={isUpdating}
          className="flex-1 rounded-md py-2 px-4 text-sm"
        >
          {publicShare.is_active ? "Disable link" : "Enable link"}
        </Button>

        <button
          onClick={onDelete}
          disabled={isDeleting}
          className="flex-1 py-2 px-4 rounded-md border border-red-500/40 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors disabled:opacity-50"
        >
          {isDeleting ? "Deleting..." : "Delete link"}
        </button>
      </div>
    </div>
  );
}

// ── InviteUsersTab ────────────────────────────────────────────────────────────

type InviteUsersTabProps = {
  invitees: any[];
  shareType: ShareType;
  onShareTypeChange: (t: ShareType) => void;
  emailInput: string;
  onEmailChange: (v: string) => void;
  isInviting: boolean;
  inviteError?: string;
  onInvite: () => void;
  onRemove: (share_id: string) => void;
};

function InviteUsersTab({
  invitees,
  shareType,
  onShareTypeChange,
  emailInput,
  onEmailChange,
  isInviting,
  inviteError,
  onInvite,
  onRemove,
}: InviteUsersTabProps) {
  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <p className="text-xs text-theme_secondary_white/60 uppercase tracking-wide">Depth</p>
        <DepthSelector value={shareType} onChange={onShareTypeChange} />
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-white">Invite by email</p>
        <div className="flex gap-2">
          <input
            type="email"
            value={emailInput}
            onChange={(e) => onEmailChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onInvite()}
            placeholder="colleague@example.com"
            className="flex-1 bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/30"
          />
          <Button
            onClick={onInvite}
            loading={isInviting}
            disabled={!emailInput.trim()}
            className="rounded-md py-2 px-4 text-sm"
          >
            Invite
          </Button>
        </div>
        {inviteError && (
          <p className="text-xs text-red-400">{inviteError}</p>
        )}
      </div>

      {invitees.length === 0 ? (
        <p className="text-sm text-theme_secondary_white/50 text-center py-4">
          No one has been invited yet.
        </p>
      ) : (
        <div className="space-y-2">
          <p className="text-sm font-medium text-white">People with access</p>
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {invitees.map((invitee) => (
              <div
                key={invitee.share_id}
                className="flex items-center justify-between px-3 py-2 bg-white/5 rounded-md"
              >
                <div className="flex items-center gap-2 min-w-0">
                  {invitee.profile_url ? (
                    <img
                      src={invitee.profile_url}
                      alt={invitee.name ?? invitee.email}
                      className="w-6 h-6 rounded-full shrink-0"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-white/20 shrink-0 flex items-center justify-center text-xs text-white">
                      {invitee.email[0].toUpperCase()}
                    </div>
                  )}
                  <span className="text-sm text-theme_secondary_white/80 truncate">{invitee.email}</span>
                </div>
                <button
                  onClick={() => onRemove(invitee.share_id)}
                  className="text-theme_secondary_white/40 hover:text-red-400 transition-colors ml-2 shrink-0 text-lg leading-none"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── DepthSelector ─────────────────────────────────────────────────────────────

function DepthSelector({
  value,
  onChange,
}: {
  value: ShareType;
  onChange: (t: ShareType) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {(["SHALLOW", "DEEP"] as ShareType[]).map((t) => (
        <button
          key={t}
          onClick={() => onChange(t)}
          className={cn(
            "flex flex-col items-start px-3 py-2 rounded-md border text-left transition-colors text-sm",
            value === t
              ? "border-white/40 bg-white/10 text-white"
              : "border-white/10 bg-transparent text-theme_secondary_white/60 hover:border-white/20",
          )}
        >
          <span className="font-medium">{t === "SHALLOW" ? "Shallow" : "Deep"}</span>
          <span className="text-xs mt-0.5 opacity-70">
            {t === "SHALLOW" ? "Top-level links only" : "Links + nested collections"}
          </span>
        </button>
      ))}
    </div>
  );
}
