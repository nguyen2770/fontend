import React, { useState, useEffect } from "react";
import { Row, Col, Table, Button, Tooltip } from "antd";
import * as _unitOfWork from "../../../../api";
import AttachmentModalView from "../../../../components/modal/attachmentModel/AttachmentModalView";
import { useTranslation } from "react-i18next";
import { render } from "@testing-library/react";
import { DownloadOutlined, EyeOutlined } from "@ant-design/icons";
import { parseDateDDMMYYYY } from "../../../../helper/date-helper";
import { attachmentBreakdownCategory, imageExtensions } from "../../../../utils/constant";
import { rootURL } from "../../../../api/config";
import { normalizeFileType } from "../../../../helper/normalizeFileType";
import FilePreviewer from "../../../../components/fileViewer/FilePreviewer";
import { generateFullUrl } from "../../../../api/restApi";
import TabAttachment from "../../../../components/fileViewer/TabAttachment";

export default function TabsAttachment({ breakdown }) {
    const { t } = useTranslation();
    const [breakdownAttachments, setBreakdownAttachments] = useState([]);
    const [fileList, setFileList] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewFile, setPreviewFile] = useState(null);

    useEffect(() => {
        fetchGetAllBreakdownAttachment();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchGetAllBreakdownAttachment = async () => {
        let res = await _unitOfWork.breakdown.getAllAttachmentByBreackdown({ breakdown: breakdown.id || breakdown._id });
        if (res && res.code === 1) {
            const data = res.data.map(item => {
                return {
                    ...item,
                    id: item._id,
                }
            })
            setFileList(data);
        }
    };

    const onSelectChange = (newSelectedRowKeys) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const handlerDownloadMultiFile = () => {
        if (!selectedRowKeys.length) return;

        selectedRows.forEach(r => {
            downloadFile(r)
        });
    };

    const downloadFile = async (record) => {
        if (
            record.resource?.extension &&
            imageExtensions.includes(record.resource?.extension.toLowerCase())
        ) {
            const blob = await _unitOfWork.resource.downloadImage(
                record?.resource?.id
            );
            if (blob) {
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = record.resource?.fileName;
                a.click();

                URL.revokeObjectURL(url);
            }
        } else {
            // Không phải ảnh → tải về

            const link = document.createElement("a");
            link.href = _unitOfWork.resource.getImage(record.resource?.id);
            link.download = record.resource?.fileName;;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const columns = [
        {
            title: 'STT',
            render: (_, __, index) => index + 1,
            align: "center",
        },
        {
            title: 'Loại file',
            dataIndex: 'attachmentCategory',
            render: (text) => (
                <span>{t(attachmentBreakdownCategory[text])}</span>
            )
        },
        {
            title: 'Tên file',
            dataIndex: ['resource', 'fileName'],

        },
        {
            title: 'Người tải',
            dataIndex: ['resource', 'createdBy', 'fullName'],

        },
        {
            title: 'Ngày tải',
            dataIndex: ['resource', 'createdAt'],
            render: (text) => (
                <span> {parseDateDDMMYYYY(text)}</span>
            )
        },
        {
            title: "Action",
            dataIndex: "action",
            align: "center",
            width: 80,
            render: (_, record) => (
                <div style={{ display: "flex", justifyContent: "space-around", gap: 8, }}>
                    <Tooltip>
                        <Button
                            // type="primary"
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
                            onClick={() => downloadFile(record)}
                        />
                    </Tooltip>
                </div>
            ),
        },
    ];
    const handlePreview = async (item) => {
        // const rawPath = item?.resource?.filePath;
        // if (!rawPath) return "";
        // const normalizedPath = rawPath.replace(/\\/g, '/');
        // const parts = normalizedPath.split('uploads/');
        // const relativePath = parts.length > 1 ? parts[1] : normalizedPath;
        // let fileUrl = `${rootURL}/files/${relativePath}`;
        // const extension = normalizeFileType(item?.resource?.extension);
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
            name: item.resource?.fileName,
            extension: extension,
        });
        setPreviewVisible(true);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: (keys, rows) => {
            setSelectedRowKeys(keys);   // id
            setSelectedRows(rows);      // full record
        },
    };
    const hasSelected = selectedRowKeys.length > 0;
    return (
        // <div>
        //     <Row gutter={[8, 8]}>
        //         <Col span={24} style={{ textAlign: 'right' }}>

        //             <Button
        //                 type="primary"
        //                 disabled={!hasSelected}
        //                 onClick={handlerDownloadMultiFile}
        //                 icon={<DownloadOutlined />}
        //             >
        //                 Tải xuống
        //             </Button>
        //         </Col>

        //         <Col span={24}>

        //             <Table
        //                 rowKey={(record) => record._id}
        //                 rowSelection={rowSelection}
        //                 bordered
        //                 columns={columns}
        //                 dataSource={fileList}
        //             />
        //         </Col>
        //     </Row>
        //     <FilePreviewer
        //         open={previewVisible}
        //         onClose={() => {
        //             setPreviewVisible(false);
        //         }}
        //         id={previewFile?.id}
        //         url={previewFile?.url}
        //         fileType={previewFile?.extension}
        //         fileName={previewFile?.name}
        //         destroyOnClose
        //     />
        // </div>
        <Row className="mt-2">
            <TabAttachment
                listDocuments={fileList}
            />
        </Row>
    );
};