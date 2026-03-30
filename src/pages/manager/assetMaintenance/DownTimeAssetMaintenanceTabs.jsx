import React, { useEffect, useState } from "react";
import { Row, Col, Card, Collapse, Table } from "antd";
import * as _unitOfWork from "../../../api";
import { formatWorkingTime, parseDateHH } from "../../../helper/date-helper";
import { useTranslation } from "react-i18next";

const DownTimeAssetMaintenanceTabs = ({ assetMaintenance }) => {
  const { t } = useTranslation();
  const [totalDownTime, setTotalDowntime] = useState([]);
  const [items, setItems] = useState([]);
  useEffect(() => {
    if (assetMaintenance) {
      fetchGetAllDownTime();
    }
  }, [assetMaintenance]);

  const fetchGetAllDownTime = async () => {
    let res = await _unitOfWork.assetMaintenance.getAllDowntime(
      assetMaintenance.id
    );
    let newItems = [];
    if (res && res.code === 1) {
      newItems = res.data.map((item) => {
        return {
          ...item,
          key: item.year,
          label:
            t("assetMaintenance.list.table.down_time_year", {
              year: item.year,
            }) +
            ": " +
            formatWorkingTime(item.totalDowntime),
          children: detailDowntime(item),
        };
      });
    }
    setTotalDowntime(
      newItems.reduce((total, item) => total + item.totalDowntime, 0)
    );
    setItems(newItems);
  };
  const detailDowntime = (item) => {
    const columns = [
      {
        title: t("assetMaintenance.export.index"),
        dataIndex: "id",
        key: "id",
        width: "50px",
        align: "center",
        render: (_text, _record, index) => index + 1,
      },
      {
        title: t("assetMaintenance.form.fields.start_date"),
        dataIndex: "startDate",
        align: "center",
        render: (text) => parseDateHH(text),
      },
      {
        title: t("assetMaintenance.form.fields.end_date"),
        dataIndex: "endDate",
        align: "center",
        render: (text) => parseDateHH(text),
      },
      {
        title: t("assetMaintenance.list.table.down_time"),
        dataIndex: "duration",
        align: "center",
        render: (text) => formatWorkingTime(text),
      },
    ];
    return (
      <Table
        rowKey="id"
        columns={columns}
        key={"id"}
        dataSource={item.details ?? []}
        bordered
        pagination={false}
      ></Table>
    );
  };
  return (
    <div style={{ padding: "16px" }}>
      <Row gutter={[16, 16]}>
        <Collapse items={items} className="wp-100" />
      </Row>
      <Row>
        <Col span={24} style={{ marginTop: "10px" }}>
          <span style={{ fontSize: 16, fontWeight: 600 }}>
            {t("assetMaintenance.list.table.down_time")} :{" "}
          </span>
          {formatWorkingTime(totalDownTime)}
        </Col>
      </Row>
    </div>
  );
};

export default DownTimeAssetMaintenanceTabs;
