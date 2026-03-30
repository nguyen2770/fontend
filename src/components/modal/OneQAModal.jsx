import { Button, Card, Checkbox, Col, Form, Input, Modal } from "antd";
import { useTranslation } from "react-i18next";
import { baseURL } from "../../api/config";
import { ArrowLeftOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { generateFullUrl } from "../../api/restApi";

function OneQAModal({ open, handleCancel, workOrderId, setLoading, assetMaintenance }) {
    const [form] = Form.useForm();
    const { t } = useTranslation();

    useEffect(() => {
        if (open && assetMaintenance) {
            form.setFieldsValue({
                // assetIdOneQA: assetMaintenance.assetNumber
                Procedures: assetMaintenance.oneQaProcedureUri,
            });
        }
    }, [open])
    const handleFinish = () => {
        const procedureUri = form.getFieldValue("Procedures");
        const assetIdOneQA = assetMaintenance.assetNumber;
        const createOrUpdateAsset = form.getFieldValue("createOrUpdateAsset");

        const fullURL = generateFullUrl()
        const callbackUrl = `${fullURL}calibration/oneQA-callback`;

        let uri =
            `${procedureUri}` +
            `&assetId=${assetIdOneQA || ""}` +
            `&settings.WorkOrderId=${workOrderId}` +
            `&callbackType=resultfile` +
            `&callback=${encodeURIComponent(callbackUrl)}`;

        // thêm thông tin tài sản để tạo mới bên oneQA 
        if (createOrUpdateAsset && assetMaintenance) {
            const assetInfo = {
                manufacturer: assetMaintenance.manufacturerName || "",
                model: assetMaintenance.assetModelName || "",
                serialNumber: assetMaintenance.serial || "",
                medicalDeviceCategory:
                    assetMaintenance.subCategoryName
                    || assetMaintenance.assetTypeCategory
                    || "",
                description: assetMaintenance.description || "",
                pmDate: assetMaintenance.firstInspectionDate
                    ? new Date(assetMaintenance.firstInspectionDate).toISOString()
                    : undefined,
                pmInterval: assetMaintenance.Period
                    ? `P${assetMaintenance.Period}Y`
                    : undefined,
                createUpdateAsset: true
            };

            console.log(assetInfo)

            uri +=
                `&settings.AssetInformation=${encodeURIComponent(
                    JSON.stringify(assetInfo)
                )}`;

        }
        console.log("uri", uri)
        setLoading(true);
        handleCancel();
        window.location.href = uri;
    };



    return (
        <Modal
            className="custom-modal"
            open={open}
            closable={false}
            footer={null}
            width={800}
        >
            <Form
                labelWrap
                form={form}
                onFinish={handleFinish}
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
                labelAlign="left"
            >
                <Card
                    title={"Hiệu chuẩn bằng oneQA "}
                    extra={
                        <>
                            <Button className="mr-2" onClick={handleCancel}>
                                <ArrowLeftOutlined /> {t("modal.common.buttons.back")}
                            </Button>
                            <Button
                                type="primary"
                                icon={<CheckCircleOutlined />}
                                htmlType="submit"
                            >
                                {t("modal.common.buttons.approve")}
                            </Button>


                        </>
                    }
                >

                    <Col span={24}>
                        <Form.Item
                            name="Procedures"
                            label={t("ProcedureUID")}
                            rules={[
                                { required: true, message: "Bắt buộc nhập OneQA URL" },
                                {
                                    validator: (_, value) => {
                                        if (!value) return Promise.resolve();
                                        const regex =
                                            /^oneqa:\/\/application\/execute\?procedureId=[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
                                        return regex.test(value)
                                            ? Promise.resolve()
                                            : Promise.reject(
                                                new Error("OneQA URL không đúng format")
                                            );
                                    },
                                },
                            ]}
                        >
                            <Input

                                placeholder={"oneqa://application/execute?procedureId=9a85b9d4-c11d-4435-9dbf-df03ce5f514e"}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={24} >
                        <Form.Item
                            name="createOrUpdateAsset"
                            valuePropName="checked"
                            initialValue={false}
                        >
                            <Checkbox>
                                Tạo / cập nhật tài sản trên OneQA từ CMMS
                            </Checkbox>
                        </Form.Item>
                    </Col>

                </Card>
            </Form>
        </Modal>
    );
}

export default OneQAModal;