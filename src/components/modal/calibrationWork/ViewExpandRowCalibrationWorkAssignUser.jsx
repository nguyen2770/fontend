import { Button, Table, Tooltip } from "antd";
import { parseToLabel } from "../../../helper/parse-helper";
import {
  calibrationWorkAssignUserStatus,
} from "../../../utils/constant";
import * as _unitOfWork from "../../../api";
import { useTranslation } from "react-i18next";
const ViewExpandRowCalibrationWorkAssignUser = ({
  assignUsers,
}) => {
  const { t } = useTranslation();

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
  ].filter(Boolean);

  return (
    <>
      <Table
        rowKey="id"
        className="paramater-asset-expand pl-3 pr-3 mb-2"
        columns={columnExpands}
        key={"id"}
        dataSource={assignUsers}
        bordered
        pagination={false}
      />
    </>
  );
};
export default ViewExpandRowCalibrationWorkAssignUser;
