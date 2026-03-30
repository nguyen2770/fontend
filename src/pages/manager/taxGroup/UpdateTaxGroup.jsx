import React, { use, useEffect } from "react";
import {
  Input,
  Button,
  Form,
  Row,
  Col,
  Card,
  message,
  Space,
  Divider,
  Modal,
  Table,
  Tooltip,
} from "antd";
import { PlusOutlined, DeleteOutlined, ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import * as _unitOfWork from "../../../api";
import { useTranslation } from "react-i18next";

export default function UpdateTaxGroup() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { t } = useTranslation();

  useEffect(() => {
    if (id) {
      fetchGetTaxGroupById();
    }
  }, [id]);

  const fetchGetTaxGroupById = async () => {
    const res = await _unitOfWork.taxGroup.getTaxGroupById({ id });
    if (res) {
      const data = res.asset;
      form.setFieldsValue({
        name: data.name,
        taxes: data.taxes.length
          ? data.taxes.map((t) => ({
            name: t.name,
            percentage: t.percentage,
          }))
          : [{ name: "", percentage: 0 }],
      });
    }
  };

  const onFinish = async (values) => {
    try {
      const payload = {
        taxGroup: {
          id,
          name: values.name,
          taxes: values.taxes,
        },
      };
      const res = await _unitOfWork.taxGroup.updateTaxGroup(payload);
      if (res && res.code === 1) {
        message.success(t("taxGroup.update_success"));
        navigate(-1);
      }
    } catch (err) {
      console.error(t("taxGroup.update_error"), err);
    }
  };


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
          title={t("taxGroup.form.update_title")}
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
                rules={[
                  { required: true, message: t("taxGroup.form.tax_group_name_placeholder") },
                ]}
              >
                <Input maxLength={50} />
              </Form.Item>
            </Col>
            <Col span={24} style={{ textAlign: "end" }}>
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
                          render: (_text, record) => (
                            <Form.Item
                              name={[record.name, "name"]}
                              fieldKey={[record.fieldKey, "name"]}
                              rules={[
                                { required: true, message: t("taxGroup.form.tax_name_placeholder") },
                              ]}
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
                          render: (_text, record) => (
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
          </Row>
        </Card>
      </Form>
    </div>
  );
}
