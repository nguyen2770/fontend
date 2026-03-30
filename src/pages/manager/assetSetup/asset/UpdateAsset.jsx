import { Button, Card, Col, Form, Input, Modal, Row } from "antd";
import { useEffect, useState } from "react";
import * as _unitOfWork from "../../../../api";
import { CloseCircleOutlined, SaveOutlined } from "@ant-design/icons";
import ShowSuccess from "../../../../components/modal/result/successNotification";
import ShowError from "../../../../components/modal/result/errorNotification";
import { useTranslation } from "react-i18next";
import useAuth from "../../../../contexts/authContext";
import { createNewUsingAFormulaType } from "../../../../utils/constant";

export default function UpdateAsset({
  open,
  handleOk,
  handleCancel,
  id,
  onRefresh,
}) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [taskItems, setTaskItems] = useState([
    { key: 1, name: "", value: "", content: "" },
  ]);
  const { companySetting } = useAuth();
  useEffect(() => {
    if (open && id) {
      fetchGetAssetById();
    }
  }, [open, id]);

  const onCancel = () => {
    handleCancel();
    form.resetFields();
    setTaskItems([]);
  };

  const fetchGetAssetById = async () => {
    const res = await _unitOfWork.asset.getAssetById({ id });
    if (res) {
      form.setFieldsValue({ ...res });
      setTaskItems(res?.assetParameters);
    }
  };

  const onFinish = async () => {
    const res = await _unitOfWork.asset.updateAsset({
      id,
      asset: {
        ...form.getFieldsValue(),
      },
      assetParameters: taskItems,
    });
    if (res && res.code === 1) {
      onRefresh();
      handleCancel();
      form.resetFields();
      ShowSuccess(
        "topRight",
        t("asset.notifications.title"),
        t("asset.notifications.update_success"),
      );
    } else {
      ShowError(
        "topRight",
        t("asset.notifications.title"),
        t("asset.notifications.update_error"),
      );
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
      destroyOnClose
    >
      <Form
        labelWrap
        form={form}
        onFinish={onFinish}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
      >
        <Card title={t("asset.form.update_title")}>
          <Row gutter={32}>
            <Col span={24}>
              <Form.Item
                name="assetName"
                label={t("asset.form.fields.name")}
                labelAlign="left"
                rules={[
                  {
                    required: true,
                    message: t("asset.form.validation.required_name"),
                  },
                ]}
              >
                <Input placeholder={t("asset.form.fields.name_placeholder")} />
              </Form.Item>
            </Col>
            {companySetting?.createNewUsingAFormula &&
              companySetting?.autoGenerateAssetNumber &&
              (companySetting.createNewUsingAFormula ===
                createNewUsingAFormulaType.healthInsurance ||
                companySetting.createNewUsingAFormula ===
                  createNewUsingAFormulaType.healthInsuranceDecree3176) && (
                <Col span={24}>
                  <Form.Item
                    name="symbol"
                    label={t("asset.symbol")}
                    labelAlign="left"
                    rules={
                      companySetting?.autoGenerateAssetNumber
                        ? [
                            {
                              required: true,
                              message: t("asset.please_enter_the_symbol"),
                            },
                          ]
                        : []
                    }
                  >
                    <Input placeholder={t("asset.enter_symbol")} />
                  </Form.Item>
                </Col>
              )}
            <div className="modal-footer">
              <Button onClick={onCancel}>
                <CloseCircleOutlined />
                {t("asset.buttons.close")}
              </Button>
              <Button type="primary" htmlType="submit">
                <SaveOutlined />
                {t("asset.buttons.update")}
              </Button>
            </div>
          </Row>
        </Card>
      </Form>
    </Modal>
  );
}
