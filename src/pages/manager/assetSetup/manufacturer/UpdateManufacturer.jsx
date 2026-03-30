import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Space,
} from "antd";
import React, { useEffect, useState } from "react";
import * as _unitOfWork from "../../../../api";
import {
  CloseCircleOutlined,
  PlusOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";

export default function UpdateManufacturer({
  open,
  handleOk,
  handleCancel,
  id,
  onRefresh,
}) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [origin, setOrigin] = useState([]);
  const [newOrigin, setNewOrigin] = useState("");

  useEffect(() => {
    if (open && id) {
      fetchGetManufacturerById();
      fetchOrigin();
    }
  }, [open, id]);

  const fetchOrigin = async () => {
    const res = await _unitOfWork.origin.getAllOrigin();
    if (res?.data) {
      const options = res.data.map((item) => ({
        label: item.originName,
        value: item.id,
      }));
      setOrigin(options);
    }
  };

  const addOrigin = async (data) => {
    if (!data?.trim()) return;
    const res = await _unitOfWork.origin.createOrigin({ originName: data });
    if (res.code === 1) {
      fetchOrigin();
      setNewOrigin("");
    }
  };

  const fetchGetManufacturerById = async () => {
    const res = await _unitOfWork.manufacturer.getManufacturerById({
      id: id,
    });
    if (res) {
      form.setFieldsValue({ ...res?.manufacturer, origin: res.manufacturer?.origin?.id });
    }
  };

  const onFinish = async () => {
    const res = await _unitOfWork.manufacturer.updateManufacturer({
      manufacturer: {
        id: id,
        ...form.getFieldsValue(),
      },
    });
    if (res && res.code === 1) {
      onRefresh();
      handleCancel();
      form.resetFields();
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
      destroyOnClose
      width={"40%"}
    >
      <Form
labelWrap
        form={form}
        onFinish={onFinish}
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
      >
        <Card title={t("manufacturer.form.update_title")}>
          <Row>
            <Col span={24}>
              <Form.Item
                name="manufacturerName"
                label={t("manufacturer.form.fields.name")}
                labelAlign="left"
                rules={[
                  {
                    required: true,
                    message: t("manufacturer.form.validation.required_name"),
                  },
                ]}
              >
                <Input
                  placeholder={t("manufacturer.form.fields.name_placeholder")}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="origin"
                label={t("manufacturer.form.fields.origin")}
                labelAlign="left"
                rules={[
                  {
                    required: true,
                    message: t("manufacturer.form.validation.required_origin"),
                  },
                ]}
              >
                <Select
                  placeholder={t("manufacturer.form.fields.origin_placeholder")}
                  options={origin}
                  showSearch
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  dropdownRender={(menu) => (
                    <div>
                      {menu}
                      <div style={{ padding: 8 }}>
                        <Space>
                          <Input
                            maxLength={250}
                            value={newOrigin}
                            onChange={(e) => setNewOrigin(e.target.value)}
                            placeholder={t(
                              "manufacturer.form.fields.add_origin_placeholder"
                            )}
                          />
                          <Button
                            icon={<PlusOutlined />}
                            onClick={() => addOrigin(newOrigin)}
                          />
                          <div>{`${newOrigin.length}/250`}</div>
                        </Space>
                      </div>
                    </div>
                  )}
                />
              </Form.Item>
            </Col>
            <div className="modal-footer">
              <Button onClick={onCancel}>
                <CloseCircleOutlined />
                {t("common_buttons.cancel")}
              </Button>
              <Button type="primary" htmlType="submit">
                <SaveOutlined /> {t("manufacturer.buttons.update")}
              </Button>
            </div>
          </Row>
        </Card>
      </Form>
    </Modal>
  );
}
