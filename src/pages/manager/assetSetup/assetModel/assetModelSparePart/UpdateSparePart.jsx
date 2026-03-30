import {
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select
} from "antd";
import React, { useEffect } from "react";
import * as _unitOfWork from "../../../../../api";
import ShowSuccess from "../../../../../components/modal/result/successNotification";
import ShowError from "../../../../../components/modal/result/errorNotification";
import { PlusCircleFilled } from "@ant-design/icons";
import { formatCurrency, parseCurrency } from "../../../../../helper/price-helper";
import { useTranslation } from "react-i18next";
import { filterOption } from "../../../../../helper/search-select-helper";

export default function UpdateSparePart({
  open,
  handleOk,
  handleCancel,
  id,
  onRefresh,
  spareParts,
  assetModelId,
  assetModelSparePart
}) {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  useEffect(() => {
    if (assetModelSparePart) {
      form.setFieldsValue({
        sparePartId: assetModelSparePart?.sparePart?.id,
        code: assetModelSparePart?.sparePart?.id,
        manufacturer:
          assetModelSparePart?.sparePart?.manufacturer?.manufacturerName,
        quantity: assetModelSparePart?.quantity
      });
    }
  }, [open, assetModelSparePart]);

  const handleSelectSparePart = (value) => {
    const part = spareParts.find((p) => p.id === value);
    form.setFieldsValue({
      sparePartId: part?.id,
      code: part?.id,
      manufacturer: part?.manufacturer?.manufacturerName
    });
  };

  const handleSelectCode = (value) => {
    const part = spareParts.find((p) => p.id === value);
    form.setFieldsValue({
      sparePartId: part?.id,
      code: part?.id,
      manufacturer: part?.manufacturer?.manufacturerName
    });
  };

  const onFinish = async () => {
    const res =
      await _unitOfWork.assetModelSparePart.updateAssetModelSparePart(
        {
          data: {
            id,
            ...form.getFieldsValue(),
            assetModelId
          }
        }
      );
    if (res?.code === 1) {
      ShowSuccess(
        "topRight",
        t("common.notifications"),
        t("assetModel.common.messages.update_success")
      );
      onRefresh();
      handleCancel();
      form.resetFields();
    } else {
      ShowError(
        "topRight",
        t("common.notifications"),
        t("assetModel.common.messages.update_error")
      );
    }
  };

  const onCancel = () => {
    handleCancel();
    form.resetFields();
  };

  return (
    <Modal
      open={open}
      closable={false}
      footer={false}
      className="custom-modal"
      width={"70%"}
      destroyOnClose
    >
      <Form
labelWrap
        form={form}
        onFinish={onFinish}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
      >
        <Card title={t("assetModel.spare_part.update_title")}>
          <Row gutter={32}>
            <Col span={12}>
              <Form.Item
                label={t("assetModel.spare_part.fields.spare_part_name")}
                name="sparePartId"
                labelAlign="left"
                rules={[
                  {
                    required: true,
                    message: t(
                      "assetModel.spare_part.validation.required_spare_part"
                    )
                  }
                ]}
              >
                <Select
                  allowClear
                  placeholder={t(
                    "assetModel.spare_part.fields.spare_part_name_placeholder"
                  )}
                  options={spareParts.map((item) => ({
                    value: item.id,
                    label: item.sparePartsName
                  }))}
                  onChange={handleSelectSparePart}
                                    filterOption={filterOption}
                                    showSearch={true}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t("assetModel.spare_part.fields.code")}
                name="code"
                labelAlign="left"
                rules={[
                  {
                    required: true,
                    message: t(
                      "assetModel.spare_part.validation.required_spare_part"
                    )
                  }
                ]}
              >
                <Select
                  allowClear
                  placeholder={t(
                    "assetModel.spare_part.fields.code_placeholder"
                  )}
                  options={spareParts.map((item) => ({
                    value: item.id,
                    label: item.code
                  }))}
                  onChange={handleSelectCode}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t("assetModel.spare_part.fields.manufacturer")}
                name="manufacturer"
                labelAlign="left"
              >
                <Input
                  disabled
                  placeholder={t(
                    "assetModel.spare_part.fields.manufacturer_placeholder"
                  )}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t("assetModel.spare_part.fields.quantity")}
                name="quantity"
                labelAlign="left"
              >
                <InputNumber
                  placeholder={t(
                    "assetModel.spare_part.fields.quantity_placeholder"
                  )}
                  style={{ width: "100%" }}
                  formatter={formatCurrency}
                  parser={parseCurrency}
                />
              </Form.Item>
            </Col>
            <div className="modal-footer">
              <Button onClick={onCancel}>
                {t("assetModel.common.buttons.close")}
              </Button>
              <Button type="primary" htmlType="submit">
                <PlusCircleFilled />{" "}
                {t("assetModel.common.buttons.update")}
              </Button>
            </div>
          </Row>
        </Card>
      </Form>
    </Modal>
  );
}