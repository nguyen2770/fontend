import {
    Button,
    Card,
    Col,
    Divider,
    Form,
    Input,
    InputNumber,
    Modal,
    Row,
    Select,
    Space
} from "antd";
import React, { useEffect, useState } from "react";
import * as _unitOfWork from "../../../../../api";
import CreateUom from "./CreateUom";
import { filterOption } from "../../../../../helper/search-select-helper";
import { PlusOutlined } from "@ant-design/icons";
import {
    formatCurrency,
    parseCurrency
} from "../../../../../helper/price-helper";
import { useTranslation } from "react-i18next";

export default function UpdateAssetTypeParamater({
    open,
    handleCancel,
    onRefresh,
    assetType,
    assetTypeParameterChange
}) {
    const { t } = useTranslation();
    const [form] = Form.useForm();
    const [uoms, setUoms] = useState([]);
    const [isOpenCreateuom, setIsOpenCreateUom] = useState(false);
    useEffect(() => {
        if (open && assetTypeParameterChange) {
            form.setFieldsValue({
                ...assetTypeParameterChange,
                uom:
                    assetTypeParameterChange?.uom?.id ||
                    assetTypeParameterChange?.uom?._id
            });
        }
    }, [open, assetTypeParameterChange]);
    useEffect(() => {
        if (open) {
            fetchGetAllUom();
        }
    }, [open]);

    const fetchGetAllUom = async () => {
        let res = await _unitOfWork.uom.getAllUom();
        if (res && res.code === 1) {
            setUoms(res.data);
        }
    };
    const onFinish = async () => {
        const values = await form.getFieldsValue();
        let payload = {
            ...values,
            assetType: assetType?.id
        };
        const res =
            await _unitOfWork.assetTypeParameter.updateAssetTypeParameter(
                assetTypeParameterChange?.id,
                payload
            );
        if (res && res.code === 1) {
            handleCancel();
            form.resetFields();
            onRefresh();
        }
    };
    const onCancel = () => {
        handleCancel();
        form.resetFields();
    };
    const onCancelCreateUom = () => {
        setIsOpenCreateUom(false);
    };
    const onCallbackCreateUom = () => {
        setIsOpenCreateUom(false);
        fetchGetAllUom();
    };
    return (
        <Modal
            open={open}
            onOk={handleCancel}
            closable={false}
            className="custom-modal"
            footer={false}
            destroyOnClose
        >
            <Form labelWrap form={form} onFinish={onFinish} layout="vertical">
                <Card title={t("assetType.parameter.update.title")}>
                    <Row>
                        <Col span={24}>
                            <Form.Item
                                name="name"
                                label={t(
                                    "assetType.parameter.create.fields.name"
                                )}
                                labelAlign="left"
                                rules={[
                                    {
                                        required: true,
                                        message: t(
                                            "assetType.parameter.create.validation.required_name"
                                        )
                                    }
                                ]}
                            >
                                <Input
                                    placeholder={t(
                                        "assetType.parameter.create.fields.name_placeholder"
                                    )}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={15} className="mr-3">
                            <Form.Item
                                name="value"
                                label={t(
                                    "assetType.parameter.create.fields.value"
                                )}
                                labelAlign="left"
                                rules={[
                                    {
                                        required: true,
                                        message: t(
                                            "assetType.parameter.create.validation.required_value"
                                        )
                                    }
                                ]}
                            >
                                <InputNumber
                                    placeholder={t(
                                        "assetType.parameter.create.fields.value_placeholder"
                                    )}
                                    style={{ width: "100%" }}
                                    formatter={formatCurrency}
                                    parser={parseCurrency}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name="uom"
                                label={t(
                                    "assetType.parameter.create.fields.uom"
                                )}
                                labelAlign="left"
                            >
                                <Select
                                    allowClear
                                    showSearch
                                    placeholder={t(
                                        "assetType.parameter.create.fields.uom_placeholder"
                                    )}
                                    options={(uoms || []).map((item, key) => ({
                                        key,
                                        value: item.id,
                                        label: item.uomName
                                    }))}
                                    filterOption={filterOption}
                                    popupRender={(menu) => (
                                        <>
                                            {menu}
                                            <Divider style={{ margin: "8px 0" }} />
                                            <Space style={{ padding: "0 8px 4px" }}>
                                                <Button
                                                    type="text"
                                                    icon={<PlusOutlined />}
                                                    onClick={() => setIsOpenCreateUom(true)}
                                                >
                                                    {t(
                                                        "assetType.parameter.create.fields.add_uom"
                                                    )}
                                                </Button>
                                            </Space>
                                        </>
                                    )}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                name="discription"
                                label={t(
                                    "assetType.parameter.create.fields.description"
                                )}
                                labelAlign="left"
                            >
                                <Input
                                    placeholder={t(
                                        "assetType.parameter.create.fields.description_placeholder"
                                    )}
                                />
                            </Form.Item>
                        </Col>
                        <div className="modal-footer">
                            <Button onClick={onCancel}>
                                {t("assetType.parameter.update.buttons.close")}
                            </Button>
                            <Button type="primary" htmlType="submit">
                                {t("assetType.parameter.update.buttons.update")}
                            </Button>
                        </div>
                    </Row>
                    <CreateUom
                        open={isOpenCreateuom}
                        handleCancel={onCancelCreateUom}
                        handleOk={onCallbackCreateUom}
                    />
                </Card>
            </Form>
        </Modal>
    );
}