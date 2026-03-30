import {
  Button,
  Card,
  Col,
  Form,
  InputNumber,
  Modal,
  Row,
  Table,
  Tag,
  Space,
  Typography,
  DatePicker,
  message,
  Input,
} from "antd";
import React, { useEffect, useMemo, useState } from "react";
import * as _unitOfWork from "../../../api";
import { LeftCircleOutlined, PlusOutlined } from "@ant-design/icons";
import ShowSuccess from "../../../components/modal/result/successNotification";
import ShowError from "../../../components/modal/result/errorNotification";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";

export default function UpdatePreventiveConditionBasedSchedule({
  open,
  handleCancel,
  preventiveConditionBasedSchedule,
  onRefresh,
}) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [noteText, setNoteText] = useState("");
  const [valuesMap, setValuesMap] = useState({});
  useEffect(() => {
    if (!open) {
      setValuesMap({});
      form.resetFields();
      return;
    }
    const items =
      preventiveConditionBasedSchedule?.preventiveConditionBaseds ?? [];
    const map = {};
    items.forEach((it, idx) => {
      const id = it?.id ?? it?.key ?? idx;

      map[id] = {
        oldVal: typeof it?.value !== "undefined" ? it.value : null, // giá trị cũ
        value: null, // giá trị mới sẽ nhập
        date: it?.measuredAt ? dayjs(it.measuredAt) : null,
      };
    });

    setValuesMap(map);
  }, [open, preventiveConditionBasedSchedule]);

  const onChangeValue = (id, val) => {
    setValuesMap((s) => ({
      ...s,
      [id]: { ...(s[id] || {}), value: val },
    }));
  };

  const onChangeDate = (id, val) => {
    setValuesMap((s) => ({
      ...s,
      [id]: { ...(s[id] || {}), date: val },
    }));
  };

  const columns = [
    {
      title: "#",
      align: "center",
      width: "8%",
      render: (_text, _record, index) => index + 1,
    },
    {
      title: t("preventiveConditionBased.condition"),
      dataIndex: "name",
      render: (v, row) => row?.condition || "",
    },
    {
      title: t("preventiveConditionBased.uom"),
      dataIndex: "prev",
      render: (v, row) => row?.uom?.uomName || "",
    },
    {
      title: t("preventiveConditionBased.condition_value"),
      dataIndex: "oldVal",
      render: (v, row) => (
        <InputNumber
          value={row?.value}
          style={{ width: "100%", textAlign: "right" }}
          disabled
        />
      ),
    },
    {
      title: t("preventiveConditionBased.current_measured_value"),
      dataIndex: "newVal",
      render: (_v, row) => {
        const id = row?.id ?? row?.key ?? 0;
        return (
          <InputNumber
            value={valuesMap[id]?.value ?? null}
            onChange={(val) => onChangeValue(id, val)}
            style={{ width: "100%", textAlign: "right" }}
          />
        );
      },
    },
    {
      title: t("preventiveConditionBased.measured_at"),
      dataIndex: "measuredAt",
      width: 220,
      render: (_v, row) => {
        const id = row?.id ?? row?.key ?? 0;
        const currentDate = valuesMap[id]?.date ?? null;
        return (
          <DatePicker
            value={currentDate}
            onChange={(d) => onChangeDate(id, d)}
            style={{ width: "100%" }}
            showTime
          />
        );
      },
    },
  ];

  const handleSave = async () => {
    const items =
      preventiveConditionBasedSchedule?.preventiveConditionBaseds ?? [];
    const payload = items.map((it, idx) => {
      const id = it?.id ?? it?.key ?? idx;
      const changed = valuesMap[id] ?? {};
      return {
        id: it?.id ?? null,
        key: id,
        oldVal:
          typeof changed.oldVal !== "undefined"
            ? changed.oldVal
            : it?.value ?? null,
        value:
          typeof changed.value !== "undefined" && changed.value !== null
            ? changed.value
            : it?.value ?? null,
        measuredAt: changed?.date
          ? dayjs(changed.date).toISOString()
          : it?.measuredAt ?? null,
      };
    });
    const body = {
      measurements: payload,
      note: noteText ?? "",
      preventive:
        preventiveConditionBasedSchedule?.id ||
        preventiveConditionBasedSchedule?._id,
    };
    const res =
      await _unitOfWork.preventive.generateSchedulePrenventiveByPreventiveConditionBasedSchedule(
        body
      );
    if (res && res.code === 1) {
      ShowSuccess(
        "topRight",
        t("common.notifications"),
        t("common.messages.update_success")
      );
      onCancel();
      onRefresh();
    }
  };
  const onCancel = () => {
    handleCancel();
    setNoteText("");
  };
  return (
    <Modal
      open={open}
      closable={false}
      className="custom-modal"
      footer={false}
      width={900}
      destroyOnClose
    >
      <Form labelWrap form={form} onFinish={handleSave} layout="vertical">
        <Card title={t("preventiveConditionBased.title_update_measured_value")}>
          <Row gutter={16}>
            <Col span={24}>
              <Table
                columns={columns}
                dataSource={
                  preventiveConditionBasedSchedule?.preventiveConditionBaseds
                }
                pagination={false}
                rowKey={(row, idx) => row?.id ?? row?.key ?? idx}
              />
            </Col>
            <Col span={24} style={{ marginTop: 12 }}>
              <Input.TextArea
                rows={4}
                placeholder={t("calibrationWork.enter_note") }
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
              />
            </Col>
            <Col
              span={24}
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 8,
                marginTop: 20,
              }}
            >
              <Button onClick={onCancel}>
                <LeftCircleOutlined /> {t("common_buttons.cancel") }
              </Button>
              <Button
                type="primary"
                onClick={handleSave}
                icon={<PlusOutlined />}
              >
                {t("common_buttons.update") || "Cập nhật"}
              </Button>
            </Col>
          </Row>
        </Card>
      </Form>
    </Modal>
  );
}
