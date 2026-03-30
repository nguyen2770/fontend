import React, { useEffect, useState } from "react";
import { Button, Space, Table, Tag } from "antd";
import * as _unitOfWork from "../../../../api";
import { parseDate } from "../../../../helper/date-helper";
import { useTranslation } from "react-i18next";
import { staticPath } from "../../../../router/routerConfig";
import { useNavigate } from "react-router-dom";
import { DeleteOutlined, EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import ViewDetailHistory from "../../../../components/modal/calibrationWork/ViewDetailHistory";

export default function CalibrationHistory({ calibrationWork }) {
  const [calibrationWorkHistorys, setCalibrationWorkHistorys] = useState([]);
  const [isOpenDetail, setIsOpenDetail] = useState(false)
  const [calibrationWorkHistory, setCalibrationWorkHistory] = useState();
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    fetchGetAllCalibrationWorkHistoryById();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchGetAllCalibrationWorkHistoryById = async () => {
    const res = await _unitOfWork.calibrationWork.getAllCalibrationWorkHistorys(
      calibrationWork?.id
    );
    if (res && res.code === 1) {
      setCalibrationWorkHistorys(res?.calibrationWorkHistorys);
    }
  };

  const columns = [
    {
      title: t("calibration.stt"),
      width: 60,
      render: (_, __, index) => index + 1,
      align: "center",
    },
    {
      title: t("calibrationWork.performer"),
      dataIndex: "calibrationWorkAssignUser",
      key: "calibrationWorkAssignUser",
      render: (text, record) =>
        record.calibrationWorkAssignUser?.user?.fullName || "—",
    },
    {
      title: t("calibrationWork.detail.fields.calibration_date"),
      dataIndex: "calibrationWorkAssignUser",
      key: "calibrationWorkAssignUser",
      align: "center",
      render: (text) => parseDate(text?.confirmDate),
    },
    // {
    //     title: "Trạng thái",
    //     dataIndex: "calibrationWorkAssignUser",
    //     key: "calibrationWorkAssignUser",
    //     render: (text) => {
    //         const option = calibrationWorkAssignUserStatus.Options.find(
    //             (opt) => opt.value === text?.status
    //         );
    //         const label = option ? t(option.label) : text?.status;
    //         const color = option?.color || "#d9d9d9";
    //         return (
    //             <span
    //                 className="status-badge"
    //                 style={{
    //                     "--color": color,
    //                 }}
    //             >
    //                 {label}
    //             </span>
    //         );
    //     },
    // },
    {
      title: t("calibrationWork.detail.fields.result"),
      dataIndex: "isPassed",
      key: "isPassed",
      align: "center",
      render: (value) =>
        value ? (
          <Tag color="green">{t("calibrationWork.detail.fields.pass")}</Tag>
        ) : (
          <Tag color="red">{t("calibrationWork.detail.fields.fail")}</Tag>
        ),
    },
    {
      title: t("calibrationWork.detail.fields.note"),
      dataIndex: "comment",
      key: "comment",
      render: (text) => text || "—",
    },
    {
      title: t("calibrationWork.detail.fields.breakdown"),
      dataIndex: "breakdown",
      key: "breakdown",
      align: "center",
      render: (text, record) => {
        if (!record.breakdown) return "—";
        return (
          <a
            style={{ color: "#1677ff", cursor: "pointer" }}
            onClick={() =>
              navigate(
                staticPath.viewWorkOrderBreakdown + "/" + record?.breakdown?.id
              )
            }
          >
            {record.breakdown.code}
          </a>
        );
      },
    },
    {
      key: "action",
      align: "center",
      render: (text, record) => (

        <Button
          type="default"
          onClick={() => { setIsOpenDetail(true); setCalibrationWorkHistory(record) }}
          icon={<EyeOutlined />}
          size="small"
        />
      )


    },
  ];

  return (
    <div style={{ marginTop: 16 }}>
      <Table
        rowKey="id"
        dataSource={calibrationWorkHistorys}
        columns={columns}
        pagination={false}
        bordered
        size="small"
      />
      <ViewDetailHistory
        isOpen={isOpenDetail}
        isClose={() => setIsOpenDetail(false)}
        data={calibrationWorkHistory}
      />
    </div>
  );
}
