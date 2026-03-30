import {
  Button,
  Card,
  Checkbox,
  Col,
  Form,
  Input,
  Modal,
  Radio,
  Row,
} from "antd";
import * as _unitOfWork from "../../../api";
import { PlusCircleFilled } from "@ant-design/icons";
import ShowSuccess from "../../../components/modal/result/successNotification";
import { useTranslation } from "react-i18next";
export default function CreateContractType({
  open,
  handleOk,
  handleCancel,
  onRefresh,
}) {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const onFinish = async () => {
    const values = await form.getFieldsValue();
    const response = await _unitOfWork.contractType.createContractType({
      ...values,
    });
    if (response && response.code === 1) {
      ShowSuccess("topRight", t("contractCompliance.common.notify_title"), t("contractCompliance.common.messages.create_success_contract"));
      handleCancel();
      form.resetFields();
      onRefresh();
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
      width={"80%"}
    >
      <Form labelWrap form={form} onFinish={onFinish}>
        <Card title={t("contractCompliance.contractType.create.title")}>
          <Row gutter={32}>
            <Col span={12}>
              <Form.Item
                id=""
                name="contractTypeName"
                label={t("contractCompliance.common.labels.contract_type_name")}
                labelAlign="left"
                rules={[
                  {
                    required: true,
                    message: t("contractCompliance.common.validations.contract_type_name_required"),
                  },
                ]}
              >
                <Input placeholder={t("contractCompliance.common.placeholders.contract_type_name")} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t("contractCompliance.common.labels.contract_type")}
                name="contractType"
                labelAlign="left"
                rules={[
                  {
                    required: true,
                    message: t("contractCompliance.common.validations.contract_type_required"),
                  },
                ]}
              >
                <Radio.Group>
                  <Radio value={1}>{t("contractCompliance.common.radios.service_engineer")}</Radio>
                  <Radio value={2}>{t("contractCompliance.common.radios.service_contractor")}</Radio>
                  <Radio value={3}>{t("contractCompliance.common.radios.customer")}</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item
                id=""
                name="expiryreneweddate"
                labelAlign="left"
                label={t("contractCompliance.common.labels.expiryreneweddate")}
                valuePropName="checked"
              >
                <Checkbox></Checkbox>
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item
                id=""
                name="mandatory"
                labelAlign="left"
                label={t("contractCompliance.common.labels.mandatory")}
                valuePropName="checked"
              >
                <Checkbox></Checkbox>
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item
                id=""
                name="verification"
                labelAlign="left"
                label={t("contractCompliance.common.labels.verification")}
                valuePropName="checked"
              >
                <Checkbox></Checkbox>
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item
                id=""
                name="stop_service"
                labelAlign="left"
                label={t("contractCompliance.common.labels.stop_service")}
                valuePropName="checked"
              >
                <Checkbox></Checkbox>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item
                id=""
                name="insurance"
                labelAlign="left"
                label={t("contractCompliance.common.labels.insurance")}
                valuePropName="checked"
              >
                <Checkbox></Checkbox>
              </Form.Item>
            </Col>
            <div className="modal-footer">
              <Button key="back" onClick={onCancel}>
                {t("contractCompliance.common.buttons.cancel")}
              </Button>
              <Button key="button" type="primary" htmlType="submit">
                <PlusCircleFilled />
                {t("contractCompliance.common.buttons.create")}
              </Button>
            </div>
          </Row>
        </Card>
      </Form>
    </Modal>
  );
}