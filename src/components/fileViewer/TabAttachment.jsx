import React, { useState, useEffect } from "react";
import { Row, Col, Table, Button, Tooltip, Checkbox, Modal } from "antd";
import * as _unitOfWork from "../../api";
import { useTranslation } from "react-i18next";
import { DeleteOutlined, DownloadOutlined, EyeOutlined, PlusOutlined } from "@ant-design/icons";
import FilePreviewer from "./FilePreviewer";
import { saveAs } from "file-saver";
import { normalizeFileType } from "../../helper/normalizeFileType";
import { generateFullUrl } from "../../api/restApi";
import { parseDateDDMMYYYY } from "../../helper/date-helper";
import { assetModelDocumentCategory, attachmentBreakdownCategory } from "../../utils/constant";
import Confirm from "../modal/Confirm";


export default function TabAttachment({
    listDocuments,
    onClickDelete,
    preview = true,
    onClickCreate,
    notButtonCreateDocument = false,
    notFileType,
}) {
    const { t } = useTranslation();
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewFile, setPreviewFile] = useState(null);

    const onSelectChange = (selectedRowKeys) => {
        setSelectedFiles(selectedRowKeys);
    };
    const onSelectAll = (e) => {
        setSelectedFiles(e.target.checked ? listDocuments.map(doc => doc.id) : []);
    };

    const handlePreview = async (item) => {
        // const extension = normalizeFileType(item?.resource?.extension);
        let extension = normalizeFileType(item?.resource?.extension);
        if (extension === "unknown" && item.new && item.originFileObj && item.originFileObj.name) {
            const parts = item.originFileObj.name.split('.');
            const extFromName = parts.length > 1 ? parts.pop() : '';
            extension = normalizeFileType(extFromName);
        }
        let fileUrl = "";

        if (item.new && item.originFileObj) {
            fileUrl = URL.createObjectURL(item.originFileObj);
        } else {
            const response = await _unitOfWork.resource.previewResource(item?.resource?.id || item?.resource?._id);
            if (!response || !response.data || !response.data.url) {
                console.error("Invalid preview response:", response);
                return;
            }
            fileUrl = generateFullUrl(response.data.url);
        }
        setPreviewFile({
            url: fileUrl,
            id: item?.resource?.id || item?.resource?._id,
            name: item.resource?.fileName,
            extension: extension,
            originFileObj: item.originFileObj || null,
        });
        setPreviewVisible(true);
    };

    const handleDownloadSingle = async (item) => {
        if (item.new && item.originFileObj) {
            const url = URL.createObjectURL(item.originFileObj);
            saveAs(item.originFileObj, item.resource?.fileName || "file");
            setTimeout(() => URL.revokeObjectURL(url), 100);
            return;
        }
        try {
            const response = await _unitOfWork.resource.previewResource(item?.resource?.id || item?.resource?._id);
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
    const Confirm2 = (message) => {
        return new Promise(resolve => {
            Modal.confirm({
                content: message,
                onOk: () => resolve(true),
                onCancel: () => resolve(false)
            });
        });
    }
    const handleDownloadSelected = async () => {
        try {
            const selectedDocs = selectedFiles
                .map(id => listDocuments.find(d => d.id === id))
                .filter(doc => doc && !doc.new);
            if (selectedDocs.length === 0) return;

            // const ok = await Confirm2("Tệp tải xuống không bao gồm tệp mới tải lên chưa lưu, tiếp tục tải?");
            // if (!ok) return;

            if (selectedDocs.length === 1) {
                handleDownloadSingle(selectedDocs[0]);
                return;
            }

            const filePaths = selectedDocs.map((doc) => {
                const rawPath = doc.resource?.filePath;
                if (!rawPath) return "";
                const normalizedPath = rawPath.replace(/\\/g, '/');
                const parts = normalizedPath.split('uploads/');
                const relativePath = parts.length > 1 ? parts[1] : normalizedPath;
                return relativePath;
            });
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
            render: (_, __, index) => index + 1,
            align: "center",
        },
        ...(notFileType
            ? []
            : [
                {
                    title: t("purchaseQuotation.attachment.file_type"),
                    render: (record) => (
                        <span>{t(attachmentBreakdownCategory[record?.attachmentCategory])
                            || t(assetModelDocumentCategory[record?.documentCategory]) || record?.documentCategory}</span>
                    )
                }
            ]
        ),
        {
            title: t("breakdown.close.fields.attachments_name"),
            dataIndex: ['resource'],
            render: (text) => <span>{`${text?.fileName || ''}${text?.extension || ''}`}</span>
        },
        {
            title: t("file.uploader"),
            dataIndex: ['resource', 'createdBy', 'fullName'],

        },
        {
            title: t("file.upload_date"),
            dataIndex: 'createdAt',
            render: (text) => (
                <span> {parseDateDDMMYYYY(text)}</span>
            )
        },
        {
            title: t("breakdown.list.columns.action"),
            dataIndex: "action",
            align: "center",
            width: 80,
            render: (_, record) => (
                <div style={{ display: "flex", justifyContent: "space-around", gap: 8, }}>
                    <Tooltip>
                        <Button
                            icon={<EyeOutlined />}
                            size="small"
                            style={{ color: "green" }}
                            onClick={() => handlePreview(record)}
                        />
                    </Tooltip>
                    <Tooltip>
                        <Button
                            type="primary"
                            icon={<DownloadOutlined />}
                            size="small"
                            onClick={() => handleDownloadSingle(record)}
                        />
                    </Tooltip>
                    {onClickDelete && (
                        <Tooltip title={t("assetModel.common.buttons.delete")}>
                            <Button
                                danger
                                type="primary"
                                size="small"
                                icon={<DeleteOutlined />}
                                onClick={() =>
                                    Confirm(
                                        t("assetModel.common.messages.confirm_delete"),
                                        () => onClickDelete(record)
                                    )
                                }
                            />
                        </Tooltip>
                    )}
                </div>
            ),
        },
    ];
    return (
        <div>
            <Row gutter={[8, 8]}>
                <Col span={24} style={{ textAlign: 'right' }}>
                    {onClickCreate && notButtonCreateDocument && (
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={onClickCreate}
                            style={{ marginRight: 16 }}
                        >
                            {t("assetModel.document.list_add_button")}
                        </Button>
                    )}
                    {preview && (
                        <>
                            <Checkbox
                                className="mr-3"
                                onChange={onSelectAll}
                                checked={selectedFiles.length === listDocuments.length && listDocuments.length > 0}
                            >
                                {t("workReportByPerson.list_file.select_all")}
                            </Checkbox>
                            <Button
                                type="primary"
                                disabled={selectedFiles.length === 0}
                                onClick={handleDownloadSelected}
                                icon={<DownloadOutlined />}
                            >
                                {t("workReportByPerson.list_file.download_selected")} ({selectedFiles.length})
                            </Button>
                        </>
                    )}
                </Col>
                <Col span={24}>

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
                    />
                </Col>
            </Row>
            <FilePreviewer
                open={previewVisible}
                onClose={() => {
                    setPreviewVisible(false);
                }}
                id={previewFile?.id}
                url={previewFile?.url}
                fileType={previewFile?.extension}
                fileName={previewFile?.name}
                originFileObj={previewFile?.originFileObj}
                destroyOnClose
            />
        </div>
    );
};