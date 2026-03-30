import { Button, Card, Checkbox, Col, List, Row, Empty, Modal, Tooltip, Table } from "antd";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
    CloseCircleOutlined,
    DownloadOutlined,
    FileOutlined,
    FileImageOutlined,
    EyeOutlined
} from "@ant-design/icons";
import { rootURL } from "../../../api/config";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import * as _unitOfWork from "../../../api";
import FilePreviewer from "../../../components/fileViewer/FilePreviewer";
import { normalizeFileType } from "../../../helper/normalizeFileType";
import { parseDate } from "../../../helper/date-helper";
import { generateFullUrl } from "../../../api/restApi";

export default function ModalFileInWork({ open, handleCancel, listDocuments = [] }) {
    const { t } = useTranslation();
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewFile, setPreviewFile] = useState(null);

    const onInternalCancel = () => {
        setSelectedFiles([]);
        handleCancel();
    };
    const onSelectChange = (selectedRowKeys) => {
        setSelectedFiles(selectedRowKeys);
    };

    const onSelectAll = (e) => {
        setSelectedFiles(e.target.checked ? listDocuments.map(doc => doc.id) : []);
    };

    const handlePreview = async (item) => {
        try {
            const extension = normalizeFileType(item?.resource?.extension);
            const response = await _unitOfWork.resource.previewResource(item?.resource?.id);
            if (!response || !response.data || !response.data.url) {
                console.error("Invalid preview response:", response);
                return;
            }

            const fileUrl = generateFullUrl(response.data.url);
            setPreviewFile({
                url: fileUrl,
                id: item.resource?.id,
                name: item.resource?.fileName || response.data.fileName,
                extension: extension,
            });
            setPreviewVisible(true);
        } catch (err) {
            console.error("Preview error:", err);
        }
    };
    const handleDownloadSingle = async (item) => {
        try {
            const response = await _unitOfWork.resource.previewResource(item?.resource?.id);
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
            let fileName = item.resource?.fileName || "file";
            let extension = item.resource?.extension || "";
            if (extension && !extension.startsWith('.')) {
                extension = '.' + extension;
            }
            const fullFileName = fileName + extension;

            saveAs(blob, fullFileName);
        } catch (error) {
            console.error("Download error:", error);
        }
    };
    const handleDownloadSelected = async () => {
        try {
            const selectedDocs = selectedFiles.map(id => listDocuments.find(d => d.id === id)).filter(Boolean);
            if (selectedDocs.length === 0) return;

            if (selectedDocs.length === 1) {
                handleDownloadSingle(selectedDocs[0]);
                return;
            }

            const filePaths = selectedDocs.map(d => d.relativePath);
            const downloadUrl = generateFullUrl(`/workReportByPerson/download-zip`);
            const res = await fetch(downloadUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ filePaths }),
            });

            if (res.ok) {
                const blob = await res.blob();
                saveAs(blob, "Tai_lieu_bao_cao.zip");
            }
        } catch (error) {
            console.error("Download error:", error);
        }
    };

    const columns = [
        {
            title: t("customer.export.index"),
            dataIndex: "index",
            key: "index",
            width: 60,
            align: "center",
            render: (text, record, index) => index + 1,
        },
        {
            title: t("breakdown.close.fields.attachments_name"),
            dataIndex: ["resource", "fileName"],
            key: "fileName",
            render: (text) => <span style={{ fontWeight: 500 }}>{text}</span>
        },
        {
            title: t("purchaseQuotation.attachment.file_type"),
            dataIndex: ["resource", "extension"],
            render: (text) => text?.toUpperCase().replaceAll(".", ""),
        },
        {
            title: t("file.uploader"),
            dataIndex: "uploader",
            key: "uploader",
            render: (text) => text || "",
        },
        {
            title: t("file.upload_date"),
            dataIndex: "updatedAt",
            key: "updatedAt",
            render: (text) => parseDate(text),
        },
        {
            title: t("breakdown.list.columns.action"),
            key: "action",
            align: "center",
            width: 120,
            render: (_, item) => (
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                    <Tooltip title={t("assetType.list.buttons.detail")}>
                        <Button
                            size="small"
                            icon={<EyeOutlined style={{ color: '#52c41a' }} />}
                            onClick={() => handlePreview(item)}
                        />
                    </Tooltip>
                    <Tooltip title={t("common_buttons.down_load")}>
                        <Button
                            size="small"
                            icon={<DownloadOutlined style={{ color: '#1890ff' }} />}
                            onClick={() => handleDownloadSingle(item)}
                        />
                    </Tooltip>
                </div>
            ),
        },
    ];

    return (
        <>
            <Modal
                open={open}
                closable={false}
                className="custom-modal"
                footer={false}
                width={"60%"}
            >
                <Card
                    title={t("workReportByPerson.list_file.title")}
                    bodyStyle={{ padding: 0 }}
                    extra={
                        listDocuments.length > 0 && (
                            <Checkbox
                                onChange={onSelectAll}
                                checked={selectedFiles.length === listDocuments.length && listDocuments.length > 0}
                            >
                                {t("workReportByPerson.list_file.select_all")}
                            </Checkbox>
                        )
                    }
                >
                    <Table
                        dataSource={listDocuments}
                        columns={columns}
                        rowKey="id"
                        pagination={{ pageSize: 10 }}
                        rowSelection={{
                            type: 'checkbox',
                            selectedRowKeys: selectedFiles,
                            onChange: onSelectChange,
                        }}
                        bordered
                        size="small"
                        locale={{ emptyText: t("workReportByPerson.list_file.no_data") }}
                    />
                    <div className="modal-footer" style={{ padding: '0 0', textAlign: 'right' }}>
                        <Button className="mr-2" onClick={onInternalCancel}>
                            <CloseCircleOutlined /> {t("common_buttons.close")}
                        </Button>
                        <Button
                            type="primary"
                            disabled={selectedFiles.length === 0}
                            onClick={handleDownloadSelected}
                            icon={<DownloadOutlined />}
                        >
                            {t("workReportByPerson.list_file.download_selected")} ({selectedFiles.length})
                        </Button>
                    </div>
                </Card>
            </Modal>
            <FilePreviewer
                open={previewVisible}
                onClose={() => {
                    if (previewFile?.url?.startsWith("blob:")) {
                        URL.revokeObjectURL(previewFile.url);
                    }
                    setPreviewVisible(false);
                }}
                id={previewFile?.id}
                url={previewFile?.url}
                fileType={previewFile?.extension}
                fileName={previewFile?.name}
                destroyOnClose
            />
        </>
    );
}