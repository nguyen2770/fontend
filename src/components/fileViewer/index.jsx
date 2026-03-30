import React, { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { CloseOutlined } from "@ant-design/icons";
import { Image, Button, Spin } from "antd";
import { FILE_EXTENSION } from "../../utils/constant";

pdfjs.GlobalWorkerOptions.workerSrc =
  `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

export default function FileViewerCustom({
  file,
  showDelete,
  removefile,
  index,
}) {
  const [numPages, setNumPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");
  const containerRef = useRef(null);
  const [pageWidth, setPageWidth] = useState(900);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        const w = containerRef.current.clientWidth || 900;
        setPageWidth(Math.min(900, w));
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const getFileTypeFlags = (f) => {
    const name = (f?.name || "").toLowerCase();
    const contentType = (f?.type || f?.contentType || "").toLowerCase();
    const isPdf =
      name.endsWith(".pdf") || contentType === "application/pdf" ||
      (Array.isArray(FILE_EXTENSION?.PDF) &&
        FILE_EXTENSION.PDF.some((p) => name.endsWith((p || "").toLowerCase())));
    const isExcel =
      (Array.isArray(FILE_EXTENSION?.EXCEL) &&
        FILE_EXTENSION.EXCEL.some((p) => name.endsWith((p || "").toLowerCase()))) ||
      /sheet|excel/.test(contentType);
    const isDocx =
      (Array.isArray(FILE_EXTENSION?.WORD) &&
        FILE_EXTENSION.WORD.some((p) => name.endsWith((p || "").toLowerCase()))) ||
      /word/.test(contentType);
    const isImage =
      Array.isArray(FILE_EXTENSION?.IMAGE) &&
      FILE_EXTENSION.IMAGE.some((p) => name.endsWith((p || "").toLowerCase()));
    return { isPdf, isExcel, isDocx, isImage };
  };

  const onShowFile = (f) => {
    if (!f) return null;
    const filePath = f.src;
    const { isPdf, isExcel, isDocx, isImage } = getFileTypeFlags(f);

    if (isPdf) {
      return (
        <div
          ref={containerRef}
          style={{ width: "100%", maxHeight: "70vh", overflowY: "auto", overflowX: "hidden" }}
        >
          <Spin spinning={loading}>
            <Document
              // Nếu cần kèm credentials/headers, dùng object sau:
              // file={{ url: filePath, withCredentials: true, httpHeaders: { Authorization: '...' } }}
              file={filePath}
              onLoadSuccess={({ numPages }) => {
                setNumPages(numPages || 0);
                setLoading(false);
                setErrMsg("");
              }}
              onLoadError={(e) => {
                setLoading(false);
                setErrMsg(e?.message || "Không thể tải PDF");
                console.error("PDF load error:", e);
              }}
              externalLinkTarget="_blank"
            >
              {numPages > 0 &&
                Array.from({ length: numPages }, (_, i) => (
                  <Page
                    key={`page_${i + 1}`}
                    pageNumber={i + 1}
                    width={pageWidth}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                  />
                ))}
            </Document>
          </Spin>
          {!!errMsg && (
            <div style={{ color: "red", marginTop: 8 }}>
              {errMsg}
            </div>
          )}
        </div>
      );
    }

    // Thay react-file-viewer bằng Office Online Viewer cho Word/Excel
    if (isDocx || isExcel) {
      const officeUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
        filePath
      )}`;
      return (
        <iframe
          title="office-viewer"
          src={officeUrl}
          style={{ width: "100%", height: "70vh", border: "none" }}
        />
      );
    }

    if (isImage) {
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <Image
            src={file.src}
            alt="Unable to display"
            style={{
              maxWidth: "100%",
              maxHeight: "70vh",
              display: "block",
              margin: "0 auto",
            }}
          />
        </div>
      );
    }

    return <>Không thể hiển thị file này</>;
  };

  return (
    <div style={{ position: "relative" }}>
      {showDelete && (
        <Button
          style={{
            fontSize: "11px",
            padding: "1px 5px",
            border: "none",
            margin: "0",
            backgroundColor: "white",
            position: "absolute",
            top: "-13px",
            right: "0px",
          }}
          onClick={() => removefile?.(index, file?.id)}
        >
          <CloseOutlined />
        </Button>
      )}

      <div className="renderfile hover-file-document mb-4 mt-3">
        <div style={{ width: "100%", marginTop: 16 }}>{onShowFile(file)}</div>
      </div>
    </div>
  );
}