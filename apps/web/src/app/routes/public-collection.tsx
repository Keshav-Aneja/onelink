import { useParams, Link } from "react-router-dom";
import { usePublicCollection, type PublicCollectionView } from "@features/shares/public/get-public-collection";
import { cn } from "@lib/tailwind-utils";
import { useState } from "react";

function countAllLinks(links: any[], children: any[]): number {
  return links.length + children.reduce((sum: number, node: any) => {
    return sum + countAllLinks(node.links, node.children ?? []);
  }, 0);
}

const PublicCollectionPage = () => {
  const { token } = useParams<{ token: string }>();
  const { data: res, isLoading, isError } = usePublicCollection(token ?? "");

  if (isLoading) return <PublicSkeleton />;
  if (isError || !res?.data) return <PublicNotFound />;

  const { collection, links, children, share_type, shared_by_email } = res.data;

  return (
    <div className="min-h-screen bg-theme_primary_black text-white flex flex-col">
      {/* Minimal nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <Link to="/" className="font-bold text-lg tracking-tight">Onelink</Link>
        <Link
          to="/auth"
          className="text-sm text-theme_secondary_white/70 hover:text-white transition-colors"
        >
          Sign up free →
        </Link>
      </nav>

      {/* Content */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-6 py-10">
        {/* Collection header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold">{collection.name}</h1>
          {collection.description && (
            <p className="mt-1 text-theme_secondary_white/60 text-sm">{collection.description}</p>
          )}
          <p className="mt-2 text-xs text-theme_secondary_white/40">
            {(() => { const total = countAllLinks(links, share_type === "DEEP" ? children : []); return `${total} ${total === 1 ? "link" : "links"}`; })()}
            {" · "}Shared by {shared_by_email} · Read only
          </p>
        </div>

        <hr className="border-white/10 mb-6" />

        {/* Links */}
        <div className="space-y-3">
          {links.map((link: any) => (
            <PublicLinkItem key={link.id} link={link} />
          ))}
        </div>

        {/* Nested collections (DEEP) */}
        {share_type === "DEEP" && children.length > 0 && (
          <div className="mt-8 space-y-3">
            {children.map((node: any) => (
              <CollectionNode key={node.collection.id} node={node} />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 py-4 text-center text-xs text-theme_secondary_white/40">
        Powered by Onelink ·{" "}
        <Link to="/auth" className="underline hover:text-white transition-colors">
          Save your own links →
        </Link>
      </footer>
    </div>
  );
};

function PublicLinkItem({ link }: { link: any }) {
  return (
    <a
      href={link.link}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col gap-0.5 px-4 py-3 rounded-md bg-white/5 hover:bg-white/10 transition-colors border border-white/5 overflow-hidden"
    >
      <span className="text-sm font-medium text-white truncate">{link.name || link.link}</span>
      {link.description && (
        <span className="text-xs text-theme_secondary_white/50 truncate">{link.description}</span>
      )}
      <span className="text-xs text-theme_secondary_white/30 truncate">{link.link}</span>
    </a>
  );
}

function CollectionNode({ node }: { node: any }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-white/10 rounded-md overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/5 transition-colors"
      >
        <span className="text-theme_secondary_white/60">{open ? "▼" : "▶"}</span>
        <span className="text-sm font-medium text-white flex-1">{node.collection.name}</span>
        <span className="text-xs text-theme_secondary_white/40">{node.links.length} links</span>
      </button>

      {open && (
        <div className="px-4 pt-3 pb-3 space-y-2 border-t border-white/10">
          {node.links.map((link: any) => (
            <PublicLinkItem key={link.id} link={link} />
          ))}
          {node.children?.map((child: any) => (
            <CollectionNode key={child.collection.id} node={child} />
          ))}
        </div>
      )}
    </div>
  );
}

function PublicSkeleton() {
  return (
    <div className="min-h-screen bg-theme_primary_black flex items-center justify-center">
      <div className="text-theme_secondary_white/40 text-sm">Loading...</div>
    </div>
  );
}

function PublicNotFound() {
  return (
    <div className="min-h-screen bg-theme_primary_black flex flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold text-white">Link not found</h1>
      <p className="text-sm text-theme_secondary_white/60">
        This share link is no longer active or doesn't exist.
      </p>
      <Link to="/" className="text-sm underline text-theme_secondary_white/70 hover:text-white">
        Go to Onelink →
      </Link>
    </div>
  );
}

export default PublicCollectionPage;
