import { Button, Card, Checkbox, Col, Form, Input, Modal, Row } from "antd";
import React, { useEffect } from "react";
import Confirm from "../../../components/modal/Confirm";
import * as _unitOfWork from "../../../api";
import { useTranslation } from "react-i18next";
import { CloseCircleOutlined, SaveOutlined } from "@ant-design/icons";

export default function UpdateSpareCategory({
  open,
  handleOk,
  handleCancel,
  spareCategory,
}) {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue(spareCategory);
  }, [spareCategory, form]);

  const onFinish = async () => {
    let payload = {
      ...form.getFieldsValue(),
    };
    let res = await _unitOfWork.spareCategory.update(spareCategory.id, payload);
    if (res) {
      form.resetFields();
      handleOk();
    } else {
      // Giữ nguyên
    }
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
        onFinish={() => onFinish()}
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
      >
        <Card title={t("spareCategory.update.title")}>
          <Row>
            <Col span={24}>
              <Form.Item
                name="spareCategoryName"
                labelAlign="left"
                label={t("spareCategory.form.fields.name")}
                rules={[
                  {
                    required: true,
                    message: t("spareCategory.validation.required_name"),
                  },
                ]}
              >
                <Input
                  placeholder={t("spareCategory.form.placeholders.name")}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item valuePropName="checked" name="isConsumables">
                <Checkbox>
                  {t("spareCategory.form.checkbox.is_consumables")}
                </Checkbox>
              </Form.Item>
            </Col>
            <div className="modal-footer">
              <Button
                key="back"
                className="mr-2"
                onClick={() => {
                  form.resetFields();
                  handleCancel();
                }}
              >
                <CloseCircleOutlined /> {t("common_buttons.cancel")}
              </Button>
              <Button
                key="button"
                type="primary"
                onClick={() =>
                  Confirm(t("spareCategory.messages.confirm_update"), () =>
                    onFinish()
                  )
                }
              >
                <SaveOutlined /> {t("spareCategory.form.buttons.submit_update")}
              </Button>
            </div>
          </Row>
        </Card>
      </Form>
    </Modal>
  );
}
