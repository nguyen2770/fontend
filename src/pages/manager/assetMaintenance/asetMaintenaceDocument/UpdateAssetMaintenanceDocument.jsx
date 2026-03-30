import { useEffect, useRef, useState } from "react";
import { Button, Card, Col, Form, Input, InputNumber, Modal, Row, Select, Tooltip } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import * as _unitOfWork from "../../../../api";
import { assetModelDocumentCategory } from "../../../../utils/constant";
import { useTranslation } from "react-i18next";

export default function UpdateAssetMaintenanceDocument({
    open,
    handleCancel,
    handleOk,
    AssetModelDocumentChange,
    AssetMaintenance,
    onRefresh
}) {
    const { t } = useTranslation();
    const [form] = Form.useForm();
    const [taskItem, setTaskItem] = useState({
        attachFileName: "",
        file: null,
        documentCategory: "",
        resource: null
    });
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (AssetModelDocumentChange) {
            setTaskItem({
                attachFileName:
                    AssetModelDocumentChange.resource?.fileName || "",
                file: null,
                documentCategory:
                    AssetModelDocumentChange.documentCategory || "",
                resource: AssetModelDocumentChange.resource || null
            });
            form.setFieldsValue({
                documentCategory:
                    AssetModelDocumentChange.documentCategory || ""
            });
        }
    }, [AssetModelDocumentChange, form]);

    const handleFileSelect = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) {
                Modal.error({
                    title: t("assetModel.common.messages.upload_error_size")
                });
                return;
            }
            setTaskItem((prev) => ({
                ...prev,
                attachFileName: file.name,
                file
            }));
        }
    };

    const isFormValid = () =>
        taskItem.documentCategory && (taskItem.file || taskItem.resource);

    const onFinish = async () => {
        try {
            let resource = taskItem.resource?.id || "";
            if (taskItem.file) {
                const formData = new FormData();
                formData.append("file", taskItem.file);
                const resUpload =
                    await _unitOfWork.resource.uploadImage(formData);
                resource = resUpload.resourceId;
            }
            const updatePayload = {
                assetMaintenance: AssetMaintenance.id || AssetMaintenance._id,
                resource,
                documentCategory: taskItem.documentCategory
            };

            const res =
                await _unitOfWork.assetMaintenanceDocument.updateAssetMaintenanceDocument(

                    { id: AssetModelDocumentChange.id, ...updatePayload }
                );
            if (res && res.code === 1) {
                Modal.success({
                    title: t("assetModel.document.messages.update_success")
                });
                handleOk();
                onRefresh();
            } else {
                Modal.error({
                    title: t("assetModel.document.messages.update_error")
                });
            }
        } catch {
            Modal.error({
                title: t("assetModel.document.messages.update_error")
            });
        }
    };

    return (
        <Modal
            open={open}
            onCancel={handleCancel}
            closable={false}
            footer={false}
            width={800}
            className="custom-modal"
            destroyOnClose
        >
            <Card title={t("assetModel.document.update_title")}>
                <Row gutter={[16, 16]}>
                    <Col span={24}>
                        <Form labelWrap form={form} layout="vertical">
                            <Form.Item
                                label={t("assetModel.document.fields.category")}
                                name="documentCategory"
                                rules={[
                                    {
                                        required: true,
                                        message: t(
                                            "assetModel.document.validation.required_category"
                                        )
                                    }
                                ]}
                            >
                                <Input
                                    value={taskItem.documentCategory}
                                    placeholder={t(
                                        "assetModel.document.fields.category_placeholder"
                                    )}
                                // onChange={(value) =>
                                //     setTaskItem((prev) => ({
                                //         ...prev,
                                //         documentCategory: value
                                //     }))
                                // }
                                >
                                    {/* {Object.entries(assetModelDocumentCategory).map(
                                        ([key, label]) => (
                                            <Select.Option key={key} value={key}>
                                                {t(label)}
                                            </Select.Option>
                                        )
                                    )} */}
                                </Input>
                            </Form.Item>

                            <Form.Item
                                label={
                                    <span>
                                        {t("assetModel.document.fields.file_full")}{" "}
                                        <Tooltip
                                            title={t(
                                                "assetModel.document.fields.tooltip_file_rules"
                                            )}
                                        >
                                            <InfoCircleOutlined style={{ color: "#1890ff" }} />
                                        </Tooltip>
                                    </span>
                                }
                            >
                                <Input
                                    readOnly
                                    value={taskItem.attachFileName}
                                    placeholder={t(
                                        "assetModel.document.fields.file_placeholder"
                                    )}
                                    onClick={handleFileSelect}
                                />
                                <input
                                    type="file"
                                    style={{ display: "none" }}
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                />
                            </Form.Item>

                            <Form.Item style={{ textAlign: "right" }}>
                                <Button onClick={handleCancel}>
                                    {t("assetModel.common.buttons.cancel")}
                                </Button>
                                <Button
                                    type="primary"
                                    disabled={!isFormValid()}
                                    onClick={onFinish}
                                    style={{ marginLeft: 8 }}
                                >
                                    {t("assetModel.common.buttons.update")}
                                </Button>
                            </Form.Item>
                        </Form>
                    </Col>
                </Row>
            </Card>
        </Modal>
    );
}