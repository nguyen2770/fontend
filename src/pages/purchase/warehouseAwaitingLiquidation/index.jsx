import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  CloseCircleOutlined,
  EyeOutlined,
  FilterOutlined,
  RedoOutlined,
  ReloadOutlined,
  SearchOutlined,
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
  Space,
  Table,
  Tag,
  Tooltip,
} from "antd";
import {
  assetStatusOptions,
  assetStyleMap,
  assetType,
  PAGINATION,
} from "../../../utils/constant";
import * as _unitOfWork from "../../../api";
import { useNavigate } from "react-router-dom";
import { staticPath } from "../../../router/routerConfig";
import useHeader from "../../../contexts/headerContext";
import { parseToLabel } from "../../../helper/parse-helper";
import noImage from "../../../assets/images/no-image.png";
import dayjs from "dayjs";
import useAuth from "../../../contexts/authContext";
import { checkPermission } from "../../../helper/permission-helper";
import { permissionCodeConstant } from "../../../utils/permissionConstant";
import DrawerSearchAssetMaintenance from "../../../components/drawer/drawerSearchAssetMaintenance";
import { LabelValue } from "../../../helper/label-value";
import { cleanEmptyValues } from "../../../helper/check-search-value";
import ShowSuccess from "../../../components/modal/result/successNotification";
import ShowError from "../../../components/modal/result/errorNotification";
import Comfirm from "../../../components/modal/Confirm";
import CancelReason from "../../../components/modal/CancelReason";

