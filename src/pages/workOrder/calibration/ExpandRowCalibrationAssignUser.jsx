import { Button, Table, Tooltip } from "antd";
import { parseToLabel } from "../../../helper/parse-helper";
import { ServiceTaskType } from "../../../utils/constant";
import { UserAddOutlined } from "@ant-design/icons";
import { useState } from "react";
import * as _unitOfWork from "../../../api";
import { useTranslation } from "react-i18next";
import ShowSuccess from "../../../components/modal/result/successNotification";
import ShowError from "../../../components/modal/result/errorNotification";
import AssignUser from "../breakdown/AssignUser";

const ExpandRowCalibrationAssignUser = ({
    calibration,
    fetchGetListCalibration,
}) => {
    const { t } = useTranslation();
    const [isOpenAssignUser, setIsOpenAssignUser] = useState(false);
    const [preventiveTaskChange, setPreventiveTaskChange] = useState(null);

    const onClickAssignUser = (value) => {
        setIsOpenAssignUser(true);
        setPreventiveTaskChange(value);
    };

    const callbackAssignUser = async (value, selectedRowKeys) => {
        if (selectedRowKeys.length > 0) {
            const payload = {
                user: selectedRowKeys[0],
                calibration: calibration?._id,
                oldUser: calibration?.assignUsers[0]?.user._id || calibration?.assignUsers[0]?.user?.id,
            };
            setIsOpenAssignUser(false);
            let res = await _unitOfWork.calibration.reassignmentUser(
                payload
            );
            if (res && res.code === 1) {
                fetchGetListCalibration();
                ShowSuccess("topRight", t("common.notifications"), t("common.messages.success.successfully"));
            } else {
                ShowError("topRight", t("common.notifications"), t("common.messages.errors.failed"));
            }
        };
    }

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
        calibration?.isStart === false && {
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
                dataSource={calibration?.assignUsers}
                bordered
                pagination={false}
            />
            <AssignUser
                open={isOpenAssignUser}
                hanldeColse={() => setIsOpenAssignUser(false)}
                assignUser={calibration?.assignUsers[0]?.user._id || calibration?.assignUsers[0]?.user?.id}
                onReset={fetchGetListCalibration}
                callbackAssignUser={callbackAssignUser}
                selectMulti={false}
            />
        </>
    );
};
export default ExpandRowCalibrationAssignUser;