// ...existing code...
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Modal,
  Row,
  List,
  Tag,
  Empty,
  Typography,
  Space,
  Divider,
  Tooltip,
} from "antd";
import React, { useEffect, useState } from "react";
import * as _unitOfWork from "../../../api";
import {
  ClockCircleOutlined,
  LeftCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import ShowSuccess from "../../../components/modal/result/successNotification";
import ShowError from "../../../components/modal/result/errorNotification";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import { parseDateHH } from "../../../helper/date-helper";
import { frequencyTypeOptions } from "../../../utils/constant";
import { parseToLabel } from "../../../helper/parse-helper";

export default function ViewPreventiveMonitoringModal({
  open,
  handleCancel,
  preventiveMonitoring,
  onRefresh,
}) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [preventiveMonitoringHistorys, setPreventiveMonitoringHistorys] =
    useState([]);
  const onCancel = () => {
    handleCancel();
    form.resetFields();
  };

  useEffect(() => {
    if (preventiveMonitoring && open) {
      getPreventiveMonitoringHistorys();
    }
  }, [preventiveMonitoring, open]);

  const getPreventiveMonitoringHistorys = async () => {
    const res =
      await _unitOfWork.preventiveMonitoring.getPreventiveMonitoringHistorys({
        preventiveMonitoring: preventiveMonitoring?._id,
      });
    if (res && res.code === 1) {
      setPreventiveMonitoringHistorys(res?.data || []);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      className="custom-modal"
      footer={false}
      width={"70%"}
      destroyOnClose
    >
      <Form labelWrap form={form} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
        <Card title={t("preventiveMonitoring.title_monitoring_history")}>
          <Row>
            <Col span={24}>
              {preventiveMonitoringHistorys.length === 0 ? (
                <Empty description={t("preventiveMonitoring.no_data")} />
              ) : (
                <List
                  dataSource={preventiveMonitoringHistorys}
                  renderItem={(hist, idx) => {
                    return (
                      <div
                        key={hist._id || hist.id || idx}
                        style={{
                          marginBottom: 16,
                          padding: 20,
                          borderRadius: 8,
                          background: "#f3f3f3ff",
                          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                        }}
                      >
                        <Row align="middle" style={{ marginBottom: 8 }}>
                          <Col>
                            <Typography.Link
                              style={{ fontWeight: 700, fontSize: 16 }}
                            >
                              {idx + 1}.
                              {hist?.preventiveMonitoring?.preventive
                                ?.assetMaintenanceMonitoringPoint?.name ||
                                "---"}
                            </Typography.Link>
                          </Col>
                          <Col className="ml-4">
                            <Tooltip title={t("preventiveMonitoring.created_at")}>
                              <ClockCircleOutlined className="mr-2" />
                              {parseDateHH(hist?.createdAt) || "---"}
                            </Tooltip>
                          </Col>
                        </Row>
                        <Divider style={{ margin: "8px 0" }} />
                        <Row gutter={[12, 8]} style={{ fontSize: 13 }}>
                          <Col span={5}>
                            <Typography.Text strong>
                             {t("preventiveMonitoring.previous_meter_value")}
                            </Typography.Text>
                            <div> {hist?.previousMeterValue || "---"}</div>
                          </Col>
                          <Col span={5}>
                            <Typography.Text strong>{t("preventiveMonitoring.meter_value")}</Typography.Text>
                            <div>{hist?.meterValue || "---"}</div>
                          </Col>
                          <Col span={5}>
                            <Typography.Text strong>{t("preventiveMonitoring.unit")}</Typography.Text>
                            <div>
                              {hist?.preventiveMonitoring?.preventive
                                ?.assetMaintenanceMonitoringPoint?.uomId
                                ?.uomName || "---"}
                            </div>
                          </Col>
                          <Col span={5}>
                            <Typography.Text strong>
                              {t("preventiveMonitoring.time_period")}
                            </Typography.Text>
                            <div>
                              {hist?.preventiveMonitoring?.preventive
                                ?.assetMaintenanceMonitoringPoint?.duration ||
                                "---"}
                            </div>
                          </Col>
                          <Col span={4}>
                            <Typography.Text strong>{t("preventiveMonitoring.frequency")}</Typography.Text>
                            <div>
                              {t(
                                parseToLabel(
                                  frequencyTypeOptions,
                                  hist?.preventiveMonitoring?.preventive
                                    ?.assetMaintenanceMonitoringPoint
                                    ?.frequencyType
                                )
                              ) || "---"}
                            </div>
                          </Col>
                        </Row>
                        {/* <Row
                          gutter={[12, 8]}
                          style={{ marginTop: 8, fontSize: 13 }}
                        >
                          <Col span={6}>
                            <Typography.Text strong>Asset Id</Typography.Text>
                            <div>{}</div>
                          </Col>
                          <Col span={6}>
                            <Typography.Text strong>
                              Meter Reading Date
                            </Typography.Text>
                            <div>{}</div>
                          </Col>
                          <Col span={6}>
                            <Typography.Text strong>
                              Previous Meter Value
                            </Typography.Text>
                            <div>{}</div>
                          </Col>
                          <Col span={6}>
                            <Typography.Text strong>
                              Last Updated Meter Value
                            </Typography.Text>
                            <div>{}</div>
                          </Col>
                          <Col span={6}>
                            <Typography.Text strong>Duration</Typography.Text>
                            <div>{}</div>
                          </Col>
                          <Col span={6}>
                            <Typography.Text strong>Frequency</Typography.Text>
                            <div>{}</div>
                          </Col>
                        </Row> */}
                      </div>
                    );
                  }}
                />
              )}
            </Col>
          </Row>
        </Card>
      </Form>
    </Modal>
  );
}
// ...existing code...
