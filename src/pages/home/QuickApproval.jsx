import { Button, Card, Pagination, Table, Tooltip } from "antd";
import { useEffect, useState } from "react";
import * as _unitOfWork from "../../api";
import { PAGINATION } from "../../utils/constant";
import { render } from "@testing-library/react";
import {
  CheckCircleOutlined,
  CheckSquareOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  FileDoneOutlined,
  FolderOpenOutlined,
  LikeFilled,
  LikeOutlined,
  RightSquareOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { staticPath } from "../../router/routerConfig";
import ApproveSparePartModal from "../workOrder/breakdown/sparePartRequest/ApproveSparePartModal";
import ComfirmCloseBreakdown from "../workOrder/breakdown/ComfirmCloseBreakdown";
import ApproveSupplierNeed from "../../components/modal/approveSupplierNeed";
import ApproveRequestPurchase from "../../components/modal/approveRequestPurchase";
import ComfirmColseModal from "../workOrder/schedulePreventive/ComfirmColseModal";
import ComfirmReOpenModal from "../workOrder/schedulePreventive/ComfirmReOpenModal";
import Confirm from "../../components/modal/Confirm";
import ReopenBreakdown from "../workOrder/breakdown/ReopenBreakdown";
import { checkPermission } from "../../helper/permission-helper";
import { permissionCodeConstant } from "../../utils/permissionConstant";
import useAuth from "../../contexts/authContext";
import { useTranslation } from "react-i18next";
import SparePartsReview from "../workOrder/requiredSparePartsPrevetive/SparePartsReview";
import ComfirmCloseCalibrationWork from "../workOrder/calibrationWork/ComfirmCloseCalibrationWork";
import ComfirmReOpenCalibrationWork from "../workOrder/calibrationWork/ComfirmReOpenCalibrationWork";

const QuickApproval = ({ onTotalChange }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { permissions } = useAuth();
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(PAGINATION);
  const [totalRecord, setTotalRecord] = useState(0);
  const [isOpenModalApprover, setIsOpenModalApprover] = useState(false);
  const [
    isOpenModalApproverSchedulePrevetiveTask,
    setIsOpenModalApproverSchedulePrevetiveTask,
  ] = useState(false);
  const [breakdownSpare, setBreakdownSpare] = useState([]);
  const [
    schedulePrevetiveTaskReSparePart,
    setSchedulePrevetiveTaskReSparePart,
  ] = useState(null);
  const [isComfirmCloseBreakdown, setIsComfirmCloseBreakdown] = useState(false);
  const [breakdown, setBreakdown] = useState([]);
  const [isOpenModalSuppliesNeed, setIsOpenModalSuppliesNeed] = useState(false);
  const [isOpenModalRequestPurchase, setIsOpenRequestPurchase] =
    useState(false);
  const [suppliesNeedId, setSuppliedId] = useState();
  const [requestPurchaseId, setRequestPurchaseId] = useState();
  const [schedulePreventive, setSchedulePreventive] = useState(null);
  const [isOpenReOpen, setIsOpenReOpen] = useState(false);
  const [isOpenRecognize, setIsOpenRecognize] = useState(false);
  const [isReopenBreakdown, setIsReopenBreakdown] = useState(false);
  const [calibrationWork, setCalibrationWork] = useState("");
  const [isOpenReOpenCalibration, setIsOpenReOpenCalibration] = useState(false);
  const [isOpenRecognizeCalibration, setIsOpenRecognizeCalibration] = useState(false);
  useEffect(() => {
    getApproveWorks();
  }, [page]);

  const onChangePagination = (value) => {
    setPage(value);
  };

  const getApproveWorks = async () => {
    let payload = {
      page: page,
      limit: PAGINATION.limit,
    };
    const res = await _unitOfWork.report.getApproveWorks(payload);
    if (res && res.data) {
      setData(res.data.results);
      setTotalRecord(res.data.totalResults);
      onTotalChange?.(res.data.totalResults);
    }
  };

  const onClickClose = (value) => {
    setIsComfirmCloseBreakdown(true);
    setBreakdown(value);
  };

  const handleApproveSparePart = async (record) => {
    setBreakdownSpare(record);
    setIsOpenModalApprover(true);
  };

  const handleApproveSparePartSchedulePreventive = async (record) => {
    setSchedulePrevetiveTaskReSparePart(record);
    setIsOpenModalApproverSchedulePrevetiveTask(true);
  };

  const OpenModalSuppliesNeed = (id) => {
    setIsOpenModalSuppliesNeed(true);
    setSuppliedId(id);
  };

  const OpenModalRequestPurchase = (id) => {
    setIsOpenRequestPurchase(true);
    setRequestPurchaseId(id);
  };

  const onClickRecognize = (record) => {
    setIsOpenRecognize(true);
    setSchedulePreventive(record);
  };

  const onClickReOpen = (record) => {
    setIsOpenReOpen(true);
    setSchedulePreventive(record);
  };

  const onClickFix = async (value) => {
    const res =
      await _unitOfWork.breakdownAssignUser.comfirmBreakdownAssignUserFixed({
        breakdownAssignUser: value.sourceId,
      });
    if (res && res.code === 1) {
      getApproveWorks();
    }
  };

  const onClickReOpenCalibration = (record) => {
    setIsOpenReOpenCalibration(true);
    setCalibrationWork(record);
  };

  const onClickRecognizeCalibration = (record) => {
    setIsOpenRecognizeCalibration(true);
    setCalibrationWork(record);
  };

  const column = [
    {
      title: t("dashboard.quick.columns.index"),
      width: "60px",
      align: "center",
      render: (_text, _record, index) =>
        (page - 1) * PAGINATION.limit + index + 1,
    },
    {
      title: t("dashboard.quick.columns.title"),
      key: "title",
      dataIndex: "title",
      // render: (text, record) => {
      //   switch (text) {
      //     case "spare_request":
      //       return <span>{t("dashboard.quick.title.spare_request")}</span>;
      //     case "spare_request_schedule_preventive":
      //       return (
      //         <span>
      //           {t("dashboard.quick.title.spare_request_schedule_preventive")}
      //         </span>
      //       );
      //     case "close_breakdown":
      //       return <span>{t("dashboard.quick.title.close_breakdown")}</span>;
      //     case "supplies_need":
      //       return <span>{t("dashboard.quick.title.supplies_need")}</span>;
      //     case "purchase_request":
      //       return <span>{t("dashboard.quick.title.purchase_request")}</span>;
      //     case "schedule-preventive":
      //       return (
      //         <span>{t("dashboard.quick.title.schedule_preventive")}</span>
      //       );
      //     case "experimental-fix":
      //       return <span>{t("dashboard.quick.title.experimental_fix")}</span>;
      //     default:
      //       return <span>{t("dashboard.quick.unknown")}</span>;
      //   }
      // },
    },
    {
      title: t("dashboard.quick.columns.description"),
      key: "description",
      dataIndex: "description",
      // render: (text, record) => {
      //   switch (text) {
      //     case "spare_request":
      //       return (
      //         <span>
      //           {t("dashboard.quick.description.spare_request", {
      //             code: record.code,
      //           }) || "  "}
      //         </span>
      //       );
      //     case "spare_request_schedule_preventive":
      //       return (
      //         <span>
      //           {t(
      //             "dashboard.quick.description.spare_request_schedule_preventive",
      //             {
      //               code: record.code,
      //             }
      //           ) || "  "}
      //         </span>
      //       );
      //     case "close_breakdown":
      //       return (
      //         <span>
      //           {t("dashboard.quick.description.close_breakdown", {
      //             code: record.code,
      //           }) || "  "}
      //         </span>
      //       );
      //     case "supplies_need":
      //       return (
      //         <span>
      //           {t("dashboard.quick.description.supplies_need", {
      //             code: record.code,
      //           }) || "  "}
      //         </span>
      //       );
      //     case "purchase_request":
      //       return (
      //         <span>
      //           {t("dashboard.quick.description.purchase_request", {
      //             code: record.code,
      //           }) || "  "}
      //         </span>
      //       );
      //     case "schedule-preventive":
      //       return (
      //         <span>
      //           {t("dashboard.quick.description.schedule_preventive", {
      //             code: record.code,
      //           }) || "  "}
      //         </span>
      //       );
      //     case "experimental-fix":
      //       return (
      //         <span>
      //           {t("dashboard.quick.description.experimental_fix", {
      //             code: record.code,
      //           }) || "  "}
      //         </span>
      //       );
      //     default:
      //       return <span>{t("dashboard.quick.unknown")}</span>;
      //   }
      // },
    },
    {
      title: t("dashboard.quick.columns.action"),
      align: "center",
      dataIndex: "sourceType",
      width: 150,

      render: (text, record) => {
        switch (text) {
          case "spare_request_breakdown":
            return (
              <>
                {checkPermission(
                  permissions,
                  permissionCodeConstant.spare_approve
                ) && (
                    <Tooltip title={t("dashboard.quick.tooltips.approve_spare")}>
                      <Button
                        onClick={() => handleApproveSparePart(record.data)}
                        icon={<CheckCircleOutlined />}
                        style={{ marginRight: 8 }}
                        size="small"
                        type="primary"
                      />
                    </Tooltip>
                  )}
                {checkPermission(
                  permissions,
                  permissionCodeConstant.spare_view_list
                ) && (
                    <Tooltip
                      title={t("dashboard.quick.tooltips.goto_spare_approve")}
                    >
                      <Button
                        onClick={() =>
                          window.open(
                            `${staticPath.breakdownSpareRequest}`,
                            "_blank"
                          )
                        }
                        icon={<RightSquareOutlined />}
                        type="default"
                        size="small"
                      />
                    </Tooltip>
                  )}
              </>
            );
          case "spare_request_schedule_preventive":
            return (
              <>
                <Tooltip
                  title={t(
                    "dashboard.quick.title.spare_request_schedule_preventive"
                  )}
                >
                  <Button
                    onClick={() =>
                      handleApproveSparePartSchedulePreventive(record.data)
                    }
                    icon={<CheckCircleOutlined />}
                    style={{ marginRight: 8 }}
                    size="small"
                    type="primary"
                  />
                </Tooltip>
              </>
            );
          case "close_breakdown":
            return (
              <>
                {checkPermission(
                  permissions,
                  permissionCodeConstant.breakdown_close_and_reopen
                ) && (
                    <>
                      <Tooltip
                        title={t("dashboard.quick.tooltips.close_breakdown")}
                      >
                        <Button
                          onClick={() => onClickClose(record.data)}
                          icon={<CloseCircleOutlined />}
                          style={{ marginRight: 8 }}
                          size="small"
                          type="primary"
                        />
                      </Tooltip>

                      <Tooltip
                        title={t("dashboard.quick.tooltips.reopen_breakdown")}
                      >
                        <Button
                          onClick={() => setIsReopenBreakdown(true)}
                          icon={<FolderOpenOutlined />}
                          style={{ marginRight: 8 }}
                          size="small"
                          type="primary"
                        />
                      </Tooltip>
                    </>
                  )}
                {checkPermission(
                  permissions,
                  permissionCodeConstant.breakdown_view_list
                ) && (
                    <Tooltip
                      title={t("dashboard.quick.tooltips.goto_breakdown_approve")}
                    >
                      <Button
                        onClick={() =>
                          window.open(
                            `${staticPath.workOrderBreakdown}?ticketStatus=completed`,
                            "_blank"
                          )
                        }
                        icon={<RightSquareOutlined />}
                        type="default"
                        size="small"
                      />
                    </Tooltip>
                  )}
              </>
            );
          case "supplies_need":
            return (
              <>
                {checkPermission(
                  permissions,
                  permissionCodeConstant.material_request_approve
                ) && (
                    <Tooltip
                      title={t(
                        "dashboard.quick.tooltips.approve_material_request"
                      )}
                    >
                      <Button
                        onClick={() => OpenModalSuppliesNeed(record.sourceId)}
                        icon={<ShoppingOutlined />}
                        style={{ marginRight: 8 }}
                        size="small"
                        type="primary"
                      />
                    </Tooltip>
                  )}
                {checkPermission(
                  permissions,
                  permissionCodeConstant.material_request_view
                ) && (
                    <Tooltip
                      title={t("dashboard.quick.tooltips.goto_material_request")}
                    >
                      <Button
                        onClick={() =>
                          window.open(staticPath.suppliesNeed, "_blank")
                        }
                        icon={<RightSquareOutlined />}
                        type="default"
                        size="small"
                      />
                    </Tooltip>
                  )}
              </>
            );
          case "purchase_request":
            return (
              <>
                {checkPermission(
                  permissions,
                  permissionCodeConstant.purchase_request_approve
                ) && (
                    <Tooltip
                      title={t(
                        "dashboard.quick.tooltips.approve_purchase_request"
                      )}
                    >
                      <Button
                        onClick={() => OpenModalRequestPurchase(record.sourceId)}
                        icon={<FileDoneOutlined />}
                        style={{ marginRight: 8 }}
                        size="small"
                        type="primary"
                      />
                    </Tooltip>
                  )}
                {checkPermission(
                  permissions,
                  permissionCodeConstant.purchase_request_view
                ) && (
                    <Tooltip
                      title={t("dashboard.quick.tooltips.goto_purchase_request")}
                    >
                      <Button
                        onClick={() =>
                          window.open(staticPath.requestPurchase, "_blank")
                        }
                        icon={<RightSquareOutlined />}
                        type="default"
                        size="small"
                      />
                    </Tooltip>
                  )}
              </>
            );
          case "preventive":
            return (
              <>
                {checkPermission(
                  permissions,
                  permissionCodeConstant.schedule_preventive_close_or_reopen
                ) && (
                    <>
                      <Tooltip
                        title={t(
                          "dashboard.quick.tooltips.close_schedule_preventive"
                        )}
                      >
                        <Button
                          type="primary"
                          icon={<CheckSquareOutlined />}
                          size="small"
                          onClick={() => onClickRecognize(record.data)}
                          className="ml-2"
                        />
                      </Tooltip>
                      <Tooltip
                        title={t(
                          "dashboard.quick.tooltips.reopen_schedule_preventive"
                        )}
                      >
                        <Button
                          type="primary"
                          icon={<FolderOpenOutlined />}
                          size="small"
                          onClick={() => onClickReOpen(record.data)}
                          className="ml-2"
                        />
                      </Tooltip>
                    </>
                  )}
                {checkPermission(
                  permissions,
                  permissionCodeConstant.schedule_preventive_view_list
                ) && (
                    <Tooltip
                      title={t(
                        "dashboard.quick.tooltips.goto_schedule_preventive"
                      )}
                    >
                      <Button
                        className="ml-2"
                        size="small"
                        onClick={() =>
                          window.open(
                            `${staticPath.workSchedulePreventive}?ticketStatus=inProgress`,
                            "_blank"
                          )
                        }
                        icon={<RightSquareOutlined />}
                        type="default"
                      />
                    </Tooltip>
                  )}
              </>
            );
          case "trial_repair_approval":
            return (
              <>
                {checkPermission(
                  permissions,
                  permissionCodeConstant.breakdown_experimental_fix
                ) && (
                    <Tooltip
                      title={t(
                        "dashboard.quick.tooltips.experimental_fix_success"
                      )}
                    >
                      <Button
                        type="primary"
                        icon={<CheckSquareOutlined />}
                        size="small"
                        onClick={() =>
                          Confirm(
                            t("dashboard.quick.confirm.experimental_fix"),
                            () => onClickFix(record)
                          )
                        }
                        className="ml-2"
                      />
                    </Tooltip>
                  )}
                {checkPermission(
                  permissions,
                  permissionCodeConstant.breakdown_view_list
                ) && (
                    <Tooltip title={t("dashboard.quick.tooltips.goto_breakdown")}>
                      <Button
                        className="ml-2"
                        size="small"
                        onClick={() =>
                          window.open(
                            `${staticPath.workSchedulePreventive}?ticketStatus=inProgress`,
                            "_blank"
                          )
                        }
                        icon={<RightSquareOutlined />}
                        type="default"
                      />
                    </Tooltip>
                  )}
              </>
            );

          case "close_calibration":
            return (
              <>
                {checkPermission(
                  permissions,
                  permissionCodeConstant.calibration_work_close
                ) && (
                    <>
                      <Tooltip
                        title={t(
                          "dashboard.quick.tooltips.close_schedule_preventive"
                        )}
                      >
                        <Button
                          type="primary"
                          icon={<CheckSquareOutlined />}
                          size="small"
                          onClick={() => onClickRecognizeCalibration(record.data)}
                          className="ml-2"
                        />
                      </Tooltip>
                      <Tooltip
                        title={t(
                          "dashboard.quick.tooltips.reopen_schedule_preventive"
                        )}
                      >
                        <Button
                          type="primary"
                          icon={<FolderOpenOutlined />}
                          size="small"
                          onClick={() => onClickReOpenCalibration(record.data)}
                          className="ml-2"
                        />
                      </Tooltip>
                    </>
                  )}
                {/* {checkPermission(
                  permissions,
                  permissionCodeConstant.schedule_preventive_view_list
                ) && (
                    <Tooltip
                      title={t(
                        "dashboard.quick.tooltips.goto_schedule_preventive"
                      )}
                    >
                      <Button
                        className="ml-2"
                        size="small"
                        onClick={() =>
                          window.open(
                            `${staticPath.workSchedulePreventive}?ticketStatus=inProgress`,
                            "_blank"
                          )
                        }
                        icon={<RightSquareOutlined />}
                        type="default"
                      />
                    </Tooltip>
                  )} */}
              </>
            );
          default:
            return <span>{t("dashboard.quick.unknown")}</span>;
        }
      },
    },
  ];

  return (
    <Card>
      <Table
        columns={column}
        dataSource={data}
        bordered
        pagination={false}
      ></Table>
      <Pagination
        className="pagination-table mt-2"
        onChange={onChangePagination}
        pageSize={pagination.limit}
        total={totalRecord}
        current={page}
      />
      <ApproveSparePartModal
        open={isOpenModalApprover}
        onCancel={() => setIsOpenModalApprover(false)}
        data={breakdownSpare}
        onSubmit={() => {
          getApproveWorks();
          setIsOpenModalApprover(false);
        }}
      />
      <SparePartsReview
        open={isOpenModalApproverSchedulePrevetiveTask}
        onCancel={() => setIsOpenModalApproverSchedulePrevetiveTask(false)}
        data={schedulePrevetiveTaskReSparePart}
        onSubmit={() => {
          getApproveWorks();
          setIsOpenModalApproverSchedulePrevetiveTask(false);
        }}
      />
      <ComfirmCloseBreakdown
        open={isComfirmCloseBreakdown}
        onCancel={() => setIsComfirmCloseBreakdown(false)}
        breakdown={breakdown}
        onRefresh={getApproveWorks}
      />
      <ApproveSupplierNeed
        open={isOpenModalSuppliesNeed}
        handleClose={() => setIsOpenModalSuppliesNeed(false)}
        onfinish={() => {
          setIsOpenModalSuppliesNeed(false);
          getApproveWorks();
        }}
        id={suppliesNeedId}
      />

      <ApproveRequestPurchase
        open={isOpenModalRequestPurchase}
        handleClose={() => setIsOpenRequestPurchase(false)}
        onfinish={() => {
          setIsOpenRequestPurchase(false);
          getApproveWorks();
        }}
        id={requestPurchaseId}
      />
      <ComfirmReOpenModal
        open={isOpenReOpen}
        onCancel={() => setIsOpenReOpen(false)}
        schedulePreventive={schedulePreventive}
        onRefresh={getApproveWorks}
      />
      <ComfirmColseModal
        open={isOpenRecognize}
        onCancel={() => setIsOpenRecognize(false)}
        schedulePreventive={schedulePreventive}
        onRefresh={getApproveWorks}
      />
      <ReopenBreakdown
        open={isReopenBreakdown}
        onCancel={() => setIsReopenBreakdown(false)}
        breakdown={breakdown}
        onRefresh={getApproveWorks}
      />
      <ComfirmCloseCalibrationWork
        open={isOpenRecognizeCalibration}
        onClose={() => setIsOpenRecognizeCalibration(false)}
        calibrationWork={calibrationWork}
        onCallback={getApproveWorks}
      />
      <ComfirmReOpenCalibrationWork
        open={isOpenReOpenCalibration}
        onClose={() => setIsOpenReOpenCalibration(false)}
        calibrationWork={calibrationWork}
        onCallback={getApproveWorks}
      />
    </Card>
  );
};

export default QuickApproval;
