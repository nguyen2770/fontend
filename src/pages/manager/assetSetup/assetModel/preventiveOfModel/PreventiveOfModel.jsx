import {
  ArrowLeftOutlined,
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  LogoutOutlined,
  MoreOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
  PlusCircleOutlined,
  PlusOutlined,
  TransactionOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Collapse,
  Dropdown,
  Form,
  Pagination,
  Row,
  Table,
  Tabs,
  Tooltip,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import * as _unitOfWork from "../../../../../api";
import { useTranslation } from "react-i18next";
import { staticPath } from "../../../../../router/routerConfig";
import {
  frequencyAllOptions,
  monitoringType,
  PAGINATION,
  preventiveStatus,
  priorityType,
  ScheduleBasedOnType,
} from "../../../../../utils/constant";
import { parseToLabel } from "../../../../../helper/parse-helper";
import Comfirm from "../../../../../components/modal/Confirm";
import ShowSuccess from "../../../../../components/modal/result/successNotification";
import AssetMaintenanceOfModel from "./AssetMaintenanceOfModel";
import ExpandRowPreventiveOfModel from "./ExpandRowPreventiveOfModel";
import Panel from "antd/es/splitter/Panel";
import { LabelValue } from "../../../../../helper/label-value";
import ComfirmStart from "../../../../workOrder/preventive/ComfirmStart";
import { permissionCodeConstant } from "../../../../../utils/permissionConstant";
import { checkPermission } from "../../../../../helper/permission-helper";
import useAuth from "../../../../../contexts/authContext";
const { Text } = Typography;
export default function PreventiveOfModel() {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [preventiveOfModels, setPreventiveOfModels] = useState([]);
  const [isOpenAsseMaintenancetModel, setIsOpenAssetMaintenanceModel] =
    useState(false);
  const [preventiveOfModel, setPreventiveOfModel] = useState("");
  const [otherPreventives, setOtherPreventives] = useState([]);
  const [pageOtherRecord, setPageOtherRecord] = useState(1);
  const [totalOtherRecord, setTotalOtherRecord] = useState(0);
  const [preventive, setPreventive] = useState({});
  const [isComfirmStart, setIsComfirmStart] = useState(false);
  const { permissions } = useAuth();

  useEffect(() => {
    fetchGetPreventiveOfModels();
    fetchOtherPreventives();
  }, []);

  const fetchGetPreventiveOfModels = async () => {
    let res = await _unitOfWork.preventiveOfModel.getListPreventiveOfModels({
      assetModel: params?.id,
    });
    if (res && res.code === 1) {
      setPreventiveOfModels(res?.preventiveOfModelWithTasks);
    }
  };
  const fetchOtherPreventives = async (_page) => {
    try {
      const res = await _unitOfWork.preventive.getListPreventives({
        assetModel: params?.id,
        isOtherPreventiveOfModel: true,
        page: _page || 1,
        limit: PAGINATION.limit,
      });

      if (res && res?.code === 1) {
        setOtherPreventives(res?.results?.results || []);
        setTotalOtherRecord(res?.results?.totalResults || 0);
      }
    } catch (error) {
      console.error("Lỗi khi lấy lịch bảo trì khác:", error);
    }
  };
  const onChangePagination = (value) => {
    setPageOtherRecord(value);
    fetchOtherPreventives(value);
  };
  const onViewCreate = () => {
    navigate(staticPath.cretaePreventiveOfModel + "/" + params?.id);
  };
  const onClickUpdate = (record) => {
    navigate(
      `${staticPath.updatePreventiveOfModel}/${
        record?.id || record?._id
      }?assetModel=${params?.id}`,
    );
  };
  const onClickDelete = async (record) => {
    const res = await _unitOfWork.preventiveOfModel.deletePreventiveOfModelById(
      {
        id: record._id || record.id,
      },
    );
    if (res && res.code === 1) {
      ShowSuccess(
        "topRight",
        t("preventive.list.title"),
        t("preventive.messages.delete_success"),
      );
      fetchGetPreventiveOfModels();
    }
  };
  const columns = [
    {
      title: t("preventive.list.table.index"),
      dataIndex: "id",
      key: "id",
      width: "60px",
      align: "center",
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
        // if (record?.scheduleType === ScheduleBasedOnType.Monitoring) {
        //   return t(parseToLabel(monitoringType.Options, record.monitoringType));
        // }
        const label = t(
          parseToLabel(frequencyAllOptions.Option, record?.frequencyType),
        );
        return record?.calenderFrequencyDuration
          ? ` ${record?.calenderFrequencyDuration} ${label}`
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
    {
      title: t("preventive.common.action"),
      dataIndex: "action",
      fixed: "right",
      align: "center",
      render: (_, record) => (
        <div>
          <Tooltip title={t("Bắt đầu lịch bảo trì")}>
            <Button
              type="primary"
              icon={<PlayCircleOutlined />}
              size="small"
              onClick={() => {
                setIsOpenAssetMaintenanceModel(true);
                setPreventiveOfModel(record);
              }}
              className="ml-2"
            />
          </Tooltip>
          <Tooltip title={t("preventive.buttons.edit")}>
            <Button
              type="primary"
              icon={<EditOutlined />}
              size="small"
              onClick={() => onClickUpdate(record)}
              className="ml-2"
            />
          </Tooltip>
          <Tooltip title={t("preventive.buttons.delete")}>
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              size="small"
              onClick={() =>
                Comfirm(t("assetModel.common.messages.confirm_delete"), () =>
                  onClickDelete(record),
                )
              }
              className="ml-2"
            />
          </Tooltip>
        </div>
      ),
    },
  ];
  const onClickViewDeltail = (value) => {
    navigate(staticPath.viewPreventive + "/" + value._id);
  };
  const onClickUpdatePreventive = (value) => {
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
      setPageOtherRecord(1);
      fetchOtherPreventives();
    }
  };
  const onClickStart = (value) => {
    setIsComfirmStart(true);
    setPreventive(value);
  };
  const onReset = () => {
    setPageOtherRecord(1);
    fetchOtherPreventives();
  };
  const otherPreventiveColumns = [
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
            onClick: () => onClickUpdatePreventive(record),
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
    <div className="content-manager">
      <Form
        labelWrap
        form={form}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
      >
        <Card
          title={t(`assetModel.model.title_preventive_of_model`, {
            assetModel: location.state?.record?.assetModelName || "",
          })}
          extra={
            <>
              <Button style={{ marginRight: 10 }} onClick={() => navigate(-1)}>
                <ArrowLeftOutlined />
                {t("assetModel.common.buttons.back")}
              </Button>
              <Button
                type="primary"
                style={{ marginRight: 10 }}
                onClick={onViewCreate}
              >
                <PlusCircleOutlined />
                {t("common_buttons.create")}
              </Button>
            </>
          }
        >
          <Table
            rowKey="id"
            columns={columns}
            dataSource={preventiveOfModels}
            bordered
            pagination={false}
            className="p-2"
            expandable={{
              expandedRowRender: (record, index) => (
                <ExpandRowPreventiveOfModel
                  preventiveOfModel={record}
                  assetModel={location.state?.record?.id}
                />
              ),
            }}
          />
          <Row className="p-3">
            <Col span={24}>
              <Collapse
                items={[
                  {
                    key: "1",
                    label: (
                      <Col span={24}>
                        <Text strong>
                          {t("Các lịch bảo trì khác của Model")}
                        </Text>
                      </Col>
                    ),
                    children: (
                      <Row style={{ width: "100%" }}>
                        <Col span={24}>
                          <Table
                            rowKey="_id"
                            dataSource={otherPreventives}
                            columns={otherPreventiveColumns}
                            pagination={false}
                            bordered
                            size="small"
                          />
                          <Pagination
                            className="pagination-table mt-2 mb-3"
                            onChange={onChangePagination}
                            pageSize={PAGINATION.limit}
                            total={totalOtherRecord}
                            current={pageOtherRecord}
                          />
                        </Col>
                      </Row>
                    ),
                  },
                ]}
                defaultActiveKey={["1"]}
              />
              <ComfirmStart
                open={isComfirmStart}
                hanldeColse={() => setIsComfirmStart(false)}
                preventive={preventive}
                onReset={onReset}
              />
            </Col>
          </Row>
        </Card>
      </Form>
      <AssetMaintenanceOfModel
        open={isOpenAsseMaintenancetModel}
        handleCancel={() => setIsOpenAssetMaintenanceModel(false)}
        form={form}
        onSelectAssetMaintenance={(assetMaintenances) => {}}
        assetModel={params?.id}
        preventiveOfModel={preventiveOfModel}
      />
    </div>
  );
}
