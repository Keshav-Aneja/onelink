import { createContext, useCallback, useContext, useState } from "react";
import { createPortal } from "react-dom";
import { PiCheckCircle, PiX } from "react-icons/pi";

interface Toast {
  id: number;
  message: string;
  undoFn?: () => void;
}

interface ToastContextValue {
  showToast: (message: string, undoFn?: () => void) => void;
}

const ToastContext = createContext<ToastContextValue>({ showToast: () => {} });

let _nextId = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message: string, undoFn?: () => void) => {
    const id = ++_nextId;
    setToasts((prev) => [...prev, { id, message, undoFn }]);
    setTimeout(() => dismiss(id), 4000);
  }, [dismiss]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {createPortal(
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[9997] flex flex-col gap-2 pointer-events-none">
          {toasts.map((t) => (
            <div
              key={t.id}
              className="flex items-center gap-3 bg-[#1a1a1a] border border-white/20 rounded-lg px-4 py-2.5 shadow-xl pointer-events-auto animate-in fade-in slide-in-from-bottom-2 duration-200 min-w-[220px]"
            >
              <PiCheckCircle className="text-green-400 text-base shrink-0" />
              <span className="text-xs text-white flex-1">{t.message}</span>
              {t.undoFn && (
                <button
                  onClick={() => { t.undoFn?.(); dismiss(t.id); }}
                  className="text-xs text-primary hover:text-primary/80 font-medium transition-colors cursor-pointer"
                >
                  Undo
                </button>
              )}
              <button
                onClick={() => dismiss(t.id)}
                className="text-white/30 hover:text-white transition-colors cursor-pointer"
              >
                <PiX className="text-sm" />
              </button>
            </div>
          ))}
        </div>,
        document.body,
      )}
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
