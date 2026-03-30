import { useEffect, useRef, useState } from "react";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  FilterOutlined,
  LogoutOutlined,
  MoreOutlined,
  PauseCircleOutlined,
  PlusCircleFilled,
  PlusCircleOutlined,
  PlusOutlined,
  RedoOutlined,
  SearchOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
  SwapOutlined,
  TransactionOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  Dropdown,
  Form,
  Input,
  Pagination,
  Row,
  Select,
  Table,
  Tag,
  Tooltip,
} from "antd";
import * as _unitOfWork from "../../../api";
import Comfirm from "../../../components/modal/Confirm";
import { useNavigate } from "react-router-dom";
import ShowSuccess from "../../../components/modal/result/successNotification";
import "./Preventive.scss";
import {
  assetType,
  PAGINATION,
  preventiveStatus,
  priorityType,
  ScheduleBasedOnType,
} from "../../../utils/constant";
import { parseToLabel } from "../../../helper/parse-helper";
import { staticPath } from "../../../router/routerConfig";
import ComfirmStart from "./ComfirmStart";
import useHeader from "../../../contexts/headerContext";
import ExpandRowPreventiveAssignUser from "../../../components/modal/preventive/ExpandRowPreventiveAssignUser";
import { pdf } from "@react-pdf/renderer";
import PdfScheduleExport from "./PdfScheduleExport";
import useAuth from "../../../contexts/authContext";
import { checkPermission } from "../../../helper/permission-helper";
import { permissionCodeConstant } from "../../../utils/permissionConstant";
import { useTranslation } from "react-i18next";
import DrawerSearchPreventive from "../../../components/drawer/drawerSearchPreventive";
import { LabelValue } from "../../../helper/label-value";
import { cleanEmptyValues } from "../../../helper/check-search-value";

