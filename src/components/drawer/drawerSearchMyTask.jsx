import { RedoOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Col, DatePicker, Divider, Drawer, Form, Row, Select, Space } from "antd";
import React, { forwardRef, useEffect, useImperativeHandle } from "react"
import { statusMyTakMap, FORMAT_DATE, priorityType, schedulePreventiveStatus, schedulePreventiveTaskAssignUserStatus } from "../../utils/constant";
import { useTranslation } from "react-i18next";
import { filterOption } from "../../helper/search-select-helper";


const DrawerSearchMyTask = forwardRef(({ isOpen, onCallBack, onClose }, ref) => {
    const [form] = Form.useForm();
    const { t } = useTranslation();

    const handleFinish = async () => {
        const value = form.getFieldsValue();
        onCallBack({
            ...value,
        });
        onClose();
    }
    const handleClose = () => {
        const value = form.getFieldsValue();
        value.isClose = true;
        onCallBack(value);
        onClose();
    }

    const onReset = () => form.resetFields();
    useImperativeHandle(ref, () => ({
        resetForm: () => {
            onReset();
        }
    }));

    return (
        <Drawer
            title={t("common_buttons.advanced_search")}
            width={"40%"}
            open={isOpen}
            onClose={handleClose}
            extra={
                <Space>
                    <Button
                        type="primary"
                        htmlType="submit"
                        icon={<SearchOutlined />}
                        onClick={handleFinish}
                    >
                        {t("myTask.myTask.buttons.search")}
                    </Button>

                    <Button onClick={onReset} icon={<RedoOutlined />}>
                        {t("myTask.myTask.buttons.reset")}
                    </Button>
                </Space>
            }
        >
            <Form labelWrap form={form} layout="vertical" onFinish={onCallBack}>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label={t("myTask.myTask.search.status")}
                            name="schedulePreventiveTaskAssignUserStatus"
                        >
                            <Select
                                showSearch
                                allowClear
                                placeholder={t("myTask.myTask.search.status")}
                                options={(
                                    schedulePreventiveTaskAssignUserStatus.Options || []
                                ).map((item) => ({
                                    value: item.value,
                                    label: t(item.label),
                                }))}
                                filterOption={filterOption}
                            />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            label={t("myTask.myTask.search.priority")}
                            name="importance"
                        >
                            <Select
                                showSearch
                                allowClear
                                placeholder={t("myTask.myTask.search.priority")}
                                options={(priorityType.Option || []).map((item) => ({
                                    value: item.value,
                                    label: t(item.label),
                                }))}
                                filterOption={filterOption}
                            />
                        </Form.Item>
                    </Col>
                    <Divider > {t("myTask.myTask.table.start_date")}</Divider>
                    <Col span={12}>
                        <Form.Item
                            name="startDate"
                            label={t("myTask.myTask.search.start_date_from")}
                        >
                            <DatePicker
                                placeholder={t("myTask.myTask.search.start_date_from")}
                                format={FORMAT_DATE}
                                style={{ width: "100%" }}
                                allowClear
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="endDate"
                            label={t("myTask.myTask.search.end_date_to")}
                        >
                            <DatePicker
                                placeholder={t("myTask.myTask.search.end_date_to")}
                                format={FORMAT_DATE}
                                style={{ width: "100%" }}
                                allowClear
                            />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Drawer>
    );
});

export default React.memo(DrawerSearchMyTask)