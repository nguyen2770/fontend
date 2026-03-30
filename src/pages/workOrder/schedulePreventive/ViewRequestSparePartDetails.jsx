import React, { useEffect } from "react";
import {
  Form,
  Input,
  Radio,
  Drawer,
  Row,
  Col,
  Card,
  Image,
  Empty,
} from "antd";
import { useTranslation } from "react-i18next";
import * as _unitOfWork from "../../../api";
import { priceFormatter } from "../../../helper/price-helper";
import { parseToLabel } from "../../../helper/parse-helper";
import { schedulePreventiveTaskRequestSparePartDetailStatus } from "../../../utils/constant";

export default function ViewRequestSparePartDetails({
  open,
  onClose,
  schedulePreventiveTaskRequestSparepart,
}) {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  useEffect(() => {
    if (open && schedulePreventiveTaskRequestSparepart) {
      const mappedItems =
        schedulePreventiveTaskRequestSparepart?.scheduleePreventiveRequestSparePartDetails?.map(
          (sp) => ({
            spareRequestType: sp.spareRequestType || "spareReplace",
            sparePart: sp.sparePart?.sparePartsName || "",
            qty: sp.qty || 1,
            unitCost: sp.unitCost || 0,
            resourceId: sp.sparePart?.resourceId,
            requestStatus: t(
              parseToLabel(
                schedulePreventiveTaskRequestSparePartDetailStatus.Options,
                sp.requestStatus
              )
            ),
          })
        ) || [];

      form.setFieldsValue({ items: mappedItems });
    } else {
      form.resetFields();
    }
  }, [open, schedulePreventiveTaskRequestSparepart, form, t]);

  return (
    <Drawer
      placement="right"
      closable
      destroyOnClose={false}
      open={open}
      onClose={onClose}
      maskClosable
      width="40%"
      bodyStyle={{
        padding: 0,
        background: "#f5f6fa",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          padding: "70px 8px 70px",
          overflowY: "auto",
          flex: 1,
        }}
      >
        <Form labelWrap form={form} layout="vertical">
          <Form.List name="items">
            {(fields) => (
              <>
                {fields.length === 0 && (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={t("Không có dữ liệu phụ tùng")}
                    style={{ marginTop: 50 }}
                  />
                )}

                {fields.map(({ key, name, fieldKey, ...restField }) => (
                  <Card
                    key={key}
                    bordered
                    style={{
                      marginBottom: 12,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                      borderRadius: 8,
                      background: "#fff",
                    }}
                    title={
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <span>
                          {t("sparePart.form.fields.sparePart")} #{key + 1}
                        </span>
                      </div>
                    }
                  >
                    <Row gutter={16}>
                      {/* Loại yêu cầu */}
                      <Col span={24}>
                        <Form.Item
                          {...restField}
                          name={[name, "spareRequestType"]}
                          label={t("breakdown.sparePartForm.fields.request_type")}
                        >
                          <Radio.Group disabled>
                            <Radio value="spareReplace">
                              {t("breakdown.sparePartForm.options.spareReplace")}
                            </Radio>
                            <Radio value="spareRequest">
                              {t("breakdown.sparePartForm.options.spareRequest")}
                            </Radio>
                          </Radio.Group>
                        </Form.Item>
                      </Col>

                      {/* Trạng thái yêu cầu */}
                      <Col span={24}>
                        <Form.Item
                          {...restField}
                          name={[name, "requestStatus"]}
                          label={t("preventiveSchedule.list.table.request_status")}
                        >
                          <Input disabled />
                        </Form.Item>
                      </Col>

                      {/* Tên phụ tùng */}
                      <Col span={12}>
                        <Form.Item
                          {...restField}
                          name={[name, "sparePart"]}
                          label={t("common.modal.sparepartSelector.search.name_label")}
                        >
                          <Input disabled />
                        </Form.Item>
                      </Col>

                      {/* Ảnh phụ tùng */}
                      <Col span={12}>
                        <Form.Item shouldUpdate noStyle>
                          {() => {
                            const resourceId = form.getFieldValue([
                              "items",
                              name,
                              "resourceId",
                            ]);

                            return (
                              resourceId && (
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    marginBottom: 5,
                                    marginTop: 5,
                                  }}
                                >
                                  <Image
                                    src={_unitOfWork.resource.getImage(
                                      resourceId
                                    )}
                                    alt="Spare part"
                                    width={100}
                                    height={80}
                                    style={{
                                      objectFit: "contain",
                                      borderRadius: 8,
                                    }}
                                    fallback="https://via.placeholder.com/200x200?text=No+Image"
                                  />
                                </div>
                              )
                            );
                          }}
                        </Form.Item>
                      </Col>

                      {/* Số lượng */}
                      <Col span={12}>
                        <Form.Item
                          {...restField}
                          name={[name, "qty"]}
                          label={t("purchase.tableMaterials.qty")}
                        >
                          <Input type="number" min={1} disabled />
                        </Form.Item>
                      </Col>

                      {/* Đơn giá */}
                      <Col span={12}>
                        <Form.Item
                          {...restField}
                          name={[name, "unitCost"]}
                          label={t("requestPurchase.form.fields.unit_price") + " (VND)"}
                        >
                          <Input type="number" min={0} disabled />
                        </Form.Item>
                      </Col>

                      {/* Tổng tiền */}
                      <Col span={24}>
                        <Form.Item shouldUpdate noStyle>
                          {() => {
                            const values =
                              form.getFieldValue(["items", name]) || {};
                            const qty = Number(values.qty) || 0;
                            const unitCost = Number(values.unitCost) || 0;
                            const total = qty * unitCost;

                            return (
                              <div style={{ marginTop: 10 }}>
                                <div style={{ fontSize: 13, color: "#888" }}>
                                  {t("breakdown.spareRequest.modal.table.total_cost") + " (VND)"}
                                </div>
                                <div
                                  style={{
                                    fontSize: 16,
                                    fontWeight: 600,
                                    color: "#23457b",
                                    marginTop: 4,
                                  }}
                                >
                                  {total.toLocaleString("vi-VN")}
                                </div>
                              </div>
                            );
                          }}
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>
                ))}
              </>
            )}
          </Form.List>
        </Form>
      </div>
    </Drawer>
  );
}
