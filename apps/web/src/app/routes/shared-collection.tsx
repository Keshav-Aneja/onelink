import { useParams, Link } from "react-router-dom";
import { useSharedCollection } from "@features/shares/users/view-shared-collection";
import { useState } from "react";
import { cn } from "@lib/tailwind-utils";

const SharedCollectionPage = () => {
  const { collection_id } = useParams<{ collection_id: string }>();
  const { data: res, isLoading, isError } = useSharedCollection(collection_id ?? "");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full text-theme_secondary_white/40 text-sm">
        Loading...
      </div>
    );
  }

  if (isError || !res?.data) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3">
        <p className="text-white font-semibold">Collection not found</p>
        <p className="text-sm text-theme_secondary_white/60">
          You may no longer have access to this collection.
        </p>
        <Link to="/collections" className="text-sm underline text-theme_secondary_white/60 hover:text-white">
          Back to collections
        </Link>
      </div>
    );
  }

  const { collection, links, children, share_type, shared_by_email } = res.data;

  return (
    <div className="w-full flex flex-col gap-4 pb-6">
      {/* Read-only banner */}
      <div className="w-full flex items-center gap-2 px-4 py-2.5 rounded-md bg-white/5 border border-white/10 text-sm text-theme_secondary_white/70">
        <span>👁</span>
        <span>
          Shared with you by <span className="text-white font-medium">{shared_by_email}</span>
          {" · "}Read only
        </span>
      </div>

      {/* Collection header */}
      <div className="flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-md shrink-0"
          style={{ backgroundColor: collection.color ?? "#7c6cfc" }}
        />
        <div>
          <h1 className="text-lg font-semibold text-white">{collection.name}</h1>
          {collection.description && (
            <p className="text-xs text-theme_secondary_white/50">{collection.description}</p>
          )}
        </div>
      </div>

      {/* Links */}
      {links.length > 0 && (
        <div className="w-full grid grid-cols-1 md:grid-cols-3 xxl:grid-cols-4 gap-1 md:gap-3">
          {links.map((link: any) => (
            <ReadOnlyLinkCard key={link.id} link={link} />
          ))}
        </div>
      )}

      {/* Nested collections (DEEP) */}
      {share_type === "DEEP" && children.length > 0 && (
        <div className="space-y-2">
          {children.map((node: any) => (
            <NestedCollection key={node.collection.id} node={node} />
          ))}
        </div>
      )}

      {links.length === 0 && (share_type === "SHALLOW" || children.length === 0) && (
        <p className="text-sm text-theme_secondary_white/40 text-center py-8">
          No links in this collection.
        </p>
      )}
    </div>
  );
};

function ReadOnlyLinkCard({ link }: { link: any }) {
  return (
    <a
      href={link.link}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col gap-0.5 px-3 py-2 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 transition-colors overflow-hidden"
    >
      <span className="text-sm font-medium text-white truncate">{link.name || link.link}</span>
      {link.description && (
        <span className="text-xs text-theme_secondary_white/50 truncate">{link.description}</span>
      )}
      <span className="text-xs text-theme_secondary_white/30 truncate">{link.link}</span>
    </a>
  );
}

function NestedCollection({ node }: { node: any }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-white/10 rounded-md overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-white/5 transition-colors"
      >
        <span className="text-theme_secondary_white/50 text-xs">{open ? "▼" : "▶"}</span>
        <div
          className="w-3.5 h-3.5 rounded shrink-0"
          style={{ backgroundColor: node.collection.color ?? "#7c6cfc" }}
        />
        <span className="text-sm text-white flex-1">{node.collection.name}</span>
        <span className="text-xs text-theme_secondary_white/40">{node.links.length} links</span>
      </button>

      {open && (
        <div className="px-4 pb-3 pt-1 border-t border-white/10 space-y-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {node.links.map((link: any) => (
              <ReadOnlyLinkCard key={link.id} link={link} />
            ))}
          </div>
          {node.children?.map((child: any) => (
            <NestedCollection key={child.collection.id} node={child} />
          ))}
        </div>
      )}
    </div>
  );
}

export default SharedCollectionPage;
