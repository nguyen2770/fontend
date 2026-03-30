import { Button, Dropdown, Pagination, Table, Tooltip } from "antd";
import "./index.scss";
import { parseToLabel } from "../../../../../helper/parse-helper";
import {
  PAGINATION,
  preventiveStatus,
  priorityType,
  ScheduleBasedOnType,
} from "../../../../../utils/constant";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  LogoutOutlined,
  MoreOutlined,
  PauseCircleOutlined,
  PlusCircleOutlined,
  TransactionOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import * as _unitOfWork from "../../../../../api";
import { useTranslation } from "react-i18next";
import { LabelValue } from "../../../../../helper/label-value";
import { checkPermission } from "../../../../../helper/permission-helper";
import { permissionCodeConstant } from "../../../../../utils/permissionConstant";
import useAuth from "../../../../../contexts/authContext";
import ComfirmStart from "../../../../workOrder/preventive/ComfirmStart";
import { staticPath } from "../../../../../router/routerConfig";
import { useNavigate } from "react-router-dom";
import ShowSuccess from "../../../../../components/modal/result/successNotification";
import Comfirm from "../../../../../components/modal/Confirm";

const ExpandRowPreventiveOfModel = ({ preventiveOfModel, assetModel }) => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [totalRecord, setTotalRecord] = useState(0);
  const [data, setData] = useState([]);
  const { permissions } = useAuth();
  const navigate = useNavigate();
  const [preventive, setPreventive] = useState({});
  const [isComfirmStart, setIsComfirmStart] = useState(false);

  useEffect(() => {
    fetchPreventives();
  }, [page, preventiveOfModel?.id]);

  const fetchPreventives = async () => {
    const res = await _unitOfWork.preventive.getListPreventives({
      preventiveOfModel: preventiveOfModel?.id,
      assetModel: assetModel,
      page,
      limit: PAGINATION.limit,
    });
    if (res && res?.code === 1) {
      setData(res?.results?.results);
      setTotalRecord(res?.results?.totalResults);
    }
  };
  const onChangePagination = (value) => {
    setPage(value);
  };
  const onClickViewDeltail = (value) => {
    navigate(staticPath.viewPreventive + "/" + value._id);
  };
  const onClickUpdate = (value) => {
    navigate(staticPath.updatePreventive + "/" + value._id);
  };
  const onClickChange = async (value) => {
    navigate(staticPath.changeOfContractPreventive + "/" + value._id);
  };
  const onClickClone = (value) => {
    navigate(`${staticPath.updatePreventive}/${value._id}?mode=clone`);
  };
  const onDeletePreventive = async (values) => {
    const res = await _unitOfWork.preventive.deletePreventive({
      id: values._id || values.id,
    });
    if (res && res.code === 1) {
      ShowSuccess(
        "topRight",
        t("preventive.list.title"),
        t("preventive.messages.delete_success"),
      );
      setPage(1);
      fetchPreventives();
    }
  };
  const onClickStart = (value) => {
    setIsComfirmStart(true);
    setPreventive(value);
  };
  const onReset = () => {
    setPage(1);
    fetchPreventives();
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
      title: (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <span style={{ margin: "0 auto" }}>
            {t("calibration.info_calibration")}
          </span>

          <Tooltip
            trigger="click"
            title={
              <div>
                {t("preventive.list.table.priority")}
                {priorityType.Option.map((opt) => (
                  <div
                    key={opt.value}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      marginBottom: 4,
                    }}
                  >
                    <span
                      style={{
                        display: "inline-block",
                        width: 12,
                        height: 12,
                        background: opt.color,
                        borderRadius: 3,
                      }}
                    />
                    <span>{t(opt.label)}</span>
                  </div>
                ))}
              </div>
            }
          >
            <ExclamationCircleOutlined
              style={{ fontSize: 16, color: "#faad14", cursor: "pointer" }}
            />
          </Tooltip>
        </div>
      ),
      dataIndex: "info",
      className: "text-bold",
      render: (text, record) => {
        const option = priorityType.Option.find(
          (opt) => opt.value === record?.importance,
        );
        const barColor = option?.color || "#ff4d4f";
        return (
          <div>
            <span className="priority-number" style={{ color: barColor }}>
              <LabelValue label={t("Code")} value={record?.code} />
            </span>
            <LabelValue
              label={t("preventive.list.table.plan_name")}
              value={record?.preventiveName}
            />
            <LabelValue
              label={t("preventive.list.table.schedule_based_on")}
              value={t(
                parseToLabel(ScheduleBasedOnType.Option, record?.scheduleType),
              )}
            />
          </div>
        );
      },
    },
    {
      title: t("assetMaintenance.list.title_info"),
      dataIndex: "assetMaintenance",
      render: (text) => (
        <div>
          <LabelValue
            label={t("preventive.list.table.asset_name")}
            value={
              <span
                style={{
                  display: "block",
                  maxWidth: 150,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {text?.assetModel?.asset?.assetName}
              </span>
            }
          />
          <LabelValue
            label={t("preventive.list.table.model")}
            value={text?.assetModel?.assetModelName}
          />
          <LabelValue
            label={t("preventive.list.table.serial")}
            value={text?.serial}
          />
          <LabelValue
            label={t("assetMaintenance.asset_number")}
            value={text?.assetNumber}
          />
        </div>
      ),
    },
    {
      title: t("preventiveSchedule.modal.map_title"),
      render: (text, record) => (
        <div>
          <LabelValue
            label={t("breakdown.map.fields.branch")}
            value={record?.assetMaintenance?.objectBranch?.name}
          />
          <LabelValue
            label={t("breakdown.map.fields.department")}
            value={record?.assetMaintenance?.objectDepartments?.departmentName}
          />
          <LabelValue
            label={t("preventive.list.table.customer")}
            value={record?.assetMaintenance?.customer?.customerName}
          />
        </div>
      ),
    },
    {
      title: t("preventive.common.status"),
      dataIndex: "status",
      align: "center",
      render: (status) => {
        const option = preventiveStatus.Options.find(
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
      title: t("preventive.common.action"),
      dataIndex: "action",
      fixed: "right",
      align: "center",
      render: (_, record) => {
        const items = [];

        if (
          checkPermission(
            permissions,
            permissionCodeConstant.preventive_view_detail,
          )
        ) {
          items.push({
            key: "view",
            onClick: () => onClickViewDeltail(record),
            label: <span>{t("preventiveSchedule.list.tooltips.view")}</span>,
            icon: <EyeOutlined />,
          });
        }
        // Thay đổi hợp đồng
        items.push({
          key: "change",
          onClick: () => onClickChange(record),
          label: <span>{t("preventive.buttons.edit_contract")}</span>,
          icon: <TransactionOutlined />,
        });

        // Update
        if (
          checkPermission(
            permissions,
            permissionCodeConstant.preventive_update,
          ) &&
          record.isStart === false
        ) {
          items.push({
            key: "update",
            onClick: () => onClickUpdate(record),
            label: <span>{t("preventive.buttons.edit")}</span>,
            icon: <EditOutlined />,
          });
        }

        if (
          checkPermission(permissions, permissionCodeConstant.preventive_create)
        ) {
          items.push({
            key: "clone",
            onClick: () => onClickClone(record),
            label: <span>{t("preventive.buttons.clone")}</span>,
            icon: <PlusCircleOutlined />,
          });
        }

        // Delete
        if (
          checkPermission(permissions, permissionCodeConstant.preventive_delete)
        ) {
          items.push({
            key: "delete",
            onClick: () =>
              Comfirm(t("preventive.list.confirm_delete"), () =>
                onDeletePreventive(record),
              ),
            label: <span>{t("preventive.buttons.delete")}</span>,
            icon: <DeleteOutlined />,
          });
        }

        return (
          <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
            {/* Nút Start / Stop */}
            {checkPermission(
              permissions,
              permissionCodeConstant.preventive_start_stop,
            ) && (
              <Tooltip
                title={
                  record.isStart
                    ? t("preventive.buttons.stop")
                    : t("preventive.buttons.start")
                }
              >
                <Button
                  type={record.isStart ? "default" : "primary"}
                  icon={
                    record.isStart ? (
                      <LogoutOutlined />
                    ) : (
                      <PauseCircleOutlined />
                    )
                  }
                  size="small"
                  onClick={() => onClickStart(record)}
                />
              </Tooltip>
            )}

            {/* More Dropdown */}
            {items.length > 0 && (
              <Dropdown
                menu={{ items }}
                placement="bottomRight"
                trigger={["click"]}
              >
                <Button icon={<MoreOutlined />} size="small" />
              </Dropdown>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <>
      <Table
        rowKey="id"
        className="paramater-asset-expand pl-3 pr-3 mb-2"
        columns={columnExpands}
        key={"id"}
        dataSource={data}
        bordered
        pagination={false}
      />
      <Pagination
        className="pagination-table mt-2 mb-3"
        onChange={onChangePagination}
        pageSize={PAGINATION.limit}
        total={totalRecord}
        current={page}
      />
      <ComfirmStart
        open={isComfirmStart}
        hanldeColse={() => setIsComfirmStart(false)}
        preventive={preventive}
        onReset={onReset}
      />
    </>
  );
};
export default ExpandRowPreventiveOfModel;
