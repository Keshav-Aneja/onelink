import { useCallback, useRef } from "react";
import { useCreateLink } from "@features/links/create-link";
import { useAppDispatch } from "@store/store";
import { setClipboardLinkLoading } from "@store/slices/application-slice";
import { nanoid } from "@reduxjs/toolkit";
import { useClipboardUrlDetector } from "./useClipboardUrlDetector";

interface UseClipboardLinkHandlerOptions {
  parentId: string | null | undefined;
  enabled: boolean;
}

/**
 * Custom hook to handle clipboard URL detection and automatic link creation
 * @param options - Configuration options
 * @param options.parentId - The parent collection ID where links should be created
 * @param options.enabled - Whether the clipboard detection is enabled
 */
export function useClipboardLinkHandler({
  parentId,
  enabled,
}: UseClipboardLinkHandlerOptions) {
  const dispatch = useAppDispatch();
  const pendingLinksRef = useRef(0);

  const createLinkMutation = useCreateLink({
    parentId: parentId ?? null,
    mutationConfig: {
      onSuccess: () => {
        pendingLinksRef.current--;
        if (pendingLinksRef.current === 0) {
          dispatch(setClipboardLinkLoading({ isAdding: false, urlCount: 0 }));
        }
      },
      onError: (error) => {
        console.error("Failed to create link from clipboard:", error);
        pendingLinksRef.current--;
        if (pendingLinksRef.current === 0) {
          dispatch(setClipboardLinkLoading({ isAdding: false, urlCount: 0 }));
        }
      },
    },
  });

  const handleUrlsDetected = useCallback(
    (urls: string[]) => {
      if (!parentId) {
        console.warn("Cannot create link: parentId is undefined");
        return;
      }

      pendingLinksRef.current = urls.length;
      dispatch(
        setClipboardLinkLoading({ isAdding: true, urlCount: urls.length }),
      );

      urls.forEach((url) => {
        const linkData = {
          link: url,
          description: "",
          notification: false,
          parent_id: parentId,
          fingerprint: nanoid(10),
          subscribed: false,
        };
        createLinkMutation.mutate(linkData);
      });
    },
    [parentId, createLinkMutation, dispatch],
  );

  useClipboardUrlDetector({
    enabled,
    onUrlsDetected: handleUrlsDetected,
  });

  return {
    isCreating: createLinkMutation.isPending,
    pendingCount: pendingLinksRef.current,
  };
}
