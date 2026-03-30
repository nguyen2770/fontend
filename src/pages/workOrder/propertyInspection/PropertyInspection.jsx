import React, { useEffect, useRef, useState } from "react";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  FilterOutlined,
  FormOutlined,
  MoreOutlined,
  PlusOutlined,
  RedoOutlined,
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
  Table,
  Tooltip,
} from "antd";
import {
  assetType,
  PAGINATION,
  propertyInspectionStatus,
} from "../../../utils/constant";
import * as _unitOfWork from "../../../api";
import Comfirm from "../../../components/modal/Confirm";
import useHeader from "../../../contexts/headerContext";
import { useTranslation } from "react-i18next";
import { LabelValue } from "../../../helper/label-value";
import { parseToLabel } from "../../../helper/parse-helper";
import { staticPath } from "../../../router/routerConfig";
import { useNavigate } from "react-router-dom";
import ShowSuccess from "../../../components/modal/result/successNotification";
import { parseDateHH } from "../../../helper/date-helper";
import DrawerSearchPropertyInspection from "../../../components/drawer/drawerSearchPropertyInspection";
import { cleanEmptyValues } from "../../../helper/check-search-value";
import useAuth from "../../../contexts/authContext";
import { checkPermission } from "../../../helper/permission-helper";
import { permissionCodeConstant } from "../../../utils/permissionConstant";

