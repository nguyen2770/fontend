import React, { useEffect, useState } from "react";
import { Table, Button, Space, Tooltip, Row, Col } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import * as _unitOfWork from "../../../../../api";
import CreateMonitoringPoint from "./CreateMonitoringPoint";
import UpdateMonitoringPoint from "./UpdateMoniitoringPoint";
import { parseToLabel } from "../../../../../helper/parse-helper";
import {
  frequencyTypeOptions,
  measuringTypeOptions
} from "../../../../../utils/constant";
import Confirm from "../../../../../components/modal/Confirm";
import ShowSuccess from "../../../../../components/modal/result/successNotification";
import { useTranslation } from "react-i18next";

export default function MonitoringPoint({ assetModel }) {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [isOpenCreate, setIsOpenCreate] = useState(false);
  const [isOpenUpdate, setIsOpenUpdate] = useState(false);
  const [uoms, setUoms] = useState([]);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    fetchUom();
    fetchData();
  }, []);

  const fetchUom = async () => {
    const res = await _unitOfWork.uom.getAllUom();
    if (res?.code === 1) setUoms(res.data);
  };

  const fetchData = async () => {
    const res =
      await _unitOfWork.assetModelMonitoringPoint.getResById({
        assetModelId: assetModel.id
      });
    if (res?.code === 1) setData(res.data);
  };

  const onDelete = async (record) => {
    const res =
      await _unitOfWork.assetModelMonitoringPoint.deleteAssetModelMonitoringPoint(
        { id: record.id }
      );
    if (res?.code === 1) {
      ShowSuccess(
        "topRight", t("common.notifications"),
        t("preventive.messages.delete_success")
      );
      fetchData();
    }
  };

  const onUpdate = (record) => {
    setEditing(record);
    setIsOpenUpdate(true);
  };

  const columns = [
    {
      title: t("assetModel.monitoring_point.table.index"),
      dataIndex: "key",
      width: 60,
      align: "center",
      render: (_t, _r, i) => i + 1
    },
    {
      title: t("assetModel.monitoring_point.table.name"),
      dataIndex: "name"
    },
    {
      title: t("assetModel.monitoring_point.table.uom"),
      dataIndex: "uomId",
      render: (uom) => uom?.uomName || ""
    },
    {
      title: t("assetModel.monitoring_point.table.value"),
      dataIndex: "duration"
    },
    {
      title: t("assetModel.monitoring_point.table.frequency"),
      dataIndex: "frequencyType",
      render: (val) => t(parseToLabel(frequencyTypeOptions, val))
    },
    {
      title: t("assetModel.monitoring_point.table.measuring_type"),
      dataIndex: "measuringType",
      render: (val) =>
        t(parseToLabel(measuringTypeOptions.Option, val))
    },
    {
      title: t("assetModel.monitoring_point.table.action"),
      dataIndex: "action",
      width: 90,
      align: "center",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title={t("assetModel.common.buttons.update")}>
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => onUpdate(record)}
            />
          </Tooltip>
          <Tooltip title={t("assetModel.common.buttons.delete")}>
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              onClick={() =>
                Confirm(
                  t("assetModel.common.messages.confirm_delete"),
                  () => onDelete(record)
                )
              }
            />
          </Tooltip>
        </Space>
      )
    }
  ];

  return (
    <div>
      <Row className="mb-1">
        <Col span={24} style={{ textAlign: "right" }}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsOpenCreate(true)}
            className="ml-2"
          >
            {t("assetModel.common.buttons.add_monitoring_point")}
          </Button>
        </Col>
      </Row>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        pagination={false}
        bordered
      />
      <CreateMonitoringPoint
        open={isOpenCreate}
        onCancel={() => setIsOpenCreate(false)}
        uoms={uoms}
        assetModel={assetModel}
        onReset={fetchData}
      />
      <UpdateMonitoringPoint
        open={isOpenUpdate}
        onCancel={() => setIsOpenUpdate(false)}
        onReset={fetchData}
        uoms={uoms}
        assetModel={assetModel}
        monitoringPointChange={editing}
      />
    </div>
  );
}