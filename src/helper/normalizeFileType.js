export function normalizeFileType(ext = "") {
    const e = ext.replace(".", "").toLowerCase();

    if (["jpg", "jpeg", "png", "gif", "webp", "bmp"].includes(e)) return "image";
    if (["mp4", "webm", "ogg", "mkv"].includes(e)) return "video";
    if (["mp3", "wav", "ogg"].includes(e)) return "audio";
    if (["pdf"].includes(e)) return "pdf";
    if (["doc", "docx"].includes(e)) return "docx";
    if (["xls", "xlsx"].includes(e)) return "xlsx";
    // if (["csv"].includes(e)) return "csv";
    if (["txt", "log", "json", "html", "js", "csv"].includes(e)) return "txt";
    if (["ppt", "pptx"].includes(e)) return "pptx";

    return "unknown";
};