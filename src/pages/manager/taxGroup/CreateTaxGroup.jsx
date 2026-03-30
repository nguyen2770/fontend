import React, { use } from "react";
import {
  Input,
  Button,
  Form,
  Row,
  Col,
  Card,
  message,
  Table,
  Tooltip,
  Space,
  Modal,
} from "antd";
import { PlusOutlined, DeleteOutlined, ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons";
import * as _unitOfWork from "../../../api";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function CreateTaxGroup() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const onFinish = async (values) => {
    try {
      // values sẽ có { name: string, taxes: [{name, percentage}, ...] }
      const res = await _unitOfWork.taxGroup.createTaxGroup(values);
      if (res && res.code === 1) {
        message.success(t("taxGroup.create_success"));
        navigate(-1);
      }
    } catch (err) {
      console.error(t("taxGroup.create_error"), err);
    }
  };

  // const onCancel = () => {
  //   Modal.confirm({
  //     title: "Bạn có chắc chắn muốn huỷ?",
  //     content: "Các thay đổi hiện tại sẽ không được lưu.",
  //     onOk: () => navigate(-1),
  //   });
  // };

  return (
    <div className="content-manager">
      <Form
labelWrap
        form={form}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        onFinish={onFinish}
        initialValues={{ taxes: [{ name: "", percentage: 0 }] }}
      >
        <Card
          title={t("taxGroup.title_create")}
          extra={
            <>
              <Button className="mr-2" onClick={() => navigate(-1)}>
                <ArrowLeftOutlined />
                {t("taxGroup.come_back_button")}
              </Button>
              <Button type="primary" htmlType="submit">
                <SaveOutlined />
                {t("taxGroup.save_button")}
              </Button>
            </>
          }
        >
          <Row>
            <Col span={12}>
              <Form.Item
                labelAlign="left"
                label={t("taxGroup.form.tax_group_name")}
                name="name"
                rules={[{ required: true, message: t("taxGroup.form.tax_group_name_placeholder") }]}
              >
                <Input maxLength={50} />
              </Form.Item>
            </Col>
            <Col span={24} className="mb-4" style={{ textAlign: "end" }}>
              <Form.List name="taxes">
                {(fields, { add, remove }) => (
                  <>
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={() => add()}
                      className="mb-2"
                    >
                      {t("taxGroup.form.add_tax_button")}
                    </Button>
                    <Table
                      dataSource={fields}
                      pagination={false}
                      rowKey={(field) => field.key}
                      bordered
                      columns={[
                        {
                          title: t("taxGroup.table.index"),
                          key: "index",
                          width: 60,
                          align: "center",
                          render: (_text, _record, index) => index + 1,
                        },
                        {
                          title: t("taxGroup.table.tax_name"),
                          dataIndex: "name",
                          key: "name",
                          render: (_text, record, index) => (
                            <Form.Item
                              name={[record.name, "name"]}
                              fieldKey={[record.fieldKey, "name"]}
                              rules={[{ required: true, message: t("taxGroup.form.tax_name_placeholder") }]}
                              noStyle
                            >
                              <Input placeholder={t("taxGroup.form.tax_name_placeholder")} />
                            </Form.Item>
                          ),
                        },
                        {
                          title: t("taxGroup.table.tax_rate"),
                          dataIndex: "percentage",
                          key: "percentage",
                          render: (_text, record, index) => (
                            <Form.Item
                              name={[record.name, "percentage"]}
                              fieldKey={[record.fieldKey, "percentage"]}
                              rules={[
                                { required: true, message: t("taxGroup.form.tax_rate_placeholder") },
                                {
                                  type: "number",
                                  min: 0,
                                  max: 100,
                                  message: t("taxGroup.form.the_scale_must_be_from_0_to_100"),
                                  transform: (value) => Number(value),
                                },
                              ]}
                              noStyle
                            >
                              <Input
                                type="number"
                                min={0}
                                max={100}
                                placeholder={t("taxGroup.form.tax_rate_placeholder")}
                              />
                            </Form.Item>
                          ),
                        },
                        {
                           title: t("taxGroup.table.actions"),
                          key: "action",
                          width: 100,
                          align: "center",
                          render: (_text, record, index) => (
                            <Tooltip title={t("taxGroup.table.delete")}>
                              <Button
                                type="primary"
                                danger
                                icon={<DeleteOutlined />}
                                onClick={() => remove(index)}
                                disabled={fields.length === 1}
                              />
                            </Tooltip>
                          ),
                        },
                      ]}
                    />
                  </>
                )}
              </Form.List>
            </Col>
            {/* <Col span={24}>

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Button onClick={() => { navigate(-1) }} style={{ marginRight: 8 }}>
                  Thoát
                </Button>
                <Button type="primary" htmlType="submit">
                  Thêm mới
                </Button>
              </div>
            </Col> */}
          </Row>
        </Card>
      </Form>
    </div>
  );
}
