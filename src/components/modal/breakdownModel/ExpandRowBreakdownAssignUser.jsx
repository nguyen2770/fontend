import { Button, Table, Tooltip } from "antd";
import "./index.scss";
import { parseToLabel } from "../../../helper/parse-helper";
import {
  breakdownTicketStatus,
  breakdownUserStatus,
} from "../../../utils/constant";
import { CheckCircleOutlined, UserAddOutlined } from "@ant-design/icons";
import ReplacementAssignUser from "./ReplacementAssignUser";
import { useState } from "react";
import Confirm from "../Confirm";
import * as _unitOfWork from "../../../api";
import useAuth from "../../../contexts/authContext";
import { checkPermission } from "../../../helper/permission-helper";
import { permissionCodeConstant } from "../../../utils/permissionConstant";
import { useTranslation } from "react-i18next";

const ExpandRowBreakdownAssignUser = ({
  breakdowns,
  fetchGetListBreakdown,
  hideAction,
}) => {
  const { t } = useTranslation();
  const [isOpenReplacementAssignUser, setIsOpenReplacementAssignUser] =
    useState(false);
  const [breakdownAssignUser, setBreakdownAssignUser] = useState(null);
  const { permissions } = useAuth();

  const onClickReplacementAssignUser = (value) => {
    setIsOpenReplacementAssignUser(true);
    setBreakdownAssignUser(value);
  };
  const onClickFix = async (value) => {
    let res =
      await _unitOfWork.breakdownAssignUser.comfirmBreakdownAssignUserFixed({
        breakdownAssignUser: value.id,
      });
    if (res && res.code === 1) {
      fetchGetListBreakdown();
    }
  };

  const columnExpands = [
    {
      title: "",
      dataIndex: "id",
      key: "id",
      width: "50px",
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
      title: t("breakdownAssignUser.columns.role"),
      dataIndex: "user",
      key: "userRole",
      render: (text) => text?.role?.name,
    },
    {
      title: t("breakdownAssignUser.columns.status"),
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (text) => t(parseToLabel(breakdownUserStatus.Option, text)),
    },
    {
      title: t("amc.manager.table.contract_no"),
      dataIndex: "repairContract",
      key: "repairContract",
      align: "center",
      render: (text) => text?.contractNo,
    },
    !hideAction && {
      title: t("breakdownAssignUser.columns.action"),
      dataIndex: "action",
      align: "center",
      render: (_, record) => (
        <>
          {checkPermission(
            permissions,
            permissionCodeConstant.breakdown_assign_engineer
          ) &&
            record?.status !== breakdownUserStatus.replacement &&
            record?.status !== breakdownUserStatus.experimentalFix &&
            record?.status !== breakdownUserStatus.WCA &&
            breakdowns?.ticketStatus !== breakdownTicketStatus.cloesed && (
              <Tooltip
                title={t("breakdownAssignUser.tooltips.reassign_engineer")}
              >
                <Button
                  type="primary"
                  icon={<UserAddOutlined />}
                  size="small"
                  onClick={() => onClickReplacementAssignUser(record)}
                />
              </Tooltip>
            )}
          {checkPermission(
            permissions,
            permissionCodeConstant.breakdown_comfirm_experimental_fix
          ) &&
            record?.status === breakdownUserStatus.experimentalFix && (
              <Tooltip title={t("breakdownAssignUser.tooltips.mark_fixed")}>
                <Button
                  type="primary"
                  icon={<CheckCircleOutlined />}
                  size="small"
                  onClick={() =>
                    Confirm(
                      t("breakdownAssignUser.confirm.experimental_fix"),
                      () => onClickFix(record)
                    )
                  }
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
        dataSource={breakdowns?.breakdownAssignUsers}
        bordered
        pagination={false}
      />
      <ReplacementAssignUser
        open={isOpenReplacementAssignUser}
        hanldeColse={() => setIsOpenReplacementAssignUser(false)}
        breakdownAssignUser={breakdownAssignUser}
        onReset={fetchGetListBreakdown}
        breakdowns={breakdowns}
      />
    </>
  );
};
export default ExpandRowBreakdownAssignUser;