export default function Preventive() {
  const { t } = useTranslation();
  const [preventives, setPreventives] = useState([]);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const [totalRecord, setTotalRecord] = useState(0);
  const [searchForm] = Form.useForm();
  const [preventive, setPreventive] = useState([]);
  const [isComfirmStart, setIsComfirmStart] = useState(false);
  const [sortOrder, setSortOrder] = useState(-1);
  const [sortBy, setSortBy] = useState("createdAt");
  const { setHeaderTitle } = useHeader();
  const [isOpenSearchaAvanced, setIsisOpenSearchaAvanced] = useState(false);
  const { permissions } = useAuth();
  const [searchField, setSearchField] = useState("searchText");
  const [searchFilter, setSearchFilter] = useState({});
  const drawerRef = useRef();

  useEffect(() => {
    setHeaderTitle(t("preventive.list.title"));
  }, [t, setHeaderTitle]);

  useEffect(() => {
    if (page > 1) {
      fetchGetListPreventive(page, searchFilter);
    } else {
      fetchGetListPreventive(1, searchFilter);
    }
  }, [page, sortBy, sortOrder]);

  const onChangePagination = (value) => {
    setPage(value);
  };
  const resetSearch = () => {
    setSearchFilter({});
    if (drawerRef.current) drawerRef.current.resetForm();
    searchForm.resetFields();
    setPage(1);
    fetchGetListPreventive(1);
  };
  const onReset = () => {
    setPage(1);
    fetchGetListPreventive(1);
  };
  const fetchGetListPreventive = async (_page, value) => {
    const searchValue = searchForm.getFieldValue("searchValue");
    let payload = {
      page: _page || page,
      limit: PAGINATION.limit,
      sortBy,
      sortOrder,
      // ...searchForm.getFieldsValue(),
      ...cleanEmptyValues(value || {}),
      [searchField]: searchValue,
    };
    const res = await _unitOfWork.preventive.getListPreventives(payload);
    if (res && res.results && res.results?.results) {
      setPreventives(res.results?.results);
      setTotalRecord(res.results.totalResults);
    }
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
      fetchGetListPreventive(1, searchFilter);
    }
  };

  const onClickCreate = () => {
    navigate(staticPath.createPreventive);
  };
  const onClickStart = (value) => {
    setIsComfirmStart(true);
    setPreventive(value);
  };
  const onClickUpdate = (value) => {
    navigate(staticPath.updatePreventive + "/" + value._id);
  };
  const onClickViewDeltail = (value) => {
    navigate(staticPath.viewPreventive + "/" + value._id);
  };
  const onClickClone = (value) => {
    navigate(`${staticPath.updatePreventive}/${value._id}?mode=clone`);
  };
  const onClickChange = async (value) => {
    navigate(staticPath.changeOfContractPreventive + "/" + value._id);
  };

  const columns = [
    {
      title: t("preventive.list.table.index"),
      dataIndex: "id",
      key: "id",
      width: "60px",
      align: "center",

      render: (_text, record, index) => {
        const number = (page - 1) * PAGINATION.limit + index + 1;
        return <span>{number}</span>;
      },
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
          <span style={{ margin: "0 auto" }}>{t("calibration.info_calibration")}</span>

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
  const onSearch = () => {
    setPage(1);
    fetchGetListPreventive(1, searchFilter);
  };
  const onClickPDFExport = async (values) => {
    try {
      const blob = await pdf(<PdfScheduleExport data={values} />).toBlob();
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (err) {
      console.error("Export PDF error:", err);
    }
  };
  const placeholderMap = {
    searchText: t("preventive.common.all"),
    code: t("preventive.common.code"),
    preventiveName: t("preventive.list.table.plan_name"),
    serial: t("preventive.common.serial"),
    assetName: t("preventive.list.table.asset_name"),
    assetModelName: t("preventive.list.table.model"),
  };
  const sortOptions = [
    { value: "createdAt", label: t("preventive.buttons.sort_created_at") },
    { value: "updatedAt", label: t("preventive.buttons.sort_updated_at") },
  ];

  return (
    <div className="p-3">
      <Form
        labelWrap
        className="search-form"
        form={searchForm}
        layout="vertical"
        onFinish={onSearch}
      >
        <Row className="mb-1" gutter={32}>
          <Col span={8} className="mt-2">
            <Form.Item>
              <Input.Group compact>
                <Select
                  value={searchField}
                  style={{ width: "30%", height: 32, lineHeight: "32px" }}
                  onChange={(value) => {
                    setSearchField(value);
                    searchForm.setFieldValue("searchValue", "");
                  }}
                  options={[
                    { value: "searchText", label: t("preventive.common.all") },
                    { value: "code", label: t("preventive.common.code") },
                    {
                      value: "preventiveName",
                      label: t("preventive.list.table.plan_name"),
                    },
                    { value: "serial", label: t("preventive.common.serial") },
                    {
                      value: "assetName",
                      label: t("preventive.list.table.asset_name"),
                    },
                    {
                      value: "assetModelName",
                      label: t("preventive.list.table.model"),
                    },
                  ]}
                />

                <Form.Item name="searchValue" noStyle>
                  <Input
                    style={{ width: "70%", height: 32, lineHeight: "32px" }}
                    placeholder={placeholderMap[searchField]}
                  />
                </Form.Item>
              </Input.Group>
            </Form.Item>
          </Col>
          {/* </Row>
        <Row> */}
          <Col
            span={12}
            style={{ display: "flex", alignItems: "center", marginBottom: 3 }}
          >
            <Button type="primary" className="mr-2" htmlType="submit">
              <SearchOutlined />
              {t("preventive.buttons.search")}
            </Button>
            <Button className="bt-green mr-2" onClick={resetSearch}>
              <RedoOutlined />
              {t("preventive.buttons.reset")}
            </Button>

            {/* <Select
              value={sortBy}
              className="mr-2"
              onChange={(value) => setSortBy(value)}
            >
              <Select.Option value="createdAt">
                {t("preventive.buttons.sort_created_at")}
              </Select.Option>
              <Select.Option value="updatedAt">
                {t("preventive.buttons.sort_updated_at")}
              </Select.Option>
            </Select> */}

            <Dropdown
              className="mr-2"
              trigger={["click"]}
              menu={{
                items: sortOptions.map((opt) => ({
                  key: opt.value,
                  label: opt.label,
                  className: sortBy === opt.value ? "active-sort-item" : "",
                })),
                onClick: ({ key }) => setSortBy(key),
              }}
            >
              <Button icon={<SwapOutlined />} />
            </Dropdown>

            <Button
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
            ></Button>
            <Button
              title={t("preventive.buttons.advanced_search")}
              className="px-2 mr-2"
              onClick={() => setIsisOpenSearchaAvanced(true)}
            >
              <FilterOutlined style={{ fontSize: 20, cursor: "pointer" }} />
            </Button>
          </Col>
          <Col span={4} style={{ textAlign: "right" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: "16px",
              }}
            >
              {/* <Tooltip
                title={t("preventive.buttons.advanced_search")}
              >
                <FilterOutlined
                  style={{ fontSize: 20, cursor: "pointer" }}
                  onClick={() => setIsisOpenSearchaAvanced(true)}
                />
              </Tooltip> */}
              {checkPermission(
                permissions,
                permissionCodeConstant.preventive_create,
              ) && (
                <Button
                  className="mt-2"
                  key="1"
                  type="primary"
                  onClick={() => onClickCreate()}
                >
                  <PlusOutlined />
                  {t("preventive.buttons.create")}
                </Button>
              )}
            </div>
          </Col>
          <Col span={24} style={{ textAlign: "right" }}>
            <span style={{ fontWeight: 600, fontSize: "16px", marginRight: 5 }}>
              {t("preventive.common.total", { count: totalRecord })}
            </span>
          </Col>
        </Row>

        <Table
          rowKey="_id"
          columns={columns}
          key={"_id"}
          dataSource={preventives}
          bordered
          pagination={false}
          scroll={{ x: "max-content" }}
          expandable={{
            expandedRowRender: (record, index) => (
              <ExpandRowPreventiveAssignUser
                preventive={record}
                fetchGetListPreventive={fetchGetListPreventive}
              />
            ),
          }}
        ></Table>
        <DrawerSearchPreventive
          isOpen={isOpenSearchaAvanced}
          ref={drawerRef}
          onCallBack={(value) => {
            searchForm.resetFields(["searchValue"]);
            setSearchFilter(value);
            if (!value.isClose) {
              setPage(1);
              fetchGetListPreventive(1, value);
            }
          }}
          onClose={() => {
            setIsisOpenSearchaAvanced(false);
          }}
        />

        <Pagination
          className="pagination-table mt-2"
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
      </Form>
    </div>
  );
}
