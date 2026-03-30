import { Button, Card, Col, Form, Input, message, Modal, Row, Select } from "antd";
import React from "react";
import * as _unitOfWork from "../../../../api";
import { useTranslation } from "react-i18next";
import { allowViewAllType, STORAGE_KEY } from "../../../../utils/constant";
import { filterOption } from "../../../../helper/search-select-helper";

export default function CreateDepartment({
    open,
    handleOk,
    handleCancel,
    onRefresh,
}) {
    const { t } = useTranslation();
    const [form] = Form.useForm();
    const companySetting = JSON.parse(
        localStorage.getItem(STORAGE_KEY.COMPANY_SETTING),
    );

    const onFinish = async () => {
        const values = await form.getFieldsValue();
        const response = await _unitOfWork.department.createDepartment(values);
        if (response && response.code === 1) {
            message.success(t("department.create.success_message"));
            handleCancel();
            form.resetFields();
            onRefresh();
        } else {
            message.error(t("department.messages.create_error"));
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
        >
            <Form labelWrap form={form} onFinish={onFinish}>
                <Card title={t("department.create.title")}>
                    <Row>
                        <Col span={24}>
                            <Form.Item
                                name="departmentName"
                                labelAlign="left"
                                rules={[
                                    {
                                        required: true,
                                        message: t("department.validation.required_name"),
                                    },
                                ]}
                            >
                                <Input
                                    placeholder={t(
                                        "department.form.placeholders.department_name"
                                    )}
                                />
                            </Form.Item>
                        </Col>
                        {companySetting?.filterByAccount && (
                            <Col span={24}>
                                <Form.Item
                                    labelAlign="left"
                                    label={t("department.list.table.permission_view_asset")}
                                    name="allowViewAll"
                                >
                                    <Select
                                        showSearch
                                        placeholder={t("department.list.table.permission_view_asset")}
                                        options={(allowViewAllType.Options || []).map((item) => ({
                                            key: item.value,
                                            value: item.value,
                                            label: t(item.label),
                                        }))}
                                        filterOption={filterOption}
                                        defaultValue={allowViewAllType.no}
                                    ></Select>
                                </Form.Item>
                            </Col>
                        )}
                        <div className="modal-footer">
                            <Button key="back" onClick={onCancel}>
                                {t("department.form.buttons.back")}
                            </Button>
                            <Button key="button" type="primary" htmlType="submit">
                                {t("department.form.buttons.submit_create")}
                            </Button>
                        </div>
                    </Row>
                </Card>
            </Form>
        </Modal>
    );
}