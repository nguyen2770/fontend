import { Button, Table, Tooltip } from "antd";
import "./index.scss";
import { parseToLabel } from "../../../helper/parse-helper";
import { ServiceTaskType } from "../../../utils/constant";
import { UserAddOutlined } from "@ant-design/icons";
import { useState } from "react";
import * as _unitOfWork from "../../../api";
import PreventiveAssignUser from "./PreventiveAssignUser";
import ShowError from "../result/errorNotification";
import ShowSuccess from "../result/successNotification";
import { useTranslation } from "react-i18next";

const ExpandRowPreventiveAssignUser = ({
  preventive,
  fetchGetListPreventive,
}) => {
  const { t } = useTranslation();
  const [isOpenAssignUser, setIsOpenAssignUser] = useState(false);
  const [preventiveTaskChange, setPreventiveTaskChange] = useState(null);

  const onClickAssignUser = (value) => {
    setIsOpenAssignUser(true);
    setPreventiveTaskChange(value);
  };

  const callbackAssignUser = async (value) => {
    const payload = {
      preventiveTaskAssignUser: {
        preventiveTask: preventiveTaskChange._id,
        user: value[0],
        preventive: preventive._id,
      },
    };
    let res =
      await _unitOfWork.preventiveTaskAssignUser.createPreventiveTaskAssignUser(
        payload
      );
    if (res && res.code === 1) {
      ShowSuccess(
        "topRight",
        t("common.notifications"),
        t("preventiveAssignUser.messages.assign_success")
      );
      setIsOpenAssignUser(false);
      fetchGetListPreventive();
    } else {
      ShowError(
        "topRight",
        t("common.notifications"),
        res.message || t("preventiveAssignUser.messages.assign_error")
      );
    }
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
      title: t("schedulePreventiveTask.columns.assignee"),
      dataIndex: "assignUser",
      align: "assignUser",
      render: (_text, record) =>
        record?.preventiveTaskAssignUsers?.length > 0
          ? record?.preventiveTaskAssignUsers
              ?.map((item) => item?.user?.fullName)
              .join(", ")
          : t("schedulePreventiveTask.values.not_assigned"),
    },
    {
      title: t("schedulePreventiveTask.columns.contract"),
      dataIndex: "amc",
      align: "center",
      render: (_text) => _text?.amcNo,
    },
    // preventive?.isStart === false &&
    {
      title: t("schedulePreventiveTask.columns.action"),
      dataIndex: "action",
      width: "10%",
      align: "center",
      render: (_, record) => (
        <div
          style={{
            display: "flex",
            gap: "4px",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Tooltip title={t("schedulePreventiveTask.tooltips.assign_engineer")}>
            <Button
              type="primary"
              icon={<UserAddOutlined />}
              size="small"
              onClick={() => onClickAssignUser(record)}
            />
          </Tooltip>
        </div>
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
        dataSource={preventive?.preventiveTasks}
        bordered
        pagination={false}
      />
      <PreventiveAssignUser
        open={isOpenAssignUser}
        hanldeClose={() => setIsOpenAssignUser(false)}
        callbackAssignUser={callbackAssignUser}
        onReset={fetchGetListPreventive}
        preventiveTask={preventiveTaskChange}
      />
    </>
  );
};
export default ExpandRowPreventiveAssignUser;
