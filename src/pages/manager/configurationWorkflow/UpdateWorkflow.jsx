import {
    Button,
    Card,
    Checkbox,
    Col,
    Form,
    Input,
    Modal,
    Row,
    Select,
} from "antd";
import React, { useEffect } from "react";
import * as _unitOfWork from "../../../api";
import {
    LeftCircleOutlined,
    PlusCircleOutlined,
} from "@ant-design/icons";
import ShowSuccess from "../../../components/modal/result/successNotification";
import ShowError from "../../../components/modal/result/errorNotification";
import { useTranslation } from "react-i18next";

export default function UpdateWorkflow({
    open,
    handleOk,
    handleCancel,
    onRefresh,
    workflow,
    roles = [],
}) {
    const [form] = Form.useForm();
    const {t} = useTranslation();

    useEffect(() => {
        if (workflow) {
            fetchWorkflow();
        }
    }, [workflow]);

    const fetchWorkflow = async () => {
        let res = await _unitOfWork.workflow.getWorkflowById(workflow?.id);
        if (res && res.code === 1) {
            form.setFieldsValue({
                ...res.data.workflow,
                workflowRoles: res.data.workflowRoles?.map((item) => item.role),
            });
        }
    }
    const onFinish = async () => {
        let values = form.getFieldsValue();
        let payload = {
            workflow: { ...values },
            workflowRoles: values.workflowRoles
        }
        let res = await _unitOfWork.workflow.updateWorkflow(workflow.id, payload);
        if (res && res.code === 1) {
            ShowSuccess(t("configuration_process.update_success"));
            handleOk();
        }
    };
    const onCancel = () => {
        handleCancel();
        form.resetFields();
    };


    return (
        <Modal
            open={open}
            onOk={handleOk}
            closable={false}
            className="custom-modal"
            footer={false}
            width={"40%"}
        >
            <Form
labelWrap
                form={form}
                onFinish={onFinish}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
            >
                <Card title={t("configuration_process.update_title")}>
                    <Row gutter={32}>
                        <Col span={24}>
                            <Form.Item
                                id=""
                                label={t("configuration_process.form.process_name")}
                                labelAlign="left"
                            >
                                <span>{workflow?.name}</span>
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                id=""
                                label={t("configuration_process.form.status")}
                                name="status"
                                labelAlign="left"
                                valuePropName="checked"
                            >
                                <Checkbox></Checkbox>
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                id=""
                                label={t("configuration_process.form.role")}
                                name="workflowRoles"
                                labelAlign="left"
                            >
                                <Select
                                    allowClear
                                    placeholder={t("configuration_process.form.choose_role")}
                                    showSearch
                                    options={roles?.map((item) => ({
                                        value: item.id,
                                        label: item.name,
                                    }))}
                                    mode="tags"
                                ></Select>
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                id=""
                                label={t("configuration_process.form.description")}
                                name="description"
                                labelAlign="left"
                            >
                                <Input.TextArea
                                    placeholder={t("configuration_process.form.description_placeholder")}

                                ></Input.TextArea>
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                id=""
                                label={t("configuration_process.form.for_example")}
                                name="example"
                                labelAlign="left"
                            >
                                <Input.TextArea
                                    placeholder={t("configuration_process.form.for_example_required")}

                                ></Input.TextArea>
                            </Form.Item>
                        </Col>
                        <div className="modal-footer">
                            <Button key="back" onClick={onCancel}>
                                <LeftCircleOutlined />
                                {t("configuration_process.form.come_back_button")}
                            </Button>
                            <Button key="button" type="primary" htmlType="submit">
                                <PlusCircleOutlined />
                               {t("configuration_process.form.update")}
                            </Button>
                        </div>
                    </Row>
                </Card>
            </Form>
        </Modal>
    );
}
