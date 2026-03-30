import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import React from "react";
import * as _unitOfWork from "../../api";
import { generateFullUrl } from "../../api/restApi";
import { saveAs } from "file-saver";

// ─── File type config ───────────────────────────────────────────────────────
const FILE_TYPES = {
    pdf: {
        label: "PDF Document",
        color: "#dc2626",
        bg: "rgba(220, 38, 38, 0.08)",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <path d="M9 15h1.5a1.5 1.5 0 0 0 0-3H9v6m7-6v6m-2-3h2" />
            </svg>
        ),
        render: (url) => (
            // <iframe
            //     src={`${url}#toolbar=1&navpanes=0`}
            //     title="PDF Preview"
            //     style={{ width: "100%", height: "100%", border: "none", borderRadius: 8 }}
            // />
            <embed
                src={url}
                type="application/pdf"
                style={{ width: "100%", height: "100%", borderRadius: 8 }}
            />
        ),
    },
    docx: {
        label: "Word Document",
        color: "#2563eb",
        bg: "rgba(37, 99, 235, 0.08)",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <path d="M8 13l2 6 2-4 2 4 2-6" />
            </svg>
        ),
        render: (url) => (
            <iframe
                src={`https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`}
                title="DOCX Preview"
                style={{ width: "100%", height: "100%", border: "none", borderRadius: 8 }}
            />
        ),
    },
    xlsx: {
        label: "Spreadsheet",
        color: "#16a34a",
        bg: "rgba(22, 163, 74, 0.08)",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="8" y1="13" x2="16" y2="13" />
                <line x1="8" y1="17" x2="16" y2="17" />
                <polyline points="10 9 9 9 8 9" />
            </svg>
        ),
        render: (url) => (
            <iframe
                // src={`https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`}
                src={`https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(url)}`}
                title="XLSX Preview"
                style={{ width: "100%", height: "100%", border: "none", borderRadius: 8 }}
            />
        ),
    },
    // csv: {
    //     label: "CSV File",
    //     color: "#10b981",
    //     bg: "rgba(16,185,129,0.12)",
    //     icon: (
    //         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    //             <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    //             <polyline points="14 2 14 8 20 8" />
    //             <line x1="8" y1="13" x2="16" y2="13" />
    //             <line x1="8" y1="17" x2="16" y2="17" />
    //         </svg>
    //     ),
    //     render: (url) => (
    //         <iframe
    //             src={url}
    //             title="CSV Preview"
    //             style={{ width: "100%", height: "100%", border: "none", borderRadius: 8, background: "#fff" }}
    //         />
    //     ),
    // },
    image: {
        label: "Image",
        color: "#7c3aed",
        bg: "rgba(124, 58, 237, 0.08)",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
            </svg>
        ),
        render: (url) => (
            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: 12 }}>
                <img
                    src={url}
                    alt="Preview"
                    style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", borderRadius: 8, boxShadow: "0 8px 32px rgba(0,0,0,0.18)" }}
                />
            </div>
        ),
    },
    video: {
        label: "Video",
        color: "#d97706",
        bg: "rgba(217, 119, 6, 0.08)",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <polygon points="23 7 16 12 23 17 23 7" />
                <rect x="1" y="5" width="15" height="14" rx="2" />
            </svg>
        ),
        render: (url, onLoad) => (
            <video controls autoPlay onLoadedData={onLoad} style={{ width: "100%", height: "100%", objectFit: "contain", borderRadius: 8, background: "#000" }}>
                <source src={url} />
                Trình duyệt không hỗ trợ video.
            </video>
        ),
    },
    audio: {
        label: "Audio",
        color: "#db2777",
        bg: "rgba(219, 39, 119, 0.08)",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 18V5l12-2v13" />
                <circle cx="6" cy="18" r="3" />
                <circle cx="18" cy="16" r="3" />
            </svg>
        ),
        render: (url, onLoad) => (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 24 }}>
                <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg,#ec4899,#a855f7)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 40px rgba(236,72,153,0.4)", animation: "spin 4s linear infinite" }}>
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
                        <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
                    </svg>
                </div>
                <audio controls autoPlay onLoadedData={onLoad} style={{ width: "90%", accentColor: "#ec4899" }}>
                    <source src={url} />
                </audio>
            </div>
        ),
    },
    txt: {
        label: "Text File",
        color: "#64748b",
        bg: "rgba(100,116,139,0.12)",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
            </svg>
        ),
        render: (url) => (
            <iframe
                src={url}
                title="Text Preview"
                style={{ width: "100%", height: "100%", border: "none", borderRadius: 8, background: "#1e1e2e", color: "#cdd6f4" }}
            />
        ),
    },
    pptx: {
        label: "PowerPoint",
        color: "#f97316",
        bg: "rgba(249,115,22,0.12)",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14 2 14 8 20 8" />
                <path d="M8 13h8" />
                <path d="M8 17h5" />
                <path d="M11 9H8" />
                <circle cx="8" cy="9" r="0.5" fill="currentColor" />
            </svg>
        ),
        render: (url) => (
            <iframe
                // src={`https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`}
                src={`https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(url)}`}
                title="PPTX Preview"
                style={{ width: "100%", height: "100%", border: "none", borderRadius: 8 }}
            />
        ),
    },
    unknown: {
        label: "File",
        color: "#94a3b8",
        bg: "rgba(148,163,184,0.12)",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
            </svg>
        ),
        render: (url) => (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 16, color: "#94a3b8" }}>
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                <p style={{ fontSize: 14 }}>Không thể xem trước loại file này</p>
                <a href={url} download style={{ color: "#6366f1", fontSize: 13, textDecoration: "underline" }}>Tải xuống để xem</a>
            </div>
        ),
    },
};

