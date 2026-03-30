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
import Confirm from "../../../components/modal/Confirm";
import { useNavigate } from "react-router-dom";
import { staticPath } from "../../../router/routerConfig";
import useHeader from "../../../contexts/headerContext";
import * as _unitOfWork from "../../../api";
import { useEffect, useRef, useState } from "react";
import { PAGINATION } from "../../../utils/constant";
import { parseDate } from "../../../helper/date-helper";
import useAuth from "../../../contexts/authContext";
import { checkPermission } from "../../../helper/permission-helper";
import { permissionCodeConstant } from "../../../utils/permissionConstant";
import { useTranslation } from "react-i18next";
import ShowSuccess from "../../../components/modal/result/successNotification";
import "../../report/assetMaintenance/index.scss";
import { cleanEmptyValues } from "../../../helper/check-search-value";
import DrawerSearch from "../../../components/drawer/drawerSearch";

export default function RequireContract() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setHeaderTitle } = useHeader();
  const [amcs, setAmcs] = useState([]);
  const [totalRecord, setTotalRecord] = useState(0);
  const [page, setPage] = useState(1);
  const [searchForm] = Form.useForm();
  const { permissions } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [serviceContractors, setServiceContractors] = useState([]);
  const [isOpenSearchAdvanced, setIsOpenSearchAdvanced] = useState(false);
  const [searchField, setSearchField] = useState("searchText");
  const [searchFilter, setSearchFilter] = useState({});
  const drawerRef = useRef();

  useEffect(() => {
    setHeaderTitle(t("menu.maintenance_request.repair_contract"));
    getAllServiceContractor();
    getAllCustomers();
  }, [t]);
  useEffect(() => {
    if (page > 1) {
      fetchGetRepairContracts(page, searchFilter);
    } else {
      fetchGetRepairContracts(1, searchFilter);
    }
  }, [page]);

  const fetchGetRepairContracts = async (_page, value) => {
    const searchValue = searchForm.getFieldValue("searchValue");
    let filterValue = cleanEmptyValues(value || {});
    let payload = {
      page: _page || page,
      limit: PAGINATION.limit,
      // ...searchForm.getFieldsValue(),
      ...filterValue,
      ...(searchValue ? { [searchField]: searchValue } : {}),
    };
    let res = await _unitOfWork.repairContract.getListRepairContracts(payload);
    if (res && res.code === 1) {
      setAmcs(res?.result?.repairContracts);
      setTotalRecord(res?.result?.totalResults);
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
  const onClickCreate = () => {
    navigate(staticPath.createRepairContract);
  };
  const onUpdate = (value) => {
    navigate(staticPath.updateRepairContract + "/" + (value.id || value._id));
  };
  const onDetail = (value) => {
    navigate(staticPath.viewRepairContract + "/" + (value.id || value._id));
  };
  const onMapping = (value) => {
    navigate(
      staticPath.repairContractMappingAssetMaintenance +
      "/" +
      (value.id || value._id)
    );
  };
  const onDelete = async (value) => {
    let res = await _unitOfWork.repairContract.deleteRepairContractById(
      value?._id || value?.id
    );
    if (res && res.code === 1) {
      ShowSuccess(
        "topRight",
        t("common.notifications"),
        t("common.messages.success.delete"),
      );
      fetchGetRepairContracts();
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
    fetchGetRepairContracts(1);
  };
  const onSearch = () => {
    setPage(1);
    fetchGetRepairContracts(1, searchFilter);
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
      dataIndex: "contractNo",
      className: "text-left-column",
    },
    {
      title: t("calibration_contract.contract_name"),
      dataIndex: "contractName",
      className: "text-left-column",
    },
    {
      title: t("calibration_contract.service_contractor"),
      dataIndex: "serviceContractor",
      className: "text-left-column",
      render: (_, record) => record?.serviceContractor?.serviceContractorName,
    },
    {
      title: t("amc.manager.table.customer"),
      dataIndex: "customerName",
      className: "text-left-column",
      render: (_, record) => record?.customer?.customerName,
    },
    {
      title: t("calibration_contract.expiration_date"),
      dataIndex: "expirationDate",
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
          <Tooltip
            title={t(
              "calibration_contract.buttons.linking_contracts_to_assets"
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
          {/* {checkPermission(
            permissions,
            permissionCodeConstant.maintenance_contract_update
          ) && ( */}
          <Tooltip title={t("common_buttons.edit")}>
            <Button
              onClick={() => onUpdate(record)}
              type="primary"
              icon={<EditOutlined />}
              size="small"
            />
          </Tooltip>
          {/* )}
          {checkPermission(
            permissions,
            permissionCodeConstant.maintenance_contract_view_detail
          ) && ( */}
          <Tooltip title={t("amc.manager.table.detail")}>
            <Button
              onClick={() => onDetail(record)}
              type="primary"
              className="bt-green"
              icon={<EyeOutlined />}
              size="small"
            />
          </Tooltip>
          {/* )}
          {checkPermission(
            permissions,
            permissionCodeConstant.maintenance_contract_delete
          ) && ( */}
          <Tooltip title={t("amc.manager.table.delete")}>
            <Button
              onClick={() =>
                Confirm(t("amc.manager.table.confirm_delete"), () =>
                  onDelete(record)
                )
              }
              type="primary"
              danger
              icon={<DeleteOutlined />}
              size="small"
            />
          </Tooltip>
          {/* )} */}
        </Space>
      ),
    },
  ];
  const fieldsConfig = [
    {
      name: "contractNo",
      labelKey: "amc.form.contract_no",
      placeholderKey: "amc.form.contract_no",
      component: "Input",
    },
    {
      name: "contractName",
      labelKey: "calibration_contract.contract_name",
      placeholderKey: "calibration_contract.contract_name",
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
    contractNo: t("amc.form.contract_no"),
    contractName: t("calibration_contract.contract_name"),
    serviceContractorName: t("amc.form.service_contractor"),
    customerName: t("amc.form.user"),
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
                    { value: "contractNo", label: t("amc.form.contract_no") },
                    {
                      value: "contractName",
                      label: t("calibration_contract.contract_name"),
                    },
                    {
                      value: "serviceContractorName",
                      label: t("amc.form.service_contractor"),
                    },
                    { value: "customerName", label: t("amc.form.user") },
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
            style={{ display: "flex", alignItems: "center", marginBottom: 2 }}
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
                  {t("common_buttons.create")}
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
            fetchGetRepairContracts(1, value);
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
