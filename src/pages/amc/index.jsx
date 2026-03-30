import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  FilterOutlined,
  PlusOutlined,
  RedoOutlined,
  SearchOutlined,
  UsergroupAddOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Button,
  Pagination,
  Space,
  Form,
  Table,
  Tooltip,
  Card,
  Row,
  Col,
  Input,
  Select,
} from "antd";
import Confirm from "../../components/modal/Confirm";
import { useNavigate } from "react-router-dom";
import { staticPath } from "../../router/routerConfig";
import useHeader from "../../contexts/headerContext";
import * as _unitOfWork from "../../api";
import { useEffect, useRef, useState } from "react";
import { PAGINATION } from "../../utils/constant";
import { parseDate } from "../../helper/date-helper";
import useAuth from "../../contexts/authContext";
import { checkPermission } from "../../helper/permission-helper";
import { permissionCodeConstant } from "../../utils/permissionConstant";
import { useTranslation } from "react-i18next";
import ShowSuccess from "../../components/modal/result/successNotification";
import "../report/assetMaintenance/index.scss";
import DrawerSearch from "../../components/drawer/drawerSearch";
import { cleanEmptyValues } from "../../helper/check-search-value";

export default function AmcManager() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setHeaderTitle } = useHeader();
  const [amcs, setAmcs] = useState([]);
  const [totalRecord, setTotalRecord] = useState(0);
  const [page, setPage] = useState(1);
  const [searchForm] = Form.useForm();
  const { permissions } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [servicePackages, setServicePackages] = useState([]);
  const [serviceContractors, setServiceContractors] = useState([]);
  const [isOpenSearchAdvanced, setIsOpenSearchAdvanced] = useState(false);
  const [searchField, setSearchField] = useState("searchText");
  const [searchFilter, setSearchFilter] = useState({});
  const drawerRef = useRef();

  useEffect(() => {
    setHeaderTitle(t("amc.manager.title"));
    getAllServiceContractor();
    getAllServicePackages();
    getAllCustomers();
  }, []);
  useEffect(() => {
    if (page > 1) {
      fetchGetAmcs(page, searchFilter);
    } else {
      fetchGetAmcs(1, searchFilter);
    }
  }, [page]);
  const fetchGetAmcs = async (_page, value) => {
    const searchValue = searchForm.getFieldValue("searchValue");
    let filterValue = cleanEmptyValues(value || {});
    let payload = {
      page: _page || page,
      limit: PAGINATION.limit,
      // ...searchForm.getFieldsValue(),
      ...filterValue,
      ...(searchValue ? { [searchField]: searchValue } : {}),
    };
    let res = await _unitOfWork.amc.getAmcs(payload);
    if (res && res.code === 1) {
      const data = res?.result;
      setAmcs(data?.amcs);
      setTotalRecord(data?.totalResults);
    }
  };
  const getAllServiceContractor = async () => {
    const res = await _unitOfWork.serviceContractor.getAllServiceContractors();
    if (res) {
      setServiceContractors(res.data);
    }
  };
  const getAllCustomers = async () => {
    const res = await _unitOfWork.customer.getAllCustomer();
    if (res) {
      const options = res.data.map((item) => ({
        label: item.customerName,
        value: item.id,
      }));
      setCustomers(options);
    }
  };
  const getAllServicePackages = async () => {
    const res = await _unitOfWork.servicePackage.getAllServicePackages();
    if (res && res.code === 1) {
      setServicePackages(res.data);
    }
  };
  const onChangePagination = (value) => {
    setPage(value);
  };
  const resetSearch = () => {
    setSearchFilter({});
    if (drawerRef.current) drawerRef.current.resetForm();
    searchForm.resetFields();
    setPage(1);
    fetchGetAmcs(1);
  };
  const onSearch = () => {
    setPage(1);
    fetchGetAmcs(1, searchFilter);
  };
  const onClickCreate = () => {
    navigate(staticPath.createAmc);
  };
  const onUpdate = (value) => {
    console.log(value);
    navigate(staticPath.updateAmc + "/" + (value?.id || value?._id));
  };
  const onDetail = (value) => {
    navigate(staticPath.viewAmc + "/" + (value?.id || value?._id));
  };
  const onMapping = (value) => {
    navigate(
      staticPath.amcMappingAssetMaintenance + "/" + (value?.id || value?._id),
    );
  };
  const onDelete = async (value) => {
    let res = await _unitOfWork.amc.deleteAmc(value?.id || value?._id);
    if (res && res.code === 1) {
      ShowSuccess(
        "topRight",
        t("common.notifications"),
        t("preventive.messages.delete_success"),
      );
      fetchGetAmcs();
    }
  };
  const columns = [
    {
      title: t("amc.manager.table.index"),
      dataIndex: "key",
      width: 50,
      align: "center",
      render: (_, __, _idx) => {
        return <span>{_idx + 1 + PAGINATION.limit * (page - 1)}</span>;
      },
    },
    {
      title: t("amc.manager.table.contract_no"),
      dataIndex: "amcNo",
      className: "text-left-column",
    },
    {
      title: t("amc.form.service_contractor"),
      dataIndex: ["serviceContractor", "serviceContractorName"],
      className: "text-left-column",
    },
    {
      title: t("amc.manager.table.customer"),
      dataIndex: "customerName",
      className: "text-left-column",
      render: (_, record) => record?.customer?.customerName,
    },
    {
      title: t("amc.form.service_package"),
      dataIndex: ["servicePackage", "servicePackageName"],
      className: "text-left-column",
    },
    {
      title: t("amc.form.effective_date"),
      dataIndex: "effectiveDate",
      align: "center",
      render: (text) => <>{parseDate(text)}</>,
    },
    {
      title: t("amc.manager.table.actions"),
      dataIndex: "action",
      align: "center",
      width: 150,
      render: (_, record) => (
        <Space size="middle">
          {/* {checkPermission(
            permissions,
            permissionCodeConstant.maintenance_contract_assign_executor
          ) && (
              <Tooltip title={t("amc.manager.table.assign_executor")}>
                <Button
                  onClick={() => onUpdate(record)}
                  type="primary"
                  className="bt-yellow"
                  icon={<UserOutlined />}
                  size="small"
                />
              </Tooltip>
            )}
          <Tooltip title={t("calibration_contract.buttons.linking_contracts_to_assets")}>
            )} */}
          <Tooltip
            title={t(
              "calibration_contract.buttons.linking_contracts_to_assets",
            )}
          >
            <Button
              onClick={() => onMapping(record)}
              type="primary"
              className="bt-blue"
              icon={<UsergroupAddOutlined />}
              size="small"
            />
          </Tooltip>
          {checkPermission(
            permissions,
            permissionCodeConstant.maintenance_contract_update,
          ) && (
            <Tooltip title={t("amc.manager.table.edit")}>
              <Button
                onClick={() => onUpdate(record)}
                type="primary"
                icon={<EditOutlined />}
                size="small"
              />
            </Tooltip>
          )}
          {checkPermission(
            permissions,
            permissionCodeConstant.maintenance_contract_view_detail,
          ) && (
            <Tooltip title={t("amc.manager.table.detail")}>
              <Button
                onClick={() => onDetail(record)}
                type="primary"
                className="bt-green"
                icon={<EyeOutlined />}
                size="small"
              />
            </Tooltip>
          )}
          {checkPermission(
            permissions,
            permissionCodeConstant.maintenance_contract_delete,
          ) && (
            <Tooltip title={t("amc.manager.table.delete")}>
              <Button
                onClick={() =>
                  Confirm(t("amc.manager.table.confirm_delete"), () =>
                    onDelete(record),
                  )
                }
                type="primary"
                danger
                icon={<DeleteOutlined />}
                size="small"
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];
  const fieldsConfig = [
    {
      name: "amcNo",
      labelKey: "amc.form.contract_no",
      placeholderKey: "amc.form.contract_no",
      component: "Input",
    },
    {
      name: "serviceContractor",
      labelKey: "amc.form.service_contractor",
      placeholderKey: "amc.form.service_contractor",
      component: "Select",
      options: serviceContractors.map((item) => ({
        value: item.id,
        label: item.serviceContractorName,
      })),
    },
    {
      name: "customer",
      labelKey: "amc.form.user",
      placeholderKey: "amc.form.user",
      component: "Select",
      options: customers,
    },
    {
      name: "servicePackage",
      labelKey: "amc.form.service_package",
      placeholderKey: "amc.form.service_package",
      component: "Select",
      options: servicePackages.map((item) => ({
        value: item.id,
        label: item.servicePackageName,
      })),
    },
    {
      name: "startDate",
      labelKey: "suppliesNeed.list.search.start_label",
      placeholderKey: "suppliesNeed.list.search.start_label",
      component: "DatePicker",
    },
    {
      name: "endDate",
      labelKey: "suppliesNeed.list.search.end_label",
      placeholderKey: "suppliesNeed.list.search.end_label",
      component: "DatePicker",
    },
  ];
  const placeholderMap = {
    searchText: t("preventive.common.all"),
    amcNo: t("amc.form.contract_no"),
    serviceContractorName: t("amc.form.service_contractor"),
    customerName: t("amc.form.user"),
    servicePackageName: t("amc.form.service_package"),
  };
  return (
    <div className="p-2">
      <Form
        labelWrap
        className="search-form report-filter-row"
        form={searchForm}
        layout="vertical"
        onFinish={onSearch}
      >
        {/* <Row className="mb-1" gutter={32}>
          <Col span={6}>
            <Form.Item
              id=""
              label={t("orderPurchase.form.fields.contract_number")}
              name="amcNo"
            >
              <Input placeholder={t("amc.form.contract_no_placeholder")} />
            </Form.Item>
          </Col>
        </Row> */}
        <Row gutter={16}>
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
                    { value: "amcNo", label: t("amc.form.contract_no") },
                    {
                      value: "serviceContractorName",
                      label: t("amc.form.service_contractor"),
                    },
                    { value: "customerName", label: t("amc.form.user") },
                    {
                      value: "servicePackageName",
                      label: t("amc.form.service_package"),
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
          <Col
            span={9}
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
            <Button
              title={t("preventive.buttons.advanced_search")}
              className="px-2 mr-2"
              onClick={() => setIsOpenSearchAdvanced(true)}
            >
              <FilterOutlined style={{ fontSize: 20, cursor: "pointer" }} />
            </Button>
          </Col>
          <Col span={7} style={{ textAlign: "right", marginTop: 8 }}>
            {checkPermission(
              permissions,
              permissionCodeConstant.maintenance_contract_create,
            ) && (
              <Button onClick={() => onClickCreate()} type="primary">
                <PlusOutlined />
                {t("amc.manager.create_button")}
              </Button>
            )}
          </Col>
          <Col span={24} style={{ fontSize: 16, textAlign: "right" }}>
            <b>{t("amc.manager.total", { count: totalRecord || 0 })}</b>
          </Col>
        </Row>
        <Table
          columns={columns}
          dataSource={amcs}
          className="custom-table"
          bordered
          pagination={false}
        />
        {totalRecord > 0 && (
          <Pagination
            className="pagination-table mt-2"
            onChange={onChangePagination}
            pageSize={PAGINATION.limit}
            total={totalRecord}
          />
        )}
      </Form>
      <DrawerSearch
        isOpen={isOpenSearchAdvanced}
        ref={drawerRef}
        onCallBack={(value) => {
          searchForm.resetFields(["searchValue"]);
          setSearchFilter(value);
          if (!value.isClose) {
            setPage(1);
            fetchGetAmcs(1, value);
          }
        }}
        onClose={() => {
          setIsOpenSearchAdvanced(false);
        }}
        fieldsConfig={fieldsConfig}
      />
    </div>
  );
}
