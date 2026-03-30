import { Button, Table, Tooltip } from "antd";
import "./index.scss";
import { parseToLabel } from "../../../helper/parse-helper";
import {
  schedulePreventiveTaskAssignUserStatus,
  ticketSchedulePreventiveStatus,
  ServiceTaskType,
} from "../../../utils/constant";
import { FileOutlined, UserAddOutlined } from "@ant-design/icons";
import { useState } from "react";
import * as _unitOfWork from "../../../api";
import ShowError from "../result/errorNotification";
import ShowSuccess from "../result/successNotification";
import PreventiveAssignUser from "./PreventiveAssignUser";
import ViewTaskItemsModal from "../../../pages/workOrder/schedulePreventive/viewTaskItemsModal";
import { checkPermission } from "../../../helper/permission-helper";
import { permissionCodeConstant } from "../../../utils/permissionConstant";
import useAuth from "../../../contexts/authContext";
import { useTranslation } from "react-i18next";

const activeStatuses = [
  schedulePreventiveTaskAssignUserStatus.assigned,
  schedulePreventiveTaskAssignUserStatus.accepted,
  schedulePreventiveTaskAssignUserStatus.inProgress,
  schedulePreventiveTaskAssignUserStatus.reassignment,
  schedulePreventiveTaskAssignUserStatus.reopen,
];

const ExpandRowSchedulePreventiveAssignUser = ({
  schdulePreventive,
  fetchGetListSchedulePreventive,
  isActive,
  hidden,
}) => {
  const { t } = useTranslation();
  const [isOpenAssignUser, setIsOpenAssignUser] = useState(false);
  const [schedulePreventiveTaskChange, setSchedulePreventiveTaskChange] =
    useState(null);
  const [isOpenViewTaskItems, setIsOpenViewTaskItems] = useState(false);
  const { permissions } = useAuth();

  const onClickAssignUser = (value) => {
    setIsOpenAssignUser(true);
    setSchedulePreventiveTaskChange(value);
  };

  const callbackAssignUser = async (value, comment) => {
    const payload = {
      schedulePreventiveTask: schedulePreventiveTaskChange._id,
      user: value[0],
      schedulePreventive: schdulePreventive._id,
      reassignUser:
        schedulePreventiveTaskChange?.schedulePreventiveTaskAssignUserIsActive
          ?.user?.id,
      comment: comment,
    };
    let res =
      await _unitOfWork.schedulePreventive.schedulePreventiveTaskAssignUser(
        payload
      );
    if (res && res.code === 1) {
      ShowSuccess(
        "topRight",
        t("common.notifications"),
        t("preventiveAssignUser.messages.assign_success")
      );
      setIsOpenAssignUser(false);
      fetchGetListSchedulePreventive();
    } else {
      ShowError(
        "topRight",
        t("common.notifications"),
        res.message || t("preventiveAssignUser.messages.assign_error")
      );
    }
  };

  const onClickOpenViewTaskItems = (value) => {
    setIsOpenViewTaskItems(true);
    setSchedulePreventiveTaskChange(value);
  };

  const columnExpands = [
    {
      title: "",
      dataIndex: "id",
      key: "id",
      width: "5%",
      align: "center",
      render: (_text, _record, index) => index + 1,
    },
    {
      title: t("schedulePreventiveTask.columns.type"),
      dataIndex: "taskType",
      align: "center",
      render: (_text) => t(parseToLabel(ServiceTaskType.Options, _text)),
    },
    {
      title: t("schedulePreventiveTask.columns.name"),
      dataIndex: "taskName",
      align: "center",
    },
    {
      title: t("schedulePreventiveTask.columns.contract"),
      dataIndex: "amc",
      align: "center",
      render: (_text) => _text?.amcNo || "---",
    },
    {
      title: t("schedulePreventiveTask.columns.status"),
      dataIndex: "status",
      align: "center",
      render: (_text, record) =>
        record?.schedulePreventiveTaskAssignUserIsActive
          ? t(
              parseToLabel(
                schedulePreventiveTaskAssignUserStatus.Options,
                record?.schedulePreventiveTaskAssignUserIsActive?.status
              )
            )
          : "",
    },
    {
      title: t("schedulePreventiveTask.columns.assignee"),
      dataIndex: "assignUser",
      align: "assignUser",
      render: (_text, record) =>
        record?.schedulePreventiveTaskAssignUserIsActive
          ? record?.schedulePreventiveTaskAssignUserIsActive?.user?.fullName
          : t("schedulePreventiveTask.values.not_assigned"),
    },
    {
      title: t("schedulePreventiveTask.columns.replacements"),
      dataIndex: "assignUser",
      align: "assignUser",
      render: (_text, record) =>
        record?.schedulePreventiveTaskAssignUserReplacements?.length > 0
          ? record?.schedulePreventiveTaskAssignUserReplacements
              ?.map((item) => item?.user?.fullName)
              .join(", ")
          : t("schedulePreventiveTask.values.no_data"),
    },
    !isActive &&
      schdulePreventive.ticketStatus !==
        ticketSchedulePreventiveStatus.history && {
        title: t("schedulePreventiveTask.columns.action"),
        dataIndex: "action",
        width: "10%",
        align: "center",
        render: (_, record) =>
          (!record?.schedulePreventiveTaskAssignUserIsActive ||
            activeStatuses.includes(
              record?.schedulePreventiveTaskAssignUserIsActive?.status
            )) && (
            <>
              {checkPermission(
                permissions,
                permissionCodeConstant.schedule_preventive_assign_engineer
              ) &&
                !hidden && (
                  <Tooltip
                    title={t("schedulePreventiveTask.tooltips.assign_engineer")}
                  >
                    <Button
                      type="primary"
                      icon={<UserAddOutlined />}
                      size="small"
                      onClick={() => onClickAssignUser(record)}
                    />
                  </Tooltip>
                )}
              {checkPermission(
                permissions,
                permissionCodeConstant.schedule_preventive_view_items
              ) && (
                <Tooltip
                  title={t("schedulePreventiveTask.tooltips.view_items")}
                >
                  <Button
                    type="primary"
                    icon={<FileOutlined />}
                    size="small"
                    className="ml-2"
                    onClick={() => onClickOpenViewTaskItems(record)}
                  />
                </Tooltip>
              )}
            </>
          ),
      },
  ].filter(Boolean);

  return (
    <>
      <Table
        rowKey="id"
        className="paramater-asset-expand pl-3 pr-3 mb-2"
        columns={columnExpands}
        key={"id"}
        dataSource={schdulePreventive?.schedulePreventiveTasks}
        bordered
        pagination={false}
      />
      <PreventiveAssignUser
        open={isOpenAssignUser}
        hanldeClose={() => setIsOpenAssignUser(false)}
        callbackAssignUser={callbackAssignUser}
        preventiveTask={schedulePreventiveTaskChange}
      />
      <ViewTaskItemsModal
        open={isOpenViewTaskItems}
        onCancel={() => setIsOpenViewTaskItems(false)}
        data={schedulePreventiveTaskChange?.taskItems}
      />
    </>
  );
};
export default ExpandRowSchedulePreventiveAssignUser;
