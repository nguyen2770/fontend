import { ArrowLeftOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { Button, Card, Col, Form, Input, Modal } from "antd";
import { useTranslation } from "react-i18next";
import AttachmentModel from "./attachmentModel/AttachmentModel";
import { useState } from "react";
import * as _unitOfWork from "../../api";


function CancelReason({ open, close, onFinish, type }) {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);
    const { t } = useTranslation();

    const handleClose = async () => {
        form.resetFields();
        close();
    }

    const handleFinish = async () => {

        const newSupportDocuments = [];
        if (fileList) {
            for (let i = 0; i < fileList.length; i++) {
                const file = fileList[i];
                const resUpload = await _unitOfWork.resource.uploadImage({
                    file: file?.originFileObj,
                });
                if (resUpload && resUpload.code === 1) {
                    newSupportDocuments.push(
                        resUpload.resourceId,
                    );
                }
            }
        }
        onFinish(form.getFieldValue("cancelReason"), newSupportDocuments);
        handleClose();
    }

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
                    title={
                        type === "CANCEL"
                            ? "Huỷ tài sản"
                            : type === "RETURN"
                                ? "Trả tài sản"
                                : ""
                    }
                    extra={
                        <>
                            <Button className="mr-2" onClick={handleClose}>
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
                            name="cancelReason"
                            label={t("Lý do")}
                            rules={[
                                { required: true, message: "Không được để trống" }
                            ]}
                        >
                            <Input.TextArea
                                placeholder="Nhập lý do"
                            >

                            </Input.TextArea>

                        </Form.Item>
                    </Col>

                    <AttachmentModel
                        value={fileList}
                        onChange={setFileList}
                        notSize={true}
                    >

                    </AttachmentModel>
                </Card>


            </Form>
        </Modal>
    );
}

export default CancelReason;