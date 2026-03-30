import {
  Modal,
  Row,
  Col,
  Button,
  Input,
  Card,
  Rate,
  Form,
  Divider,
  message,
  Image,
  Checkbox,
} from "antd";
import * as _unitOfWork from "../../../api";
import { useEffect, useState } from "react";
import React from "react";
import { parseDateHH } from "../../../helper/date-helper";
import { assetType } from "../../../utils/constant";
import BreakdownAttachmentClose from "./BreakdownAttachmentClose";
import { useTranslation } from "react-i18next";
import { CloseCircleOutlined, SaveOutlined } from "@ant-design/icons";
export default function ComfirmCloseBreakdown({
  open,
  onCancel,
  breakdown,
  onRefresh,
}) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [breakdownAssignUser, setBreakdownAssignUser] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [saveSolutionBank, setSaveSolutionBank] = useState({});
  useEffect(() => {
    if (open && breakdown) {
      form.resetFields();
      fetchGetBreakdowUserByBreakdownEndWCA();
      setSaveSolutionBank({});
    }
  }, [open]);

  const fetchGetBreakdowUserByBreakdownEndWCA = async () => {
    let res =
      await _unitOfWork.breakdownAssignUser.getBreakdowUserByBreakdownEndWCA({
        breakdown: breakdown.id,
      });
    if (res && res.code === 1) {
      setBreakdownAssignUser(res.data);
    }
  };
  const handleSubmit = async (values) => {
    if (Object.values(saveSolutionBank).some((val) => val === true)) {
      if (values.repairs) {
        for (const [id, repair] of Object.entries(values.repairs)) {
          if (!repair.problem || !repair.rootCause || !repair.solution) {
            message.error(t("breakdown.close.fields.plase_data"));
            return;
          }
        }
      }
    }
    const newSupportDocuments = [];
    if (fileList) {
      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        const resUpload = await _unitOfWork.resource.uploadImage({
          file: file?.originFileObj,
        });
        if (resUpload && resUpload.code === 1) {
          newSupportDocuments.push({
            resource: resUpload.resourceId,
            position: file.position,
            breakdown: breakdown.id,
          });
        }
      }
    }
    const repairs = Object.entries(values.repairs || {}).map(([id, val]) => ({
      id,
      ...val,
    }));
    const payload = {
      ...values,
      repairs,
      breakdown: breakdown.id,
      listAttachment: newSupportDocuments,
      saveSolutionBank,
    };
    let res = await _unitOfWork.breakdown.comfirmCloseBreakdown(payload);
    if (res && res.code === 1) {
      onRefresh();
      onCancel();
      message.success(t("breakdown.close.messages.close_success"));
    }
  };
  const onReset = () => {
    form.resetFields();
    onCancel();
  };
  const onChange = (e, repairId) => {
    setSaveSolutionBank((prev) => ({
      ...prev,
      [repairId]: e.target.checked,
    }));
  };

  return (
    <Modal
      open={open}
      onCancel={onReset}
      width="80%"
      footer={false}
      closable={false}
      className="custom-modal"
    >
      <Card title={t("breakdown.close.title")}>
        <div style={{ padding: 24 }}>
          <Row gutter={[16, 16]}>
            {[
              {
                label: t("breakdown.close.fields.code"),
                value: breakdown?.code,
              },
              {
                label: t("breakdown.close.fields.opened_by"),
                value: breakdown?.createdBy?.fullName || "--",
              },
              {
                label: t("breakdown.close.fields.manufacturer"),
                value: breakdown?.assetMaintenance?.manufacturerName || "--",
              },
              {
                label: t("breakdown.close.fields.supplier"),
                value: breakdown?.assetMaintenance?.supplierName || "--",
              },
              {
                label: t("breakdown.close.fields.serial"),
                value: breakdown?.assetMaintenance?.serial || "--",
              },
              {
                label: t("breakdown.close.fields.opened_date"),
                value: breakdown?.createdAt
                  ? parseDateHH(breakdown?.createdAt)
                  : "--",
              },
              {
                label: t("breakdown.close.fields.category"),
                value: breakdown?.assetMaintenance?.categoryName || "--",
              },
              {
                label: t("breakdown.close.fields.asset_name"),
                value: breakdown?.assetMaintenance?.assetName || "--",
              },
              {
                label: t("breakdown.close.fields.deadline"),
                value: breakdown?.incidentDeadline
                  ? parseDateHH(breakdown?.incidentDeadline)
                  : "--",
              },
              {
                label: t("breakdown.close.fields.asset_style"),
                value: t(
                  assetType.Options.find(
                    (item) =>
                      item.value === breakdown?.assetMaintenance?.assetStyle,
                  )?.label || "--",
                ),
              },
              {
                label: t("breakdown.close.fields.customer"),
                value: breakdown?.assetMaintenance?.customerName || "--",
              },
            ].map((item, index) => (
              <Col span={8} key={index}>
                <div style={{ marginBottom: 8 }}>
                  <b>{item.label}:</b>
                  <br />
                  <div
                    style={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: "100%",
                    }}
                    title={item.value}
                  >
                    {item.value}
                  </div>
                </div>
              </Col>
            ))}
          </Row>
          <Form
            labelWrap
            form={form}
            layout="vertical"
            style={{ marginTop: 32 }}
            onFinish={handleSubmit}
          >
            <Card
              style={{
                marginTop: 24,
                borderRadius: 8,
                boxShadow: "0 2px 8px #f0f1f2",
              }}
            >
              <Row style={{ marginBottom: 16 }}>
                <Col span={24}>
                  <div style={{ color: "#3f51b5", marginBottom: 4 }}>
                    {t("breakdown.close.fields.comment")}
                  </div>
                  <Form.Item name="comment">
                    <Input.TextArea
                      rows={2}
                      placeholder={t("breakdown.close.fields.comment")}
                    />
                  </Form.Item>
                </Col>
              </Row>
              {breakdownAssignUser.map((item, idx) => (
                <React.Fragment key={item.id || idx}>
                  <div
                    style={{
                      borderRadius: 6,
                      padding: 10,
                      marginBottom: 10,
                      border: "1px solid #e0e0e0",
                    }}
                  >
                    <Card style={{ background: "#f5f7fa" }}>
                      <Row gutter={16} align="middle">
                        <Col span={4}>
                          <div style={{ color: "#888" }}>
                            {t("breakdown.close.fields.technician")}
                          </div>
                          <div style={{ fontWeight: 500, fontSize: 16 }}>
                            {item?.user?.fullName || ""}
                          </div>
                        </Col>
                        {Array.isArray(item.repairs) &&
                        item.repairs.length > 0 ? (
                          item.repairs.map((repair, rIdx) => (
                            <React.Fragment key={repair.id || rIdx}>
                              <Row gutter={[12, 12]} className="repair-item">
                                {/* HÀNG 1 */}
                                <Col span={8}>
                                  <Form.Item
                                    label={t("breakdown.close.fields.problem")}
                                    name={["repairs", repair.id, "problem"]}
                                    initialValue={repair.problem}
                                  >
                                    <Input />
                                  </Form.Item>
                                </Col>

                                <Col span={8}>
                                  <Form.Item
                                    label={t(
                                      "breakdown.close.fields.root_cause",
                                    )}
                                    name={["repairs", repair.id, "rootCause"]}
                                    initialValue={repair.rootCause}
                                  >
                                    <Input />
                                  </Form.Item>
                                </Col>

                                <Col span={8}>
                                  <Form.Item
                                    label={t("breakdown.close.fields.solution")}
                                    name={["repairs", repair.id, "solution"]}
                                    initialValue={repair.solution}
                                  >
                                    <Input />
                                  </Form.Item>
                                </Col>

                                {/* HÀNG 2 */}
                                <Col span={8}>
                                  <Form.Item
                                    label={t(
                                      "breakdown.close.fields.repair_comment",
                                    )}
                                    name={["repairs", repair.id, "comment"]}
                                    initialValue={repair.comment}
                                  >
                                    <Input />
                                  </Form.Item>
                                </Col>

                                <Col span={4} className="signature-col">
                                  <Form.Item
                                    label={t(
                                      "breakdown.close.fields.signature",
                                    )}
                                  >
                                    <Image
                                      src={repair?.signature || ""}
                                      alt="signature"
                                      preview={false}
                                      className="signature-img"
                                    />
                                  </Form.Item>
                                </Col>

                                <Col span={4}>
                                  {repair?.signatoryIsName && (
                                    <Form.Item label={t("modal.breakdownAssignUserExpand.name_of_signatory")}>
                                      <div className="signatory-name">
                                        {repair.signatoryIsName}
                                      </div>
                                    </Form.Item>
                                  )}
                                </Col>

                                <Col span={4} className="checkbox-col">
                                  <Form.Item>
                                    <Checkbox
                                      onChange={(e) => onChange(e, repair.id)}
                                    >
                                      {t(
                                        "breakdown.close.fields.bank_savings_solution",
                                      )}
                                    </Checkbox>
                                  </Form.Item>
                                </Col>

                                <Col span={24}>
                                  <Divider className="repair-divider" />
                                </Col>
                              </Row>

                              <Divider />
                            </React.Fragment>
                          ))
                        ) : (
                          <Col span={20}>
                            <div style={{ color: "#888" }}>
                              {t("breakdown.close.fields.no_repair_data")}
                            </div>
                          </Col>
                        )}
                      </Row>
                    </Card>
                  </div>
                </React.Fragment>
              ))}
            </Card>
            <div style={{ marginTop: 24, textAlign: "right" }}>
              <BreakdownAttachmentClose
                value={fileList}
                onChange={setFileList}
              />
            </div>
            <Divider />
            <div style={{ marginTop: 24, textAlign: "right" }}>
              {" "}
              <Button key="cancel" onClick={onCancel}>
                <CloseCircleOutlined /> {t("breakdown.close.buttons.cancel")}
              </Button>
              <Button
                key="ok"
                type="primary"
                htmlType="submit"
                style={{ marginLeft: 8 }}
              >
                <SaveOutlined /> {t("common_buttons.save")}
              </Button>
            </div>
          </Form>
        </div>
      </Card>
    </Modal>
  );
}
