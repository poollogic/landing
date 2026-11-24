import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { X } from 'lucide-react';

// /claude's "Add to Claude" popup: the connector link to copy, then where to paste it in Claude.
// Both "Add to Claude" buttons open it (ref.open(opener)). A native <dialog> opened with showModal(),
// so the page underneath is inert; on top of that, Tab cycles inside it, focus goes back to the
// button that opened it, and the page can't scroll (with the scrollbar's width kept as padding, so
// nothing shifts). Closes on the ×, a click on the backdrop, or Escape. In the pre-rendered HTML
// it's closed (nothing shows), and renders the same on the server as in the browser.
// Styles: claude.css ("The Add to Claude popup").

export const MCP_URL = 'https://app.poolnautics.app/api/mcp'; // the web app's AI connection (docs/ai-connections.md)

const URL_HOST = new URL(MCP_URL).origin;
const URL_PATH = MCP_URL.slice(URL_HOST.length);

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Copy text: the Clipboard API, or (an older browser, or not allowed) a hidden field and execCommand. */
async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const field = Object.assign(document.createElement('textarea'), { value: text, readOnly: true });
    field.style.cssText = 'position:fixed;top:0;left:0;opacity:0;pointer-events:none';
    document.activeElement?.closest('dialog')?.append(field) ?? document.body.append(field);
    const back = document.activeElement;
    field.select();
    try { return document.execCommand('copy'); } catch { return false; } finally { field.remove(); back?.focus?.(); }
  }
}

/** Select the link's text, for copying by hand. */
function selectText(el) {
  const range = document.createRange();
  range.selectNodeContents(el);
  const sel = getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
}

const AddToClaudeDialog = forwardRef(function AddToClaudeDialog(_, ref) {
  const dialogRef = useRef(null);
  const urlRef = useRef(null);
  const opener = useRef(null);
  const pressedOnBackdrop = useRef(false);
  const copiedTimer = useRef(0);
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useImperativeHandle(ref, () => ({
    open: (from) => { opener.current = from ?? document.activeElement; setOpen(true); },
  }), []);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return undefined;
    if (!open) return undefined;
    // The page stays put: no scrolling, and the scrollbar's width kept as padding so nothing moves.
    const root = document.documentElement;
    const before = { overflow: root.style.overflow, paddingRight: root.style.paddingRight };
    const bar = window.innerWidth - root.clientWidth;
    root.style.overflow = 'hidden';
    if (bar > 0) root.style.paddingRight = `${(parseFloat(getComputedStyle(root).paddingRight) || 0) + bar}px`;
    if (!dialog.open) dialog.showModal();
    dialog.querySelector('#claude-dialog-title')?.focus();
    return () => {
      if (dialog.open) dialog.close(); // first: while it's open, the page (and the opener) is inert
      root.style.overflow = before.overflow;
      root.style.paddingRight = before.paddingRight;
      clearTimeout(copiedTimer.current);
      setCopied(false);
      const back = opener.current;
      opener.current = null;
      if (back?.isConnected) back.focus({ preventScroll: true });
    };
  }, [open]);

  useEffect(() => () => clearTimeout(copiedTimer.current), []);

  /** Tab and Shift+Tab go round the popup's own controls. */
  const onKeyDown = (e) => {
    if (e.key !== 'Tab') return;
    const items = [...dialogRef.current.querySelectorAll(FOCUSABLE)];
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    const at = document.activeElement;
    if (e.shiftKey && (at === first || !items.includes(at))) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && (at === last || !items.includes(at))) { e.preventDefault(); first.focus(); }
  };

  const copy = async () => {
    const ok = await copyText(MCP_URL);
    if (!ok) { if (urlRef.current) selectText(urlRef.current); return; } // can't copy: selected, to copy by hand
    setCopied(true);
    clearTimeout(copiedTimer.current);
    copiedTimer.current = setTimeout(() => setCopied(false), 2000);
  };

  return (
    <dialog
      ref={dialogRef}
      className="claude-dialog"
      role="dialog"
      aria-modal="true"
      aria-labelledby="claude-dialog-title"
      onCancel={(e) => { e.preventDefault(); close(); }}
      onKeyDown={onKeyDown}
      // The backdrop closes it only for a press that began there (a text selection dragged out of the
      // link box and let go outside doesn't).
      onPointerDown={(e) => { pressedOnBackdrop.current = e.target === dialogRef.current; }}
      onClick={(e) => { if (e.target === dialogRef.current && pressedOnBackdrop.current) close(); pressedOnBackdrop.current = false; }}
    >
      <div className="claude-dialog-card">
        <button type="button" className="claude-dialog-close" aria-label="Close" onClick={close}>
          <X size={18} strokeWidth={2} aria-hidden="true" />
        </button>
        <h2 id="claude-dialog-title" className="claude-dialog-title" tabIndex={-1}>Add Poolnautics to Claude</h2>
        <p className="claude-dialog-sub">It takes about a minute.</p>
        <ol className="claude-dialog-steps">
          <li className="claude-dialog-step">
            <span className="claude-dialog-n" aria-hidden="true">1</span>
            <div>
              <h3>Copy your connector link</h3>
              <div className="claude-dialog-copy">
                {/* Read-only text, not a field, so the whole link shows (on a phone, on two lines: it
                    breaks before /api). The <wbr> isn't copied. */}
                <code ref={urlRef} className="claude-dialog-url">{URL_HOST}<wbr />{URL_PATH}</code>
                <button type="button" className="claude-dialog-copy-btn" onClick={copy}>{copied ? 'Copied' : 'Copy'}</button>
              </div>
              <span className="sr-only" role="status">{copied ? 'Connector link copied' : ''}</span>
            </div>
          </li>
          <li className="claude-dialog-step">
            <span className="claude-dialog-n" aria-hidden="true">2</span>
            <div>
              <h3>Add it in Claude</h3>
              <p>Open Customize, then Connectors, add a connector and paste the link.</p>
            </div>
          </li>
          <li className="claude-dialog-step">
            <span className="claude-dialog-n" aria-hidden="true">3</span>
            <div>
              <h3>Sign in and pick an access level</h3>
              <p>An owner or admin chooses how far Claude can go: read only, make changes, or send to customers.</p>
            </div>
          </li>
        </ol>
        <p className="claude-dialog-foot">Then ask it something real, like “what needs me today?”</p>
      </div>
    </dialog>
  );
});

export default AddToClaudeDialog;
