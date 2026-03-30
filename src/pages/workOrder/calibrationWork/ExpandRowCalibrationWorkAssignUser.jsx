import { Button, Table, Tooltip } from "antd";
import { parseToLabel } from "../../../helper/parse-helper";
import {
  calibrationWorkAssignUserStatus,
  ServiceTaskType,
} from "../../../utils/constant";
import { UserAddOutlined } from "@ant-design/icons";
import { useState } from "react";
import * as _unitOfWork from "../../../api";
import { useTranslation } from "react-i18next";
import ShowSuccess from "../../../components/modal/result/successNotification";
import ShowError from "../../../components/modal/result/errorNotification";
import AssignUser from "../breakdown/AssignUser";
import { checkPermission } from "../../../helper/permission-helper";
import { permissionCodeConstant } from "../../../utils/permissionConstant";
import useAuth from "../../../contexts/authContext";

const ExpandRowCalibrationWorkAssignUser = ({
  calibrationWork,
  fetchGetListCalibrationWork,
}) => {
  const { t } = useTranslation();
  const [isOpenAssignUser, setIsOpenAssignUser] = useState(false);
  const [calibraitionChange, setCalibrationChange] = useState(null);
  const { permissions } = useAuth();
  const onClickAssignUser = (value) => {
    setIsOpenAssignUser(true);
    setCalibrationChange(value);
  };

  const callbackAssignUser = async (value, selectedRowKeys) => {
    if (selectedRowKeys.length > 0) {
      const payload = {
        user: selectedRowKeys[0],
        calibrationWork: calibrationWork?._id,
        oldUser: calibraitionChange?.user.id,
      };
      let res =
        await _unitOfWork.calibrationWork.reassignmentCalibrationWorkAssignUser(
          payload
        );
      if (res && res.code === 1) {
        fetchGetListCalibrationWork();
        ShowSuccess(
          "topRight",
          t("common.notifications"),
          t("common.messages.success.successfully")
        );
      } else {
        ShowError(
          "topRight",
          t("common.notifications"),
          t("common.messages.errors.failed")
        );
      }
      setIsOpenAssignUser(false);
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
      title: t("breakdownAssignUser.columns.assignee"),
      dataIndex: "user",
      key: "user",
      render: (text) => text?.fullName,
    },
    {
      title: t("breakdownAssignUser.columns.phone"),
      dataIndex: "user",
      key: "userPhone",
      render: (text) => text?.contactNo,
    },
    {
      title: t("breakdownAssignUser.columns.email"),
      dataIndex: "user",
      key: "userEmail",
      render: (text) => text?.email,
    },
    {
      title: t("breakdownAssignUser.columns.role"),
      dataIndex: "user",
      key: "userRole",
      render: (text) => text?.role?.name,
    },
    {
      title: t("branch.list.search.name_label"),
      dataIndex: "user",
      key: "user",
      render: (text) => text?.branch?.name,
    },
    {
      title: t("jobSummaty.job_status"),
      dataIndex: "status",
      key: "status",
      render: (text) =>
        t(parseToLabel(calibrationWorkAssignUserStatus.Options, text)),
    },
    {
      title: t("schedulePreventiveTask.columns.action"),
      dataIndex: "action",
      width: "10%",
      align: "center",
      render: (text, record) => (
        <div
          style={{
            display: "flex",
            gap: "4px",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {checkPermission(
            permissions,
            permissionCodeConstant.calibration_work_assign
          ) &&
            [
              calibrationWorkAssignUserStatus.assigned,
              calibrationWorkAssignUserStatus.accepted,
              calibrationWorkAssignUserStatus.reassignment,
              calibrationWorkAssignUserStatus.completeRecalibrationIssue,
              calibrationWorkAssignUserStatus.inProgress,
            ].includes(record?.status) && (
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
        dataSource={calibrationWork?.assignUsers}
        bordered
        pagination={false}
      />
      <AssignUser
        open={isOpenAssignUser}
        hanldeColse={() => setIsOpenAssignUser(false)}
        assignUser={
          calibrationWork?.assignUsers[0]?.user._id ||
          calibrationWork?.assignUsers[0]?.user?.id
        }
        onReset={fetchGetListCalibrationWork}
        callbackAssignUser={callbackAssignUser}
        selectMulti={false}
        noSelectContract={true}
      />
    </>
  );
};
export default ExpandRowCalibrationWorkAssignUser;