export default function WarehouseAwaitingLiquidation() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const { setHeaderTitle } = useHeader();
  const [totalRecord, setTotalRecord] = useState(0);
  const [assetMaintenances, setAssetMaintenances] = useState([]);
  const [assetMaintenance, setAssetMaintenance] = useState([]);
  const [isOpenCancelReason, setIsOpenCancelReason] = useState(false);
  const [searchForm] = Form.useForm();
  const [isOpenDrawerSearch, setIsOpenDrawerSearch] = useState(false);
  const { permissions, companySetting } = useAuth();
  const [searchField, setSearchField] = useState("searchText");
  const [searchFilter, setSearchFilter] = useState({});
  const drawerRef = useRef();
  useEffect(() => {
    if (page > 1) fetchGetListAssetMiantenance(page, searchFilter);
    else fetchGetListAssetMiantenance(1, searchFilter);
  }, [page]);

  useEffect(() => {
    setHeaderTitle(t("Quản lý kho chờ thanh lý"));
  }, [t, setHeaderTitle]);

  const onChangePagination = (value) => {
    setPage(value);
  };

  const fetchGetListAssetMiantenance = async (_page, value) => {
    const searchValue = searchForm.getFieldValue("searchValue");
    let payload = {
      page: _page || page,
      limit: PAGINATION.limit,
      ...cleanEmptyValues(value || {}),
      [searchField]: searchValue,
      assetStatus: assetStatusOptions.PENDING_DISPOSAL,
    };
    const res =
      await _unitOfWork.assetMaintenance.getListAssetMaintenances(payload);
    if (res && res.results && res.results?.results) {
      setAssetMaintenances(
        res.results?.results?.map((item) => {
          const installationDate = item.installationDate
            ? dayjs(item.installationDate).add(7, "hour")
            : null;
          const assetAge = installationDate
            ? dayjs().diff(installationDate, "year")
            : null;
          return {
            ...item,
            installationDate,
            assetAge,
          };
        }),
      );
      setTotalRecord(res.results.totalResults);
    }
  };

  const onClickGoToView = (values) => {
    navigate(staticPath.viewAssetMaintenance + "/" + values.id);
  };
  const onSearch = () => {
    setPage(1);
    fetchGetListAssetMiantenance(1, searchFilter);
  };
  const resetSearch = () => {
    setSearchFilter({});
    if (drawerRef.current) drawerRef.current.resetForm();
    setPage(1);
    searchForm.resetFields();
    fetchGetListAssetMiantenance(1);
  };

  const onClickDisposalAsset = async (id, cancelReason, fileList) => {
    const res = await _unitOfWork.assetMaintenance.disposalAsset({
      id,
      fileList,
    });
    if (res) {
      ShowSuccess(
        "topRight",
        t("common.notifications"),
        t("common.messages.success.successfully"),
      );
      fetchGetListAssetMiantenance(page, searchFilter);
    } else {
      ShowError(
        "topRight",
        t("common.notifications"),
        t("common.errors.failed"),
      );
    }
  };
  const placeholderMap = {
    searchText:
      "Serial / Tên model / Tên tài sản / Mã tài sản / Nhà cung cấp / Phòng ban / Chi nhánh,...",
    code: t("preventive.common.code"),
    preventiveName: t("preventive.list.table.plan_name"),
    serial: t("preventive.common.serial"),
    assetName: t("preventive.list.table.asset_name"),
    assetModelName: t("preventive.list.table.model"),
  };

  const onClickUpdate = async (id) => {
    const res = await _unitOfWork.assetMaintenance.updateStatus({ id });
    if (res) {
      ShowSuccess(
        "topRight",
        t("common.notifications"),
        t("common.messages.success.successfully"),
      );
      fetchGetListAssetMiantenance(page, searchFilter);
    } else {
      ShowError(
        "topRight",
        t("common.notifications"),
        t("common.errors.failed"),
      );
    }
  }


  const columns = [
    {
      title: t("assetMaintenance.export.index"),
      dataIndex: "id",
      key: "id",
      width: "50px",
      align: "center",
      render: (_text, _record, index) =>
        (page - 1) * PAGINATION.limit + index + 1,
    },
    {
      title: t("assetMaintenance.list.title_info"),
      render: (text) => (
        <div>
          <LabelValue
            label={t("breakdown.list.columns.asset_type")}
            value={t(parseToLabel(assetType.Options, text?.assetStyle))}
          />
          <LabelValue
            label={t("breakdown.list.columns.asset_name")}
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
            label={t("breakdown.list.columns.model")}
            value={text?.assetModel?.assetModelName}
          />
        </div>
      ),
    },
    {
      title: "Định danh",
      // dataIndex: "assetMaintenance",
      render: (text, record) => (
        <div>
          <LabelValue
            label={t("assetMaintenance.list.table.asset_number")}
            value={record.assetNumber}
          />
          <LabelValue
            label={t("assetMaintenance.list.table.serial")}
            value={record.serial}
          />
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "assetStatus",
      align: "center",
      render: (status) => {
        const option = assetStatusOptions.Options.find(
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
      title: t("assetMaintenance.list.table.asset_age"),
      dataIndex: "assetAge",
      align: "center",
      render: (text, record) => record?.assetAge || 0,
    },
    {
      title: t("assetMaintenance.list.table.image"),
      dataIndex: "resource",
      align: "center",
      render: (text, record) => {
        return record?.resource ? (
          <img
            src={_unitOfWork.resource.getImage(record?.resource?.id)}
            alt="anhthietbi.atl"
            style={{
              width: 80,
              height: 60,
              objectFit: "cover",
            }}
          />
        ) : (
          <img
            src={noImage}
            alt="anhthietbi.atl"
            style={{
              width: 80,
              height: 60,
              objectFit: "cover",
            }}
          />
        );
      },
    },
    {
      title: t("assetMaintenance.table.action"),
      dataIndex: "action",
      align: "center",
      fixed: "right",
      render: (_, record) => {
        return (
          <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
            {/* nút xem chi tiết */}
            {checkPermission(
              permissions,
              permissionCodeConstant.asset_view_detail,
            ) && (
                <Tooltip title={t("assetMaintenance.actions.detail")}>
                  <Button
                    icon={<EyeOutlined />}
                    size="small"
                    onClick={() => onClickGoToView(record)}
                  />
                </Tooltip>
              )}
            {/* Mở lại  */}
            <Tooltip title={t("Mở lại")}>
              <Button
                icon={<ReloadOutlined />}
                size="small"
                onClick={() => Comfirm(t("Xác nhận mở lại tài sản"), () =>
                  onClickUpdate(record.id),
                )}

              />
            </Tooltip>

            {/* Thanh lý */}
            <Tooltip title={t("Thanh lý")}>
              <Button
                icon={<CloseCircleOutlined />}
                size="small"
                style={{ color: '#fa8c16' }}
                onClick={() => {
                  setIsOpenCancelReason(true);
                  setAssetMaintenance(record);
                }}

              />
            </Tooltip>
          </div>
        );
      },
    },
  ];

  return (
    <div className="p-3 pb-5">
      <Form
        labelWrap
        className="search-form"
        form={searchForm}
        layout="vertical"
        onFinish={onSearch}
      >
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item style={{ marginBottom: 0 }}>
              <Input.Group compact>
                <Select
                  value={searchField}
                  style={{ width: "35%" }}
                  onChange={(value) => {
                    setSearchField(value);
                    searchForm.setFieldValue("searchValue", "");
                  }}
                  options={[
                    { value: "searchText", label: t("preventive.common.all") },
                    {
                      value: "assetNumber",
                      label: t("assetMaintenance.list.table.asset_number"),
                    },
                    {
                      value: "assetName",
                      label: t("assetMaintenance.list.table.asset_name"),
                    },
                    {
                      value: "serial",
                      label: t("assetMaintenance.list.table.serial"),
                    },
                  ]}
                />
                <Form.Item name="searchValue" noStyle>
                  <Input
                    style={{ width: "65%" }}
                    placeholder={placeholderMap[searchField]}
                  />
                </Form.Item>
              </Input.Group>
            </Form.Item>
          </Col>

          <Col span={8}>
            <Space>
              <Button type="primary" htmlType="submit">
                <SearchOutlined />
                {t("common.buttons.search")}
              </Button>
              <Button className="bt-green" onClick={resetSearch}>
                <RedoOutlined />
                {t("common.buttons.reset")}
              </Button>
              <Button
                title={t("assetMaintenance.actions.advanced_search")}
                className="px-2 mr-2"
                onClick={() => setIsOpenDrawerSearch(true)}
              >
                <FilterOutlined style={{ fontSize: 20, cursor: "pointer" }} />
              </Button>
            </Space>
          </Col>
          <Col span={24} style={{ textAlign: "right" }}>
            <span
              className="total-record-table"
              style={{ fontWeight: 600, fontSize: "16px" }}
            >
              {t("assetMaintenance.list.total", { count: totalRecord })}
            </span>
          </Col>
        </Row>
        <Table
          rowKey="id"
          columns={columns}
          key={"id"}
          dataSource={assetMaintenances}
          bordered
          pagination={false}
          scroll={{ x: "max-content" }}
        ></Table>
        <Pagination
          className="pagination-table mt-2 mb-3"
          onChange={onChangePagination}
          pageSize={PAGINATION.limit}
          total={totalRecord}
          current={page}
        />
      </Form>
      <DrawerSearchAssetMaintenance
        isOpen={isOpenDrawerSearch}
        onClose={() => setIsOpenDrawerSearch(false)}
        ref={drawerRef}
        onCallBack={(value) => {
          searchForm.resetFields(["searchValue"]);
          setSearchFilter(value);
          if (!value.isClose) {
            setPage(1);
            fetchGetListAssetMiantenance(1, value);
          }
        }}
      />

      <CancelReason
        open={isOpenCancelReason}
        close={() => setIsOpenCancelReason(false)}
        onFinish={(cancelReason, fileList) => {
          onClickDisposalAsset(assetMaintenance.id, cancelReason, fileList);
        }}
      // cancelReason={assetMaintenance.cancelReason}
      // type={type}
      ></CancelReason>
    </div>
  );
}
