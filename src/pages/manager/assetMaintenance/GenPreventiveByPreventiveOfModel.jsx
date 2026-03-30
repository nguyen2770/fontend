import { PauseCircleOutlined, PlayCircleOutlined } from "@ant-design/icons";
import { Button, Table, Tooltip, Form } from "antd";
import React, { useEffect, useState } from "react";
import * as _unitOfWork from "../../../api";
import { useTranslation } from "react-i18next";
import {
  frequencyAllOptions,
  monitoringType,
  priorityType,
  ScheduleBasedOnType,
} from "../../../utils/constant";
import { parseToLabel } from "../../../helper/parse-helper";
import Comfirm from "../../../components/modal/Confirm";
import ShowSuccess from "../../../components/modal/result/successNotification";
import ComfirmStartDate from "../../../components/modal/ComfirmStartDate";

export default function GenPreventiveByPreventiveOfModel({ assetMaintenance }) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [preventiveOfModels, setPreventiveOfModels] = useState([]);
  const [showComfirmStartDate, setShowComfirmStartDate] = useState(false);
  const [preventiveOfModel, setPreventiveOfModel] = useState("");

  useEffect(() => {
    fetchGetPreventiveOfModels();
  }, []);

  const fetchGetPreventiveOfModels = async () => {
    const res = await _unitOfWork.preventiveOfModel.getListPreventiveOfModels({
      assetModel: assetMaintenance?.assetModel?.id,
    });

    if (res && res.code === 1) {
      const list = res.preventiveOfModelWithTasks || [];
      const listWithTotal = await Promise.all(
        list.map(async (item) => {
          const totalRes =
            await _unitOfWork.preventiveOfModel.getTotalPreventiveByPreventiveOfModel(
              {
                preventiveOfModel: item._id || item.id,
                assetMaintenance: assetMaintenance?._id || assetMaintenance?.id,
              }
            );
          return {
            ...item,
            totalPreventive: totalRes?.countPrevetive || 0,
          };
        })
      );
      setPreventiveOfModels(listWithTotal);
    }
  };

  const onClickStart = (record) => {
    setPreventiveOfModel(record);
    setShowComfirmStartDate(true);
  };

  const onCallBack = async (date, initialValue) => {
    const data = {
      preventiveOfModel: preventiveOfModel?._id || preventiveOfModel?.id,
      assetMaintenance: assetMaintenance?._id || assetMaintenance?.id,
      actualScheduleDate: date,
    };
    if (initialValue) {
      data.initialValue = initialValue;
    }
    const res = await _unitOfWork.preventiveOfModel.startPreventiveOfModel({
      data,
    });

    if (res && res.code === 1) {
      ShowSuccess(
        "topRight",
        t("common.notifications"),
        t("common.messages.success.successfully")
      );
      fetchGetPreventiveOfModels();
    }
  };

  const onClickStop = async (record) => {
    const res = await _unitOfWork.preventiveOfModel.stopPreventiveOfModel({
      data: {
        preventiveOfModel: record?._id || record?.id,
        assetMaintenance: assetMaintenance?._id || assetMaintenance?.id,
      },
    });
    if (res && res.code === 1) {
      ShowSuccess(
        "topRight",
        t("common.notifications"),
        t("common.messages.success.successfully")
      );
      fetchGetPreventiveOfModels();
    }
  };

  const columns = [
    {
      title: t("preventive.list.table.index"),
      dataIndex: "id",
      align: "center",
      width: 60,
      render: (_text, _record, index) => index + 1,
    },
    {
      title: t("preventive.list.table.plan_name"),
      dataIndex: "preventiveName",
      ellipsis: true,
    },
    {
      title: t("preventive.list.table.frequency_type"),
      dataIndex: "frequencyType",
      ellipsis: true,
      render: (_text, record) => {
        // if (record.scheduleType === ScheduleBasedOnType.Monitoring) {
        //   return t(parseToLabel(monitoringType.Options, record.monitoringType));
        // }
        const label = t(
          parseToLabel(frequencyAllOptions.Option, record.frequencyType)
        );
        return record.calenderFrequencyDuration
          ? `${record.calenderFrequencyDuration} ${label}`
          : label;
      },
    },
    {
      title: t("preventive.list.table.schedule_based_on"),
      dataIndex: "scheduleType",
      align: "center",
      render: (text) => t(parseToLabel(ScheduleBasedOnType.Option, text)),
    },
    {
      title: t("preventive.list.table.priority"),
      dataIndex: "importance",
      align: "center",
      render: (text) => t(parseToLabel(priorityType.Option, text)),
    },
    // {
    //   title: t("preventive.common.action"),
    //   align: "center",
    //   render: (_, record) =>
    //     record.totalPreventive > 0 ? (
    //       <Tooltip title={t("common_buttons.stop")}>
    //         <Button
    //           type="primary"
    //           icon={<PauseCircleOutlined />}
    //           size="small"
    //           onClick={() =>
    //             Comfirm(
    //               t(
    //                 "common.notification_comfirm.notification_comfirm_stop_preventive_of_model"
    //               ),
    //               () => onClickStop(record)
    //             )
    //           }
    //         />
    //       </Tooltip>
    //     ) : (
    //       <Tooltip title={t("common_buttons.start")}>
    //         <Button
    //           type="primary"
    //           icon={<PlayCircleOutlined />}
    //           size="small"
    //           onClick={() => onClickStart(record)}
    //         />
    //       </Tooltip>
    //     ),
    // },
  ];

  return (
    <div className="content-manager">
      <Table
        rowKey="_id"
        columns={columns}
        dataSource={preventiveOfModels}
        bordered
        pagination={false}
        className="p-2"
      />
      <ComfirmStartDate
        open={showComfirmStartDate}
        hanldeColse={() => setShowComfirmStartDate(false)}
        onCallBack={onCallBack}
        preventiveOfModel={preventiveOfModel}
      />
    </div>
  );
}
