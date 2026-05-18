import React from "react";

export function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query.trim() || !text) return text;

  const escaped = query.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escaped})`, "gi");
  const parts = text.split(regex);

  if (parts.length === 1) return text;

  return React.createElement(
    React.Fragment,
    null,
    ...parts.map((part, i) =>
      regex.test(part)
        ? React.createElement(
            "mark",
            {
              key: i,
              className:
                "bg-yellow-400/30 text-yellow-200 rounded-sm not-italic",
            },
            part
          )
        : part
    )
  );
}