export default function PropertyInspection() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(PAGINATION);
  const [totalRecord, setTotalRecord] = useState(0);
  const [categorys, setCategorys] = useState([]);
  const { setHeaderTitle } = useHeader();
  const [searchForm] = Form.useForm();
  const navigate = useNavigate();
  const [searchField, setSearchField] = useState("searchText");
  const [isOpenDrawerSearch, setIsOpenDrawerSearch] = useState(false);
  const [searchFilter, setSearchFilter] = useState({});
  const drawerRef = useRef();
  const { permissions } = useAuth();

  useEffect(() => {
    setHeaderTitle(t("propertyInspection.title_property_inspection"));
  }, [t, setHeaderTitle]);

  useEffect(() => {
    if (page > 1) fetchPropertyInspections(page, searchFilter);
    else fetchPropertyInspections(1, searchFilter);
  }, [page]);

  const onChangePagination = (value) => {
    setPage(value);
  };

  const onSearch = () => {
    pagination.page = 1;
    fetchPropertyInspections();
  };

  const fetchPropertyInspections = async (_page, value) => {
    const searchValue = searchForm.getFieldValue("searchValue");
    let payload = {
      page: _page || page,
      limit: PAGINATION.limit,
      ...cleanEmptyValues(value || {}),
      [searchField]: searchValue,
    };
    const res =
      await _unitOfWork.propertyInspection.getPropertyInspections(payload);
    if (res && res?.code === 1) {
      setCategorys(res?.results);
      setTotalRecord(res?.totalResults);
    }
  };

  const onClickGoToView = async (values) => {
    navigate(staticPath.viewPropertyInspection + "/" + values._id);
  };

  const resetSearch = () => {
    setSearchFilter({});
    if (drawerRef.current) drawerRef.current.resetForm();
    setPage(1);
    searchForm.resetFields();
    fetchPropertyInspections(1);
  };
  const onClickClose = async (value) => {
    let res = await _unitOfWork.propertyInspection.closePropertyInspection({
      id: value?._id || value?.id,
    });
    if (res && res.code === 1) {
      ShowSuccess(
        "topRinght",
        t("common.notifications"),
        t("propertyInspection.noti_colse_property_inspection"),
      );
      fetchPropertyInspections();
    }
  };
  const onClickCancel = async (value) => {
    let res = await _unitOfWork.propertyInspection.cancelPropertyInspection({
      id: value?._id || value?.id,
    });
    if (res && res.code === 1) {
      ShowSuccess(
        "topRinght",
        t("common.notifications"),
        t("propertyInspection.noti_cancel_property_inspection"),
      );
      fetchPropertyInspections();
    }
  };
  const onClickCreate = () => {
    navigate(staticPath.createPropertyInspection);
  };
  const onClickUpdate = (values) => {
    navigate(staticPath.updatePropertyInspection + "/" + values._id);
  };
  const placeholderMap = {
    searchText: t("propertyInspection.searchText"),
    code: t("preventive.common.code"),
    assetName: t("preventive.list.table.asset_name"),
    assetModelName: t("preventive.list.table.model"),
    assetNumber: t("propertyInspection.asset_number"),
    nameUser: t("propertyInspection.table.name_user"),
  };
  const columns = [
    {
      title: t("propertyInspection.table.stt"),
      dataIndex: "id",
      key: "id",
      align: "center",
      render: (_text, _record, index) =>
        (page - 1) * PAGINATION.limit + index + 1,
    },
    {
      title: t("propertyInspection.info"),
      dataIndex: "assetMaintenance",
      render: (text, record) => (
        <div>
          <LabelValue
            label={t("propertyInspection.table.code")}
            value={record?.code}
          />
          <LabelValue
            label={t("propertyInspection.inspection_date")}
            value={parseDateHH(record?.inspectionDate)}
          />
          <LabelValue
            label={t("propertyInspection.table.name_user")}
            value={record?.nameUser}
          />
        </div>
      ),
    },
    {
      title: t("assetMaintenance.list.title_info"),
      dataIndex: "assetMaintenance",
      render: (text, record) => (
        <div>
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
          {text?.serial && (
            <LabelValue
              label={t("breakdown.list.columns.serial")}
              value={text?.serial}
            />
          )}
          <LabelValue
            label={t("assetMaintenance.asset_number")}
            value={text?.assetNumber}
          />
        </div>
      ),
    },
    {
      title: t("preventiveSchedule.modal.map_title"),
      dataIndex: "assetMaintenance",
      render: (text, record) => (
        <div>
          <LabelValue
            label={t("breakdown.map.fields.branch")}
            value={
              record?.assetMaintenance?.branch?.name
            }
          />
          <LabelValue
            label={t("breakdown.map.fields.department")}
            value={
              record?.assetMaintenance?.department
                ?.departmentName
            }
          />
          <LabelValue
            label={t("preventive.list.table.customer")}
            value={
              text?.customer?.customerName
            }
          />
        </div>
      ),
    },
    {
      title: t("propertyInspection.table.status"),
      dataIndex: "status",
      align: "center",
      render: (status) => {
        const option = propertyInspectionStatus.Options.find(
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
      title: t("propertyInspection.table.note"),
      dataIndex: "note",
    },
    {
      title: t("category.list.table.action"),
      dataIndex: "action",
      align: "center",
      fixed: "right",
      render: (_, record) => {
        const items = [];
        {
          ((checkPermission(
            permissions,
            permissionCodeConstant.property_inspection_update,
          ) &&
            record.status ===
            propertyInspectionStatus.waitingForAdminApproval) ||
            record.status === propertyInspectionStatus.partiallyCompleted) &&
            items.push({
              key: "update",
              onClick: () => onClickUpdate(record),
              label: <span>{t("common_buttons.update")}</span>,
              icon: <FormOutlined />,
            });
        }
        {
          checkPermission(
            permissions,
            permissionCodeConstant.property_inspection_close,
          ) &&
            record.status ===
            propertyInspectionStatus.waitingForAdminApproval &&
            items.push({
              key: "close",
              onClick: () =>
                Comfirm(t("propertyInspection.colse_property_inspection"), () =>
                  onClickClose(record),
                ),
              label: (
                <span>{t("propertyInspection.colse_property_inspection")}</span>
              ),
              icon: <CheckCircleOutlined />,
            });
        }
        {
          ((checkPermission(
            permissions,
            permissionCodeConstant.property_inspection_cancal,
          ) &&
            record.status ===
            propertyInspectionStatus.waitingForAdminApproval) ||
            record.status === propertyInspectionStatus.partiallyCompleted) &&
            items.push({
              key: "cancel",
              onClick: () =>
                Comfirm(
                  t("propertyInspection.cancel_property_inspection"),
                  () => onClickCancel(record),
                ),
              label: (
                <span>
                  {t("propertyInspection.cancel_property_inspection")}
                </span>
              ),
              icon: <CloseCircleOutlined />,
            });
        }
        return (
          <div className="flex items-center justify-center">
            {/* View detail đứng riêng */}
            <Tooltip title={t("assetType.list.buttons.detail")}>
              <Button
                icon={<EyeOutlined />}
                size="small"
                onClick={() => onClickGoToView(record)}
              />
            </Tooltip>

            {/* Dropdown */}
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

  return (
    <div className="p-3">
      <Form
        labelWrap
        className="search-form"
        form={searchForm}
        layout="vertical"
        onFinish={onSearch}
      >
        <Row gutter={32}>
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
                      value: "code",
                      label: t("propertyInspection.table.code"),
                    },
                    {
                      value: "assetNumber",
                      label: t("assetMaintenance.list.table.asset_number"),
                    },
                    {
                      value: "assetName",
                      label: t("assetMaintenance.list.table.asset_name"),
                    },
                    {
                      value: "nameUser",
                      label: t("propertyInspection.table.name_user"),
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
          <Col
            span={9}
            style={{ display: "flex", alignItems: "center", marginBottom: 3 }}
          >
            <Button type="primary" className="mr-2" htmlType="submit">
              <SearchOutlined />
              {t("purchase.buttons.search")}
            </Button>
            <Button className="bt-green" onClick={resetSearch}>
              <RedoOutlined />
              {t("purchase.buttons.reset")}
            </Button>
            <Button
              title={t("assetMaintenance.actions.advanced_search")}
              className="px-2 ml-2"
              onClick={() => setIsOpenDrawerSearch(true)}
            >
              <FilterOutlined style={{ fontSize: 20, cursor: "pointer" }} />
            </Button>
          </Col>
          {checkPermission(
            permissions,
            permissionCodeConstant.property_inspection_create,
          ) && (
              <Col span={7} style={{ textAlign: "end" }}>
                <Button onClick={() => onClickCreate()} type="primary">
                  <PlusOutlined />
                  {t("common_buttons.create")}
                </Button>
              </Col>
            )}
        </Row>
        <Row className="mb-1">
          <Col span={24} style={{ fontSize: 16, textAlign: "right" }}>
            <b>
              {t("category.list.total", {
                count: totalRecord || 0,
              })}
            </b>
          </Col>
        </Row>

        <Table
          rowKey="id"
          columns={columns}
          key={"id"}
          dataSource={categorys}
          bordered
          pagination={false}
        />
        <Pagination
          className="pagination-table mt-2"
          onChange={onChangePagination}
          pageSize={pagination.limit}
          total={totalRecord}
          current={page}
        />
        <DrawerSearchPropertyInspection
          isOpen={isOpenDrawerSearch}
          onClose={() => setIsOpenDrawerSearch(false)}
          ref={drawerRef}
          onCallBack={(value) => {
            searchForm.resetFields(["searchValue"]);
            setSearchFilter(value);
            if (!value.isClose) {
              setPage(1);
              fetchPropertyInspections(1, value);
            }
          }}
        />
      </Form>
    </div>
  );
}
