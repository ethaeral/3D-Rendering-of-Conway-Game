import React, { useState } from "react";
import { createPortal } from "react-dom";
import type { AppVersion } from "../content/implementation-details";
import { getImplementationDetailsByVersion } from "../content/implementation-details";

const OVERLAY_PORTAL_ID = "implementation-details-portal";

export interface ImplementationDetailsPanelProps {
  version: AppVersion;
  className?: string;
}

export function ImplementationDetailsPanel({
  version,
  className = "",
}: ImplementationDetailsPanelProps) {
  const [open, setOpen] = useState(false);
  const details = getImplementationDetailsByVersion(version);

  const overlay =
    open &&
    typeof document !== "undefined" &&
    createPortal(
      <div
        className="absolute inset-0 z-10 flex flex-col bg-black/40 backdrop-blur-sm pointer-events-auto"
        role="dialog"
        aria-label="Implementation details"
        onClick={() => setOpen(false)}
      >
        <div
          className="flex-1 min-h-0 overflow-y-auto border-b border-white/10 bg-slate-950/95 px-6 py-5 shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
          onClick={(e) => e.stopPropagation()}
          style={{ fontSize: "1.125rem" }}
        >
          <h3 className="mb-5 text-xl font-semibold text-amber-400/90">
            {details.title}
          </h3>
          <ul className="space-y-5">
            {details.sections.map((s, i) => (
              <li key={i}>
                <h4 className="mb-2 text-lg font-medium text-white/80">
                  {s.heading}
                </h4>
                {s.table ? (
                  <div className="overflow-x-auto rounded border border-white/20">
                    <table className="w-full border-collapse text-left" style={{ fontSize: "0.9375rem" }}>
                      <thead>
                        <tr className="border-b border-white/20 bg-white/5">
                          {s.table.headers.map((h, j) => (
                            <th key={j} className="px-3 py-2 font-medium text-amber-400/90">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {s.table.rows.map((row, ri) => (
                          <tr key={ri} className="border-b border-white/10 last:border-0">
                            {row.map((cell, ci) => (
                              <td key={ci} className="px-3 py-2 text-white/70 align-top">
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="leading-relaxed text-white/70" style={{ fontSize: "1rem" }}>
                    {s.body}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>,
      document.getElementById(OVERLAY_PORTAL_ID) ?? document.body
    );

  return (
    <>
      <div
        className={
          "flex flex-col border-b border-white/10 bg-black/90 text-white/95 shrink-0 " +
          className
        }
        role="region"
        aria-label="Implementation details"
      >
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className={
            "flex w-full items-center justify-center gap-2 px-3 py-2 text-xs font-mono " +
            "text-white/70 hover:bg-white/5 hover:text-white/90 transition-colors"
          }
          aria-expanded={open}
        >
          <span className="uppercase tracking-wider">Implementation details</span>
          <span
            className={
              "tabular-nums transition-transform " + (open ? "rotate-180" : "")
            }
            aria-hidden
          >
            ▼
          </span>
        </button>
      </div>
      {overlay}
    </>
  );
}
