import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import Button from "@components/buttons/button";
import { useImportOpml } from "@features/feeds/opml";

interface ParsedFeed {
  feed_url: string;
  title?: string;
}

interface OpmlImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function parseOpmlFeeds(xml: string): ParsedFeed[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, "text/xml");
  const outlines = Array.from(doc.querySelectorAll("outline[xmlUrl]"));
  return outlines.map((el) => ({
    feed_url: el.getAttribute("xmlUrl") || "",
    title: el.getAttribute("text") || el.getAttribute("title") || undefined,
  })).filter((f) => f.feed_url.length > 0);
}

const OpmlImportModal = ({ isOpen, onClose }: OpmlImportModalProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [parsed, setParsed] = useState<ParsedFeed[] | null>(null);
  const [rawXml, setRawXml] = useState("");
  const [fileName, setFileName] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const importMutation = useImportOpml({
    mutationConfig: {
      onSuccess: (data) => {
        alert(`Imported ${data.data?.added ?? 0} new feeds.`);
        handleClose();
      },
    },
  });

  const handleFile = (file: File) => {
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const xml = e.target?.result as string;
      setRawXml(xml);
      setParsed(parseOpmlFeeds(xml));
    };
    reader.readAsText(file);
  };

  const handleClose = () => {
    setParsed(null);
    setRawXml("");
    setFileName("");
    onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />
      <div className="relative z-[10000] w-full max-w-md mx-4 p-6 bg-theme_primary_black border-2 border-white/20 rounded-md flex flex-col gap-4">
        <h2 className="text-xl font-semibold border-b border-white/20 pb-3">
          Import OPML
        </h2>

        {!parsed ? (
          <div
            className={`border-2 border-dashed rounded-md p-8 flex flex-col items-center gap-3 transition-colors ${dragOver ? "border-primary bg-primary/10" : "border-white/20 hover:border-white/40"}`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              const file = e.dataTransfer.files[0];
              if (file) handleFile(file);
            }}
          >
            <p className="text-theme_secondary_white text-sm text-center">
              Drag &amp; drop your <strong>.opml</strong> file here
            </p>
            <span className="text-theme_secondary_white/40 text-xs">or</span>
            <Button
              className="text-sm px-4 py-2"
              onClick={() => inputRef.current?.click()}
            >
              Browse file
            </Button>
            <input
              ref={inputRef}
              type="file"
              accept=".opml,text/x-opml,application/xml,text/xml"
              className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
            />
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <p className="text-sm text-theme_secondary_white">
              Found <strong className="text-white">{parsed.length}</strong> feeds in{" "}
              <span className="text-primary">{fileName}</span>
            </p>
            <div className="max-h-52 overflow-y-auto flex flex-col gap-1 rounded-md border border-white/10 p-2">
              {parsed.map((f) => (
                <div key={f.feed_url} className="text-xs py-1.5 px-2 rounded hover:bg-white/5 flex flex-col gap-0.5">
                  <span className="font-medium text-white truncate">{f.title || f.feed_url}</span>
                  {f.title && (
                    <span className="text-theme_secondary_white truncate">{f.feed_url}</span>
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-3 justify-end pt-2">
              <Button className="text-sm px-4 py-2" onClick={() => setParsed(null)}>
                Back
              </Button>
              <Button
                className="text-sm px-4 py-2 bg-primary border-primary"
                disabled={importMutation.isPending}
                onClick={() => importMutation.mutate({ opml: rawXml })}
              >
                {importMutation.isPending ? "Importing..." : `Import ${parsed.length} feeds`}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
};

export default OpmlImportModal;
