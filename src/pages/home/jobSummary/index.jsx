import React, { useEffect, useRef, useState } from "react";
import {
  CheckCircleOutlined,
  CheckSquareOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeFilled,
  FilePdfOutlined,
  FolderOpenOutlined,
  HourglassOutlined,
  MoreOutlined,
  PlusCircleOutlined,
  RedoOutlined,
  SearchOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
  UserAddOutlined,
  WechatWorkOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  DatePicker,
  Dropdown,
  Form,
  Pagination,
  Row,
  Select,
  Table,
  Tooltip,
} from "antd";
import * as _unitOfWork from "../../../api";
import Comfirm from "../../../components/modal/Confirm";
import { useNavigate } from "react-router-dom";
import ShowSuccess from "../../../components/modal/result/successNotification";
import {
  assetType,
  breakdownStatus,
  breakdownTicketStatus,
  breakdownUserStatus,
  calibrationWorkStatus,
  jobSummaryStatus,
  jobSummaryType,
  PAGINATION,
  schedulePreventiveStatus,
  ticketSchedulePreventiveStatus,
} from "../../../utils/constant";
import { parseToLabel } from "../../../helper/parse-helper";
import { staticPath } from "../../../router/routerConfig";
import ExpandRowBreakdownAssignUser from "../../../components/modal/breakdownModel/ExpandRowBreakdownAssignUser";
import { parseDate } from "../../../helper/date-helper";
import useBreakdown from "../../../contexts/breakdownContext";
import useAuth from "../../../contexts/authContext";
import { checkPermission } from "../../../helper/permission-helper";
import { permissionCodeConstant } from "../../../utils/permissionConstant";
import { cleanEmptyValues } from "../../../helper/check-search-value";
import { useTranslation } from "react-i18next";
import { LabelValue } from "../../../helper/label-value";
import ShowError from "../../../components/modal/result/errorNotification";
import dayjs from "dayjs";
import ExpandRowCalibrationWorkAssignUser from "../../workOrder/calibrationWork/ExpandRowCalibrationWorkAssignUser";
import ExpandRowSchedulePreventiveAssignUser from "../../../components/modal/schedulePreventive/ExpandRowSchedulePreventiveAssignUser.";
import AssignUser from "../../workOrder/breakdown/AssignUser";
import ComfirmCancelBreakdown from "../../workOrder/breakdown/ComfirmCancelBreakdown";
import ComfirmCloseBreakdown from "../../workOrder/breakdown/ComfirmCloseBreakdown";
import ReopenBreakdown from "../../workOrder/breakdown/ReopenBreakdown";
import ComfirmReOpenModal from "../../workOrder/schedulePreventive/ComfirmReOpenModal";
import ComfirmColseModal from "../../workOrder/schedulePreventive/ComfirmColseModal";
import ComfirmCancelSchdulePreventive from "../../workOrder/schedulePreventive/ComfirmCancelSchdulePreventive";
import ComfirmReOpenCalibrationWork from "../../workOrder/calibrationWork/ComfirmReOpenCalibrationWork";
import ComfirmCloseCalibrationWork from "../../workOrder/calibrationWork/ComfirmCloseCalibrationWork";
import { filterOption } from "../../../helper/search-select-helper";
import ViewWorkingTime from "../../workOrder/breakdown/ViewWorkingTime";
import UpdateBreakdown from "../../workOrder/breakdown/UpdateBreakdown";
import CloneBreakdown from "../../workOrder/breakdown/CloneBreakdown";
import ViewWorkingTimeSC from "../../../components/modal/schedulePreventive/ViewWorkingTime";
export default function JobSummary() {
  const { t } = useTranslation();
  const { valueSearchBreakdown, setValueSearchBreakdown } = useBreakdown();
  const [jobSummarys, setJobSummarys] = useState([]);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const [totalRecord, setTotalRecord] = useState(0);
  const [searchForm] = Form.useForm();
  const [isOpenAssignUser, setIsOpenAssignUser] = useState(false);
  const [assignUser, setAssignUser] = useState([]);
  const [sortOrder, setSortOrder] = useState(-1);
  const [isOpenSearchaAvanced, setIsisOpenSearchaAvanced] = useState(false);
  const { permissions } = useAuth();
  const [searchField, setSearchField] = useState("searchText");
  const [searchFilter, setSearchFilter] = useState({});
  const drawerRef = useRef();
  const [jobSummary, setJobSummary] = useState("");
  const [isComfirmCancelBreakdown, setIsComfirmCancelBreakdown] =
    useState(false);
  const [isComfirmCloseBreakdown, setIsComfirmCloseBreakdown] = useState(false);
  const [isReopenBreakdown, setIsReopenBreakdown] = useState(false);
  const [isOpenReOpen, setIsOpenReOpen] = useState(false);
  const [isOpenRecognize, setIsOpenRecognize] = useState(false);
  const [isShowCancelConfirm, setIsShowCancelConfirm] = useState(false);
  const [isOpenReOpenCalibrationWork, setIsOpenReOpenCalibrationWork] =
    useState(false);
  const [isOpenAssignUserCalibrationWork, setIsOpenAssignUserCalibrationWork] =
    useState(false);
  const [calibrationWorkAssignUser, setCalibrationWorkAssignUser] =
    useState("");
  const [isOpenCloseCalibrationWork, setIsOpenCloseCalibrationWork] =
    useState(false);

  const [breakdownId, setBreakdownId] = useState([]);
  const [breakdown, setBreakdown] = useState([]);
  const [isOpenViewWorkingTime, setIsOpenViewWorkingTime] = useState(false);
  const [workingTime, setWorkingTime] = useState(null);
  const [isOpenViewDownTime, setIsOpenViewDownTime] = useState(false);
  const [downTime, setDownTime] = useState(null);
  const [isOpenUpdate, setIsOpenUpdate] = useState(false);
  const [subBreakdowns, setSubBreakdowns] = useState();
  const [isOpenClone, setIsOpenClone] = useState(false);
  useEffect(() => {
    if (valueSearchBreakdown) {
      searchForm.setFieldsValue(valueSearchBreakdown);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (page > 1) {
      fetchGetJobSummarys(page, searchFilter);
    } else {
      fetchGetJobSummarys(1, searchFilter);
    }
  }, [page, sortOrder]); // eslint-disable-line react-hooks/exhaustive-deps

  const resetSearch = () => {
    setSearchFilter({});
    if (drawerRef.current) drawerRef.current.resetForm();
    searchForm.resetFields();
    setPage(1);
    fetchGetJobSummarys(1);
  };

  const fetchGetJobSummarys = async (customPage, value) => {
    const values = searchForm.getFieldsValue();
    if (values.startDate === null || values.endDate === null) {
      ShowError(
        "topRight",
        t("common.notifications"),
        t("Vui lòng đầy đủ giờ"),
      );
      return;
    }
    let payload = {
      ...cleanEmptyValues(value || {}),
      [searchField]: values.searchValue,
      page: customPage || page,
      limit: PAGINATION.limit,
      sortBy: "createdAt",
      sortOrder: sortOrder,
      ...values,
    };

    const res = await _unitOfWork.jobSummary.getJobSummary(payload);
    if (res && res.code === 1) {
      setJobSummarys(res?.data);
      setTotalRecord(res?.totalResults);
    }
  };
  const onChangePagination = (value) => {
    setPage(value);
  };
  const onRefresh = () => {
    fetchGetJobSummarys(page);
  };
  const onClickAssginUser = (value) => {
    setIsOpenAssignUser(true);
    setAssignUser(value);
  };
  const onClickComfirmCancel = (values) => {
    setJobSummary(values);
    setIsComfirmCancelBreakdown(true);
  };
  const onClickReopen = (value) => {
    setIsReopenBreakdown(true);
    setJobSummary(value);
  };
  const onClickReOpenSchedulePreventive = (record) => {
    setIsOpenReOpen(true);
    setJobSummary(record);
  };
  const onClickRecognizeSchedulePreventive = (record) => {
    setIsOpenRecognize(true);
    setJobSummary(record);
  };
  const onClickClose = (value) => {
    setIsComfirmCloseBreakdown(true);
    setJobSummary(value);
  };
  const onCancelSchedulePreventive = (record) => {
    setJobSummary(record);
    setIsShowCancelConfirm(true);
  };
  const onClickReOpenCalibrationWork = (record) => {
    setIsOpenReOpenCalibrationWork(true);
    setJobSummary(record);
  };
  const onClickViewAssignCalibrationWork = (record) => {
    setIsOpenAssignUserCalibrationWork(true);
    setCalibrationWorkAssignUser(record?.assignUsers);
    setJobSummary(record);
  };
  const onClickWorkingtime = (value) => {
    setWorkingTime(value);
    setIsOpenViewWorkingTime(true);
  };
  const onClickUpdateBreakdown = (values) => {
    setBreakdownId(values.id);
    setBreakdown(values);
    setIsOpenUpdate(true);
  };
  const onClickCloneBreakdown = (values) => {
    setBreakdownId(values.id);
    setBreakdown(values);
    setIsOpenClone(true);
  };
  const onDeleteCategoryBreakdown = async (values) => {
    const res = await _unitOfWork.breakdown.deleteBreakdown({
      id: values.id,
    });
    if (res && res.code === 1) {
      ShowSuccess(
        "topRight",
        t("common.notifications"),
        t("breakdown.list.messages.delete_success"),
      );
      fetchGetJobSummarys(1, searchFilter);
    }
  };

  const onClickDeleteCalibrationWork = async (value) => {
    let res = await _unitOfWork.calibrationWork.deleteCalibrationWorkById(
      value._id || value.id,
    );
    if (res && res.code === 1) {
      ShowSuccess(
        "topRight",
        t("preventiveSchedule.list.title"),
        t("preventive.messages.delete_success"),
      );
      setPage(1);
      fetchGetJobSummarys(1, searchFilter);
    }
  };
  const onClickDeleteSchedulePreventive = async (value) => {
    let res = await _unitOfWork.schedulePreventive.deleteSchedulePreventive({
      id: value._id || value.id,
    });
    if (res && res.code === 1) {
      ShowSuccess(
        "topRight",
        t("preventiveSchedule.list.title"),
        t("preventive.messages.delete_success"),
      );
      setPage(1);
      fetchGetJobSummarys(1, searchFilter);
    }
  };
  const onClickDowntimeSchedulePreventive = (value) => {
    setDownTime(value?.totalDownTimeSchedulePreventive);
    setIsOpenViewDownTime(true);
  };
  const onCancelCalibrationWork = async (record) => {
    let res =
      await _unitOfWork.calibrationWork.comfirmCancelCalibrationWorkById(
        record._id || record.id,
      );
    if (res && res.code === 1) {
      ShowSuccess(
        "topRight",
        t("common.notifications"),
        t("common.messages.success.successfully"),
      );
      setPage(1);
      fetchGetJobSummarys(1, searchFilter);
    }
  };
  const onClickCloseCalibrationWork = (record) => {
    setIsOpenCloseCalibrationWork(true);
    setJobSummary(record);
  };
  const onClicView = (value) => {
    if (value.jobType === jobSummaryType.BREAKDOWN) {
      navigate(
        staticPath.viewWorkOrderBreakdown + "/" + (value.id || value._id),
      );
    } else if (value.jobType === jobSummaryType.SCHEDULE_PREVENTIVE) {
      navigate(
        staticPath.viewSchedulePreventive + "/" + (value.id || value._id),
      );
    } else {
      navigate(staticPath.calibrationTaskView + "/" + (value.id || value._id));
    }
  };

  const onClickCommet = (value) => {
    if (value.jobType === jobSummaryType.BREAKDOWN) {
      navigate(staticPath.breakdownComment + "/" + (value.id || value._id));
    } else if (value.jobType === jobSummaryType.SCHEDULE_PREVENTIVE) {
      navigate(
        staticPath.schedulePreventiveComment + "/" + (value.id || value._id),
      );
    } else {
      navigate(
        staticPath.calibrationWorkComment + "/" + (value.id || value._id),
      );
    }
  };
  const callbackAssignUser = async (value, selectedRowKeys) => {
    if (!selectedRowKeys || selectedRowKeys.length < 1) {
    }
    let res = await _unitOfWork.calibrationWork.assignUserCalibrationWork({
      user: selectedRowKeys[0],
      calibrationWork: jobSummary?._id || jobSummary?.id,
    });
    if (res && res.code === 1) {
      ShowSuccess(
        "topRight",
        t("common.notifications"),
        t("common.messages.success.assignment"),
      );
      setPage(1);
      fetchGetJobSummarys(1, searchFilter);
    } else {
      ShowError(
        "topRight",
        "common.notifications",
        t("common.messages.errors.assignment_failed"),
      );
    }
    setIsOpenAssignUserCalibrationWork(false);
  };
  const columns = [
    {
      title: t("breakdown.list.columns.stt"),
      dataIndex: "id",
      key: "id",
      width: "60px",
      align: "center",
      render: (_text, _record, index) =>
        (page - 1) * PAGINATION.limit + index + 1,
    },
    {
      title: t("jobSummaty.code"),
      dataIndex: "code",
      render: (text) => <span style={{ fontWeight: 600 }}>{text}</span>,
    },
    {
      title: t("jobSummaty.jobType"),
      dataIndex: "jobType",
      render: (text) => t(parseToLabel(jobSummaryType.Options, text)),
    },
    {
      title: t("assetMaintenance.list.title_info"),
      dataIndex: "assetMaintenance",
      render: (text) => (
        <div>
          <LabelValue
            label={t("breakdown.list.columns.asset_type")}
            value={t(parseToLabel(assetType.Options, text?.assetStyle))}
          />
          <LabelValue
            label={t("breakdown.list.columns.asset_name")}
            value={text?.assetModel?.asset?.assetName || text?.assetName}
          />
          <LabelValue
            label={t("breakdown.list.columns.model")}
            value={text?.assetModel?.assetModelName}
          />
          <LabelValue
            label={t("breakdown.list.columns.serial")}
            value={text?.serial}
          />
        </div>
      ),
    },
    {
      title: t("jobSummaty.job_status"),
      dataIndex: "status",
      align: "center",
      render: (status) => {
        const option = jobSummaryStatus.Options.find(
          (opt) => opt.value === status,
        );
        const label = option ? t(option.label) : status;
        const color = option?.color || "#d9d9d9";
        return (
          <span
            className="status-badge"
            style={{
              "--color": color,
            }}
          >
            {label}
          </span>
        );
      },
    },
    {
      title: t("jobSummaty.date_of_work"),
      align: "center",
      render: (_, record) => (
        <div>
          {record?.startDate
            ? parseDate(record?.startDate)
            : parseDate(record?.createdAt)}
        </div>
      ),
    },
    {
      title: t("breakdown.list.columns.action"),
      dataIndex: "action",
      fixed: "right",
      align: "center",
      render: (_, record) => {
        const items = [];

        if (record.jobType === jobSummaryType.BREAKDOWN) {
          // Downtime
          if (
            checkPermission(
              permissions,
              permissionCodeConstant.breakdown_view_downtime,
            ) &&
            record.workingTime &&
            record.status !== breakdownStatus.cancelled
          ) {
            items.push({
              key: "downtime",
              label: t("breakdown.list.tooltips.downtime"),
              icon: <HourglassOutlined />,
              onClick: () => onClickWorkingtime(record),
            });
          }

          // Update
          if (
            checkPermission(
              permissions,
              permissionCodeConstant.breakdown_update,
            ) &&
            record.ticketStatus === breakdownTicketStatus.new
          ) {
            items.push({
              key: "edit",
              label: t("breakdown.list.tooltips.edit"),
              icon: <EditOutlined />,
              onClick: () => onClickUpdateBreakdown(record),
            });
          }

          // Cancel ticket
          if (
            checkPermission(
              permissions,
              permissionCodeConstant.breakdown_cancel_ticket,
            ) &&
            ((record.ticketStatus === breakdownTicketStatus.new &&
              record.status !== breakdownUserStatus.accepted) ||
              (record.ticketStatus === breakdownTicketStatus.inProgress &&
                record.status === breakdownUserStatus.requestForSupport))
          ) {
            items.push({
              key: "cancel_ticket",
              label: t("breakdown.list.tooltips.cancel_ticket"),
              icon: <CloseCircleOutlined />,
              onClick: () => onClickComfirmCancel(record),
            });
          }

          if (
            checkPermission(
              permissions,
              permissionCodeConstant.breakdown_create,
            )
          ) {
            items.push({
              key: "clone",
              label: t("preventive.buttons.clone"),
              icon: <PlusCircleOutlined />,
              onClick: () => onClickCloneBreakdown(record),
            });
          }

          // Close / Reopen
          if (
            checkPermission(
              permissions,
              permissionCodeConstant.breakdown_close_and_reopen,
            ) &&
            record.status === breakdownUserStatus.WWA
          ) {
            items.push(
              {
                key: "close",
                label: t("breakdown.list.tooltips.close_ticket"),
                icon: <CheckCircleOutlined />,
                onClick: () => onClickClose(record),
              },
              {
                key: "reopen",
                label: t("breakdown.list.tooltips.reopen"),
                icon: <FolderOpenOutlined />,
                onClick: () => onClickReopen(record),
              },
            );
          }

          // Assign user
          if (
            checkPermission(
              permissions,
              permissionCodeConstant.breakdown_assign_engineer,
            ) &&
            record.ticketStatus === breakdownTicketStatus.new &&
            record.breakdownAssignUsers.length === 0
          ) {
            items.push({
              key: "assign_user",
              label: t("breakdown.list.tooltips.assign_user"),
              icon: <UserAddOutlined />,
              onClick: () => onClickAssginUser(record),
            });
          }

          // Comment
          if (
            checkPermission(
              permissions,
              permissionCodeConstant.breakdown_comment,
            )
          ) {
            items.push({
              key: "comment",
              label: t("breakdown.list.tooltips.comment"),
              icon: <WechatWorkOutlined />,
              onClick: () => onClickCommet(record),
            });
          }

          // Delete
          if (
            checkPermission(
              permissions,
              permissionCodeConstant.breakdown_delete,
            ) &&
            record.ticketStatus === breakdownTicketStatus.new &&
            record.status === breakdownStatus.new
          ) {
            items.push({
              key: "delete",
              label: t("breakdown.list.tooltips.delete"),
              icon: <DeleteOutlined />,
              onClick: () =>
                Comfirm(t("breakdown.common.confirm_delete"), () =>
                  onDeleteCategoryBreakdown(record),
                ),
            });
          }
        }
        if (record.jobType === jobSummaryType.SCHEDULE_PREVENTIVE) {
          // Export PDF
          // if (checkPermission(permissions, permissionCodeConstant.schedule_preventive_export_pdf)) {
          //   items.push({
          //     key: "export_pdf",
          //     label: t("preventiveSchedule.list.tooltips.export_pdf"),
          //     icon: <FilePdfOutlined />,
          //     onClick: () => onClickPDFExportSchedulePreventive(record),
          //   });
          // }

          // New -> cancel + delete
          if (record.ticketStatus === ticketSchedulePreventiveStatus.new) {
            if (
              checkPermission(
                permissions,
                permissionCodeConstant.schedule_preventive_cancel,
              )
            ) {
              items.push({
                key: "cancel",
                label: t("preventiveSchedule.list.tooltips.cancel"),
                icon: <CloseCircleOutlined />,
                onClick: () => onCancelSchedulePreventive(record),
              });
            }

            if (
              checkPermission(
                permissions,
                permissionCodeConstant.schedule_preventive_delete,
              )
            ) {
              items.push({
                key: "delete",
                label: t("preventiveSchedule.list.tooltips.delete"),
                icon: <DeleteOutlined />,
                onClick: () =>
                  Comfirm(
                    t("preventiveSchedule.list.tooltips.confirm_delete"),
                    () => onClickDeleteSchedulePreventive(record),
                  ),
              });
            }
          }

          // Downtime
          if (
            checkPermission(
              permissions,
              permissionCodeConstant.schedule_preventive_view_downtime,
            ) &&
            (record.status ===
              schedulePreventiveStatus.waitingForAdminApproval ||
              record.status === schedulePreventiveStatus.completed)
          ) {
            items.push({
              key: "downtime",
              label: t("preventiveSchedule.list.tooltips.downtime"),
              icon: <HourglassOutlined />,
              onClick: () => onClickDowntimeSchedulePreventive(record),
            });
          }

          // Close or reopen
          if (
            checkPermission(
              permissions,
              permissionCodeConstant.schedule_preventive_close_or_reopen,
            ) &&
            record.status === schedulePreventiveStatus.waitingForAdminApproval
          ) {
            items.push({
              key: "close",
              label: t("preventiveSchedule.list.tooltips.close"),
              icon: <CheckSquareOutlined />,
              onClick: () => onClickRecognizeSchedulePreventive(record),
            });

            items.push({
              key: "reopen",
              label: t("preventiveSchedule.list.tooltips.reopen"),
              icon: <FolderOpenOutlined />,
              onClick: () => onClickReOpenSchedulePreventive(record),
            });
          }

          // Comment
          if (
            checkPermission(
              permissions,
              permissionCodeConstant.schedule_preventive_comment,
            )
          ) {
            items.push({
              key: "comment",
              label: t("preventiveSchedule.list.tooltips.comment"),
              icon: <WechatWorkOutlined />,
              onClick: () => onClickCommet(record),
            });
          }
          // if (
          //   record.ticketStatus === ticketSchedulePreventiveStatus.new &&
          //   checkPermission(
          //     permissions,
          //     permissionCodeConstant.schedule_preventive_cancel
          //   )
          // ) {
          //   items.push({
          //     key: "cancel",
          //     label: t("preventiveSchedule.list.tooltips.cancel"),
          //     icon: <CloseCircleOutlined />,
          //     onClick: () => onCancelSchedulePreventive(record),
          //   });
          // }
          // // ddonsg   + mở lại
          // if (
          //   checkPermission(
          //     permissions,
          //     permissionCodeConstant.schedule_preventive_close_or_reopen
          //   ) &&
          //   record.status === schedulePreventiveStatus.waitingForAdminApproval
          // ) {
          //   items.push({
          //     key: "close",
          //     label: t("preventiveSchedule.list.tooltips.close"),
          //     icon: <CheckSquareOutlined />,
          //     onClick: () => onClickRecognize(record),
          //   });

          //   items.push({
          //     key: "reopen",
          //     label: t("preventiveSchedule.list.tooltips.reopen"),
          //     icon: <FolderOpenOutlined />,
          //     onClick: () => onClickReOpenSchedulePreventive(record),
          //   });
          // }
        }
        // caalibration WOrk
        if (record.jobType === jobSummaryType.CALIBRATION_WORK) {
          if (
            checkPermission(
              permissions,
              permissionCodeConstant.calibration_work_assign,
            ) &&
            record?.assignUsers &&
            record?.assignUsers < 1
          ) {
            items.push({
              key: "",
              onClick: () => onClickViewAssignCalibrationWork(record),
              label: <span>{t("common_buttons.assign")}</span>,
              icon: <UserAddOutlined />,
            });
          }
          // hủy
          if (
            checkPermission(
              permissions,
              permissionCodeConstant.calibration_work_cancel,
            ) &&
            record?.status === calibrationWorkStatus.new
          ) {
            items.push({
              key: "",
              onClick: () =>
                Comfirm(t("calibrationWork.comfirm.cancel"), () =>
                  onCancelCalibrationWork(record),
                ),
              label: <span>{t("common_buttons.cancel")}</span>,
              icon: <CloseCircleOutlined />,
            });
          }
          if (
            checkPermission(
              permissions,
              permissionCodeConstant.calibration_work_delete,
            )
          ) {
            items.push({
              key: "",
              onClick: () =>
                Comfirm(t("comfirm.comfirm_delete"), () =>
                  onClickDeleteCalibrationWork(record),
                ),
              label: <span>{t("common_buttons.delete")}</span>,
              icon: <DeleteOutlined />,
            });
          }

          if (
            checkPermission(
              permissions,
              permissionCodeConstant.calibration_work_commet,
            )
          ) {
            items.push({
              key: "",
              onClick: () => onClickCommet(record),
              label: (
                <span>{t("preventiveSchedule.list.tooltips.comment")}</span>
              ),
              icon: <WechatWorkOutlined />,
            });
          }
          // đóng + mở lại
          if (
            record.status === schedulePreventiveStatus.waitingForAdminApproval
          ) {
            if (
              checkPermission(
                permissions,
                permissionCodeConstant.calibration_work_close,
              )
            ) {
              items.push({
                key: "",
                onClick: () => onClickCloseCalibrationWork(record),
                label: (
                  <span>{t("preventiveSchedule.list.tooltips.close")}</span>
                ),
                icon: <CheckSquareOutlined />,
              });
            }
            if (
              checkPermission(
                permissions,
                permissionCodeConstant.calibration_work_reopen,
              )
            ) {
              items.push({
                key: "",
                onClick: () => onClickReOpenCalibrationWork(record),
                label: (
                  <span>{t("preventiveSchedule.list.tooltips.reopen")}</span>
                ),
                icon: <FolderOpenOutlined />,
              });
            }
          }
        }
        // // Comment
        // if (
        //   checkPermission(permissions, permissionCodeConstant.breakdown_comment)
        // ) {
        //   items.push({
        //     key: "comment",
        //     label: t("breakdown.list.tooltips.comment"),
        //     icon: <WechatWorkOutlined />,
        //     onClick: () => onClickCommet(record),
        //   });
        // }
        return (
          <div className="flex items-center justify-center">
            <Tooltip title={t("breakdown.list.tooltips.view")}>
              <Button
                icon={<EyeFilled />}
                size="small"
                className="ml-2"
                onClick={() => onClicView(record)}
              />
            </Tooltip>

            {/* Dropdown gom tất cả action còn lại */}
            {items.length > 0 && (
              <Dropdown trigger={["click"]} menu={{ items }}>
                <Button icon={<MoreOutlined />} size="small" className="ml-2" />
              </Dropdown>
            )}
          </div>
        );
      },
    },
  ];
  const onSearch = () => {
    setPage(1);
    fetchGetJobSummarys(1, searchFilter);
  };

  return (
    <div className="p-3">
      <Form
        labelWrap
        className="search-form"
        form={searchForm}
        layout="vertical"
        onFinish={onSearch}
        initialValues={{
          startDate: dayjs().startOf("day"),
          endDate: dayjs().endOf("day"),
          jobType: jobSummaryType.ALL,
        }}
      >
        <Row gutter={24}>
          <Col span={6}>
            <Form.Item
              name="startDate"
              label={t("orderPurchase.list.search.start_label")}
            >
              <DatePicker
                showTime={{ defaultValue: dayjs("00:00:00", "HH:mm:ss") }}
                format="DD/MM/YYYY HH:mm"
                style={{ width: "100%" }}
                allowClear
              />
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item
              name="endDate"
              label={t("orderPurchase.list.search.end_label")}
            >
              <DatePicker
                showTime={{ defaultValue: dayjs("23:59:59", "HH:mm:ss") }}
                format="DD/MM/YYYY HH:mm"
                style={{ width: "100%" }}
                allowClear
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="jobType" label={t("jobSummaty.type_of_work")}>
              <Select
                showSearch
                placeholder={t("jobSummaty.select_type_of_work")}
                options={(jobSummaryType.Options || []).map((item) => ({
                  value: item.value,
                  label: t(item.label),
                }))}
                filterOption={filterOption}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col
            span={12}
            style={{ display: "flex", alignItems: "center", marginBottom: 3 }}
          >
            <Button type="primary" className="mr-2" htmlType="submit">
              <SearchOutlined />
              {t("breakdown.common.search")}
            </Button>
            <Button className="bt-green mr-2" onClick={resetSearch}>
              <RedoOutlined />
              {t("breakdown.common.reset")}
            </Button>

            {/* <Button
              title={t("breakdown.common.advanced_search")}
              className="px-2 mr-2"
              onClick={() => setIsisOpenSearchaAvanced(true)}
            >
              <FilterOutlined style={{ fontSize: 20, cursor: "pointer" }} />
            </Button> */}
            {/* <Button
              icon={
                sortOrder === -1 ? (
                  <SortDescendingOutlined />
                ) : (
                  <SortAscendingOutlined />
                )
              }
              className="mr-2"
              onClick={() => {
                sortOrder === -1 ? setSortOrder(1) : setSortOrder(-1);
              }}
            ></Button> */}
          </Col>
          <Col span={24} style={{ textAlign: "right" }}>
            <span style={{ fontWeight: 600, fontSize: "16px", marginRight: 5 }}>
              {t("breakdown.common.total", {
                count: totalRecord ? totalRecord : 0,
              })}
            </span>
          </Col>
        </Row>
        <Table
          rowKey="_id"
          columns={columns}
          dataSource={jobSummarys}
          bordered
          pagination={false}
          scroll={{ x: "max-content" }}
          expandable={{
            expandedRowRender: (record) => {
              if (record.jobType === jobSummaryType.BREAKDOWN) {
                return (
                  <ExpandRowBreakdownAssignUser
                    breakdowns={record}
                    fetchGetJobSummarys={fetchGetJobSummarys}
                  />
                );
              } else if (record.jobType === jobSummaryType.CALIBRATION_WORK) {
                return (
                  <ExpandRowCalibrationWorkAssignUser
                    calibrationWork={record}
                    fetchGetListCalibrationWork={fetchGetJobSummarys}
                  />
                );
              } else if (
                record.jobType === jobSummaryType.SCHEDULE_PREVENTIVE
              ) {
                return (
                  <ExpandRowSchedulePreventiveAssignUser
                    schdulePreventive={record}
                    fetchGetListSchedulePreventive={fetchGetJobSummarys}
                  />
                );
              } else return;
            },

            // rowExpandable: (record) =>
            //   [jobSummaryType.BREAKDOWN, jobSummaryType.CALIBRATION].includes(
            //     record.jobType
            //   ),
          }}
        />
        <AssignUser
          open={isOpenAssignUser}
          hanldeColse={() => setIsOpenAssignUser(false)}
          assignUser={assignUser}
          onReset={onRefresh}
        />
        <ComfirmCancelBreakdown
          open={isComfirmCancelBreakdown}
          onCancel={() => setIsComfirmCancelBreakdown(false)}
          breakdown={jobSummary}
          onRefresh={onRefresh}
        />
        <ComfirmCloseBreakdown
          open={isComfirmCloseBreakdown}
          onCancel={() => setIsComfirmCloseBreakdown(false)}
          breakdown={jobSummary}
          onRefresh={onRefresh}
        />
        <ReopenBreakdown
          open={isReopenBreakdown}
          onCancel={() => setIsReopenBreakdown(false)}
          breakdown={jobSummary}
          onRefresh={onRefresh}
        />
        <ComfirmReOpenModal
          open={isOpenReOpen}
          onCancel={() => setIsOpenReOpen(false)}
          schedulePreventive={jobSummary}
          onRefresh={onRefresh}
        />
        <ComfirmColseModal
          open={isOpenRecognize}
          onCancel={() => setIsOpenRecognize(false)}
          schedulePreventive={jobSummary}
          onRefresh={onRefresh}
        />
        <ComfirmCancelSchdulePreventive
          open={isShowCancelConfirm}
          onCancel={() => setIsShowCancelConfirm(false)}
          schedulePreventive={jobSummary}
          onRefresh={onRefresh}
        />
        <ComfirmReOpenCalibrationWork
          open={isOpenReOpenCalibrationWork}
          onClose={() => setIsOpenReOpenCalibrationWork(false)}
          calibrationWork={jobSummary}
          onCallback={onRefresh}
        />
        <Pagination
          className="pagination-table mt-2"
          onChange={onChangePagination}
          pageSize={PAGINATION.limit}
          current={page}
          total={totalRecord}
        />
        <AssignUser
          open={isOpenAssignUserCalibrationWork}
          hanldeColse={() => setIsOpenAssignUserCalibrationWork(false)}
          assignUser={
            calibrationWorkAssignUser?.user?._id ||
            calibrationWorkAssignUser?.user?.id
          }
          onReset={onRefresh}
          callbackAssignUser={callbackAssignUser}
          selectMulti={false}
          noSelectContract={true}
        />
        <ComfirmCloseCalibrationWork
          open={isOpenCloseCalibrationWork}
          onClose={() => setIsOpenCloseCalibrationWork(false)}
          calibrationWork={jobSummary}
          onCallback={onRefresh}
        />
        <ViewWorkingTime
          open={isOpenViewWorkingTime}
          onCancel={() => setIsOpenViewWorkingTime(false)}
          workingTime={workingTime}
        />
        <ViewWorkingTimeSC
          open={isOpenViewDownTime}
          onCancel={() => setIsOpenViewDownTime(false)}
          workingTime={downTime}
        />
        <UpdateBreakdown
          open={isOpenUpdate}
          handleCancel={() => setIsOpenUpdate(false)}
          id={breakdownId}
          onRefresh={onRefresh}
          breakdown={breakdown}
          subBreakdowns={subBreakdowns}
        />
        <CloneBreakdown
          open={isOpenClone}
          handleCancel={() => setIsOpenClone(false)}
          onRefresh={onRefresh}
          breakdown={breakdown}
        />
      </Form>
    </div>
  );
}
