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
  Table,
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

export default function ViewPreventiveConditionBasedScheduleHistory({
  open,
  handleCancel,
  preventiveConditionBasedSchedule,
  onRefresh,
}) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [
    preventiveConditionBasedScheduleHistorys,
    setPreventiveConditionBasedScheduleHistorys,
  ] = useState([]);
  const onCancel = () => {
    handleCancel();
    form.resetFields();
  };

  useEffect(() => {
    if (preventiveConditionBasedSchedule && open) {
      getPreventiveMonitoringHistorys();
    }
  }, [preventiveConditionBasedSchedule, open]);

  const getPreventiveMonitoringHistorys = async () => {
    const res =
      await _unitOfWork.preventive.getAllPreventiveConditionBasedScheduleHistoryByPreventive(
        {
          preventive: preventiveConditionBasedSchedule?._id,
        }
      );
    if (res && res.code === 1) {
      setPreventiveConditionBasedScheduleHistorys(res?.data || []);
    }
  };
  const columns = [
    {
      title: t("preventiveConditionBased.stt"),
      width: 60,
      render: (_, __, index) => index + 1,
    },
    {
      title: t("preventiveConditionBased.condition"),
      dataIndex: "condition",
    },
    {
      title: t("preventiveConditionBased.condition_value"),
      dataIndex: "value",
      align: "right",
    },
    {
      title: t("preventiveConditionBased.current_measured_value"),
      dataIndex: "measuredValue",
      align: "right",
    },
    {
      title: t("preventiveConditionBased.uom"),
      align: "center",
      render: (_, record) => record?.uom?.uomName || "---",
    },
    {
      title: t("preventiveConditionBased.measured_at"),
      align: "center",
      render: (_, record) => parseDateHH(record?.measuredAt) || "---",
    },
  ];
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
        <Card title={t("preventiveConditionBased.title_measurement_history")}>
          <Row>
            <Col span={24}>
              {preventiveConditionBasedScheduleHistorys.length === 0 ? (
                <Empty description={t("preventiveMonitoring.no_data")} />
              ) : (
                <List
                  dataSource={preventiveConditionBasedScheduleHistorys}
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
                              {idx + 1}.{hist?.note || "---"}
                            </Typography.Link>
                          </Col>
                          <Col className="ml-4">
                            <Tooltip
                              title={t("preventiveMonitoring.created_at")}
                            >
                              <ClockCircleOutlined className="mr-2" />
                              {parseDateHH(hist?.createdAt) || "---"}
                            </Tooltip>
                          </Col>
                        </Row>
                        <Divider style={{ margin: "8px 0" }} />
                        <Table
                          columns={columns}
                          dataSource={hist?.details || []}
                          pagination={false}
                          rowKey={(row, index) => row?.id || row?._id || index}
                        />
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