// ─── Helper ──────────────────────────────────────────────────────────────────
function getFileConfig(fileType) {
    const t = fileType?.toLowerCase();
    return FILE_TYPES[t] || FILE_TYPES.unknown;
}

function getFileName(url) {
    try {
        const parts = url.split("/");
        return decodeURIComponent(parts[parts.length - 1]) || "file";
    } catch {
        return "file";
    }
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

  .fpv-overlay {
    position: fixed; inset: 0; z-index: 9999;
    background: rgba(15, 23, 42, 0.4);
    backdrop-filter: blur(12px);
    display: flex; align-items: center; justify-content: center;
    padding: 20px;
    animation: fpv-fadeIn 0.2s ease;
    font-family: 'DM Sans', sans-serif;
  }

  .fpv-modal {
    width: 100%; max-width: 900px;
    height: min(85vh, 700px);
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 20px;
    display: flex; flex-direction: column;
    overflow: hidden;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
    animation: fpv-slideUp 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .fpv-header {
    display: flex; align-items: center; gap: 14px;
    padding: 16px 20px;
    border-bottom: 1px solid #f1f5f9;
    flex-shrink: 0;
    background: #ffffff;
  }

  .fpv-icon-wrap {
    width: 40px; height: 40px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    transition: transform 0.2s;
  }

  .fpv-icon-wrap svg { width: 20px; height: 20px; }

  .fpv-meta { flex: 1; overflow: hidden; }

  .fpv-filename {
    font-size: 14px; font-weight: 600;
    color: #1e293b;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    letter-spacing: -0.01em;
  }

  .fpv-filetype {
    font-size: 11px; font-weight: 500;
    color: #94a3b8;
    margin-top: 1px;
    font-family: 'DM Mono', monospace;
    text-transform: uppercase; letter-spacing: 0.05em;
  }

  .fpv-actions {
    display: flex; align-items: center; gap: 8px;
    flex-shrink: 0;
  }

  .fpv-btn {
    width: 34px; height: 34px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    color: #64748b;
    transition: all 0.2s;
  }

  .fpv-btn:hover {
    background: #f1f5f9;
    color: #1e293b;
    border-color: #cbd5e1;
  }

  .fpv-btn svg { width: 16px; height: 16px; }

  .fpv-btn-close {
    background: #fff1f2;
    border-color: #fecdd3;
    color: #e11d48;
  }

  .fpv-btn-close:hover {
    background: #ffe4e6;
    border-color: #fda4af;
    color: #be123c;
  }

  .fpv-body {
    flex: 1; overflow: hidden;
    position: relative;
    padding: 16px;
    background: #f1f5f9;
  }

  .fpv-body-inner {
    width: 100%; height: 100%;
    border-radius: 10px;
    overflow: hidden;
    background: #ffffff;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  }

  .fpv-loading {
    position: absolute; inset: 0;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    gap: 14px;
    color: #64748b;
    font-size: 13px;
    pointer-events: none;
  }

  .fpv-spinner {
    width: 32px; height: 32px;
    border: 3px solid #f1f5f9;
    border-top-color: #3b82f6;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  .fpv-footer {
    display: flex; align-items: center; justify-content: space-between;
    padding: 10px 20px;
    border-top: 1px solid #f1f5f9;
    background: #ffffff;
    flex-shrink: 0;
  }

  .fpv-url {
    font-size: 11px;
    color: #94a3b8;
    font-family: 'DM Mono', monospace;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    max-width: 60%;
    transition: color 0.2s;
    cursor: default;
  }

  .fpv-url:hover { color: #6366f1; }

  .fpv-copy-btn {
    display: flex; align-items: center; gap: 6px;
    background: transparent; border: none; cursor: pointer;
    color: #64748b; font-size: 11px;
    font-family: 'DM Sans', sans-serif;
    padding: 4px 8px; border-radius: 6px;
    transition: all 0.15s;
  }

  .fpv-copy-btn:hover { color: #2563eb; background: #eff6ff; }
  .fpv-copy-btn svg { width: 12px; height: 12px; }

  @keyframes fpv-fadeIn { from { opacity: 0 } to { opacity: 1 } }
  @keyframes fpv-slideUp { from { opacity: 0; transform: translateY(20px) scale(0.97) } to { opacity: 1; transform: translateY(0) scale(1) } }
  @keyframes spin { to { transform: rotate(360deg) } }

  .fpv-error-state {
    position: absolute; inset: 0;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    text-align: center; padding: 40px; background: #fff; z-index: 10;
  }

  .fpv-error-state h3 { font-size: 18px; color: #1e293b; margin: 16px 0 8px; }
  .fpv-error-state p { font-size: 14px; color: #64748b; max-width: 320px; line-height: 1.5; margin-bottom: 20px; }

  .fpv-retry-btn {
    padding: 8px 20px; border-radius: 8px; border: 1px solid #e2e8f0;
    background: white; color: #475569; font-size: 13px; font-weight: 500;
    cursor: pointer; transition: all 0.2s;
  }

  .fpv-retry-btn:hover { background: #f8fafc; border-color: #cbd5e1; }
  .fpv-retry-btn.primary { background: #6366f1; color: white; border: none; text-decoration: none; }
  .fpv-retry-btn.primary:hover { background: #4f46e5; }
`;

// ─── Main Component ───────────────────────────────────────────────────────────
/**
 * FilePreviewModal
 * @param {string}   url        - Đường dẫn file
 * @param {string}   fileType   - Loại file: pdf | docx | xlsx | image | video | audio | txt
 * @param {boolean}  open       - Mở/đóng modal
 * @param {function} onClose    - Callback đóng modal
 * @param {string}   [fileName] - Tên file tùy chọn (tự detect nếu không truyền)
 */
export default function FilePreviewModal({ id, url, fileType, open, onClose, fileName, originFileObj }) {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);
    const overlayRef = useRef(null);
    const config = getFileConfig(fileType);
    const displayName = fileName || getFileName(url || "");
    const [hasError, setHasError] = useState(false);
    const timeoutRef = useRef(null);
    const [retry, setRetry] = useState(0);
    const loadedRef = useRef(false);

    // Determine timeout duration based on file type
    const getTimeoutDuration = () => {
        // Office viewers need more time
        if (['docx', 'xlsx', 'pptx'].includes(fileType)) return 12000;
        // Regular files load faster
        if (['image', 'audio'].includes(fileType)) return 8000;
        // Default timeout
        return 10000;
    };

    useEffect(() => {
        if (open) {
            setLoading(true);
            setHasError(false);
            loadedRef.current = false;

            // Set timeout for loading failure
            // For direct file types (image, video, audio, pdf), onLoad/onLoadedData should fire
            // For iframes (office docs), need to wait for iframe to signal completion
            const timeoutMs = getTimeoutDuration();
            timeoutRef.current = setTimeout(() => {
                if (!loadedRef.current) {
                    setHasError(true);
                    setLoading(false);
                }
            }, timeoutMs);
        }
        return () => clearTimeout(timeoutRef.current);
    }, [open, url, retry, fileType]);

    useEffect(() => {
        const handleKey = (e) => { if (e.key === "Escape") onClose?.(); };
        if (open) window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [open, onClose]);

    // Prevent scroll when open
    useEffect(() => {
        document.body.style.overflow = open ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [open]);

    if (!open || !url) return null;

    const handleOverlayClick = (e) => {
        if (e.target === overlayRef.current) onClose?.();
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch { }
    };

    // Mark as loaded when content is ready
    const handleContentLoaded = () => {
        loadedRef.current = true;
        clearTimeout(timeoutRef.current);
        setLoading(false);
        setHasError(false);
    };

    // Handle iframe load
    const handleIframeLoad = () => {
        handleContentLoaded();
    };

    // Handle file error (network, access denied, etc)
    const handleFileError = () => {
        if (!loadedRef.current && !hasError) {
            setHasError(true);
            setLoading(false);
        }
    };

    const handleRetry = () => {
        setLoading(true);
        setHasError(false);
        loadedRef.current = false;
        setRetry(prev => prev + 1);
    };
    const handleDownloadSingle = async () => {
        if (originFileObj) {
            saveAs(originFileObj, fileName || originFileObj.name);
            return;
        }
        try {
            const response = await _unitOfWork.resource.previewResource(id);
            if (!response || !response.data || !response.data.url) {
                console.error("Invalid preview response:", response);
                return;
            }
            const fileUrl = generateFullUrl(response.data.url);
            const res = await fetch(fileUrl);
            if (!res.ok) {
                throw new Error(`Download failed: ${res.status}`);
            }
            const blob = await res.blob();
            let fileName = response.data?.fileName || "file";
            saveAs(blob, fileName);
        } catch (error) {
            console.error("Download error:", error);
        }
    };

    return (
        <>
            <style>{styles}</style>
            <div className="fpv-overlay" ref={overlayRef} onClick={handleOverlayClick} role="dialog" aria-modal="true">
                <div className="fpv-modal">

                    {/* Header */}
                    <div className="fpv-header">
                        <div className="fpv-icon-wrap" style={{ background: config.bg, color: config.color }}>
                            {config.icon}
                        </div>
                        <div className="fpv-meta">
                            <div className="fpv-filename" title={displayName}>{displayName}</div>
                            <div className="fpv-filetype">{config.label}</div>
                        </div>
                        <div className="fpv-actions">
                            {/* Open in new tab */}
                            <a
                                href={(fileType === 'pptx' || fileType === 'xlsx') ? `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(url)}` : url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="fpv-btn"
                                title={t("modal.attachmentView.download_open")}
                            >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                    <polyline points="15 3 21 3 21 9" />
                                    <line x1="10" y1="14" x2="21" y2="3" />
                                </svg>
                            </a>
                            {/* Download */}
                            <a
                                // href={url}
                                // download={displayName}
                                onClick={handleDownloadSingle}
                                className="fpv-btn"
                                title={t("common_buttons.down_load")}
                            >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                    <polyline points="7 10 12 15 17 10" />
                                    <line x1="12" y1="15" x2="12" y2="3" />
                                </svg>
                            </a>
                            {/* Close */}
                            <button className="fpv-btn fpv-btn-close" onClick={onClose} title={t("common_buttons.close")}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="fpv-body">
                        {loading && (
                            <div className="fpv-loading">
                                <div className="fpv-spinner" />
                                <span>{t("customer.messages.loading")}</span>
                            </div>
                        )}
                        {hasError && !loading && (
                            <div className="fpv-error-state">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="12" y1="8" x2="12" y2="12" />
                                    <line x1="12" y1="16" x2="12.01" y2="16" />
                                </svg>
                                <h3>{t("file.error_preview")}</h3>
                                <p>{t("file.error_message")}</p>
                                <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
                                    <button type="button" className="fpv-retry-btn" onClick={handleRetry}>{t("file.retry")}</button>
                                    <button type="button" className="fpv-retry-btn primary" onClick={handleDownloadSingle}>{t("common_buttons.down_load")}</button>
                                    {/* <a href={url} download={displayName} className="fpv-retry-btn primary">{t("common_buttons.down_load")}</a> */}
                                </div>
                            </div>
                        )}
                        <div
                            className={`fpv-body-inner ${hasError ? 'hidden' : ''}`}
                            style={{ display: hasError ? 'none' : 'block' }}
                        >
                            <FileRenderWrapper
                                url={url}
                                fileType={fileType}
                                config={config}
                                onLoad={handleContentLoaded}
                                onError={handleFileError}
                                originFileObj={originFileObj}
                            />
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="fpv-footer">
                        <span className="fpv-url" title={url}>{url}</span>
                        <button className="fpv-copy-btn" onClick={handleCopy}>
                            {copied ? (
                                <>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
                                    <span style={{ color: "#22c55e" }}>{t("file.copied")}</span>
                                </>
                            ) : (
                                <>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <rect x="9" y="9" width="13" height="13" rx="2" />
                                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                    </svg>
                                    {t("file.copy_url")}
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

// ─── PDF Preview Wrapper ─────────────────────────────────────────────────────
function PdfPreviewWrapper({ url, onLoad, onError, originFileObj }) {
    const [blobUrl, setBlobUrl] = useState('');
    const [pdfError, setPdfError] = useState(false);

    useEffect(() => {
        if (originFileObj) {
            const blobUrl = URL.createObjectURL(originFileObj);
            setBlobUrl(blobUrl);
            onLoad?.();
            return () => URL.revokeObjectURL(blobUrl);
        }
        let isMounted = true;
        setPdfError(false);

        const loadPdf = async () => {
            try {
                const res = await fetch(url);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const blob = await res.blob();
                if (isMounted) {
                    const bUrl = URL.createObjectURL(blob);
                    setBlobUrl(bUrl);
                    onLoad?.();
                }
            } catch (err) {
                if (isMounted) {
                    console.error('PDF load error:', err);
                    setPdfError(true);
                    onError?.();
                }
            }
        };

        loadPdf();
        return () => {
            isMounted = false;
            if (blobUrl) URL.revokeObjectURL(blobUrl);
        };
    }, [url, onLoad, onError]);

    if (pdfError) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#ef4444' }}>
                <p>Failed to load PDF</p>
            </div>
        );
    }

    if (!blobUrl) {
        return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }} />;
    }

    return (
        <embed
            src={blobUrl}
            type="application/pdf"
            style={{ width: "100%", height: "100%", borderRadius: 8 }}
        />
    );
}

// ─── Text Preview Wrapper ─────────────────────────────────────────────────────
function TextPreviewWrapper({ url, onLoad, onError }) {
    const [textContent, setTextContent] = useState('');
    const [textError, setTextError] = useState(false);

    useEffect(() => {
        let isMounted = true;
        setTextError(false);

        const loadText = async () => {
            try {
                const res = await fetch(url);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const text = await res.text();
                if (isMounted) {
                    setTextContent(text);
                    onLoad?.();
                }
            } catch (err) {
                if (isMounted) {
                    console.error('Text load error:', err);
                    setTextError(true);
                    onError?.();
                }
            }
        };

        loadText();
        return () => {
            isMounted = false;
        };
    }, [url, onLoad, onError]);

    if (textError) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#ef4444' }}>
                <p>Failed to load text file</p>
            </div>
        );
    }

    return (
        <pre
            style={{
                width: '100%',
                height: '100%',
                padding: '16px',
                margin: 0,
                background: '#1e1e2e',
                color: '#cdd6f4',
                fontSize: '13px',
                fontFamily: '"DM Mono", monospace',
                overflow: 'auto',
                whiteSpace: 'pre-wrap',
                wordWrap: 'break-word',
                borderRadius: 8,
            }}
        >
            {textContent || 'Loading...'}
        </pre>
    );
}

// ─── Render Wrapper Component ──────────────────────────────────────────────────
// Handles specific loading behavior for different file types
function FileRenderWrapper({ url, fileType, config, onLoad, onError, originFileObj }) {
    const renderContent = () => {
        // For images: use onLoad event
        if (fileType === 'image') {
            return (
                <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: 12 }}>
                    <img
                        src={url}
                        alt="Preview"
                        onLoad={onLoad}
                        onError={onError}
                        style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", borderRadius: 8, boxShadow: "0 8px 32px rgba(0,0,0,0.18)" }}
                    />
                </div>
            );
        }

        // For video/audio: onLoadedData will fire when playable data is loaded
        if (fileType === 'video') {
            return (
                <video
                    controls
                    autoPlay
                    onLoadedData={onLoad}
                    onError={onError}
                    style={{ width: "100%", height: "100%", objectFit: "contain", borderRadius: 8, background: "#000" }}
                >
                    <source src={url} />
                    {/* fallback text */}
                </video>
            );
        }

        if (fileType === 'audio') {
            return (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 24 }}>
                    <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg,#ec4899,#a855f7)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 40px rgba(236,72,153,0.4)", animation: "spin 4s linear infinite" }}>
                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
                            <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
                        </svg>
                    </div>
                    <audio
                        controls
                        autoPlay
                        onLoadedData={onLoad}
                        onError={onError}
                        style={{ width: "90%", accentColor: "#ec4899" }}
                    >
                        <source src={url} />
                    </audio>
                </div>
            );
        }

        // For PDF: use embed or iframe with blob URL
        if (fileType === 'pdf') {
            return (
                <PdfPreviewWrapper url={url} onLoad={onLoad} onError={onError} originFileObj={originFileObj} />
            );
        }

        // For TXT: fetch and display as text
        if (fileType === 'txt') {
            return (
                <TextPreviewWrapper url={url} onLoad={onLoad} onError={onError} originFileObj={originFileObj} />
            );
        }

        // For office docs (docx, xlsx, pptx): use Microsoft Office 365 or Google Docs viewer
        if (fileType === 'docx' || fileType === 'xlsx' || fileType === 'pptx') {
            const viewerUrl = fileType === 'docx'
                ? `https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`
                : `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(url)}`;

            return (
                <iframe
                    src={viewerUrl}
                    title={`Preview: ${fileType.toUpperCase()}`}
                    onLoad={onLoad}
                    onError={onError}
                    style={{ width: "100%", height: "100%", border: "none", borderRadius: 8 }}
                />
            );
        }

        // Unknown file type
        return config.render(url, onLoad);
    };

    return <div style={{ width: "100%", height: "100%" }}>{renderContent()}</div>;
}


// ─── Demo / Usage Example ─────────────────────────────────────────────────────
// import FilePreviewModal from './FilePreviewModal';
//
// function App() {
//   const [modal, setModal] = useState(null);
//
//   const files = [
//     { label: "📄 PDF", url: "https://www.w3.org/WAI/WCAG21/wcag21.pdf", fileType: "pdf" },
//     { label: "🖼️ Image", url: "https://picsum.photos/1200/800", fileType: "image" },
//     { label: "🎥 Video", url: "https://www.w3schools.com/html/mov_bbb.mp4", fileType: "video" },
//     { label: "🎵 Audio", url: "https://www.w3schools.com/html/horse.mp3", fileType: "audio" },
//   ];
//
//   return (
//     <div>
//       {files.map(f => (
//         <button key={f.fileType} onClick={() => setModal(f)}>{f.label}</button>
//       ))}
//       <FilePreviewModal
//         open={!!modal}
//         url={modal?.url}
//         fileType={modal?.fileType}
//         onClose={() => setModal(null)}
//       />
//     </div>
//   );
// }
