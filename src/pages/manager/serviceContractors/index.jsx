import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
  UsergroupAddOutlined,
  RedoOutlined,
  FilterOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  Row,
  Space,
  Pagination,
  Table,
  Tooltip,
  Card,
  Form,
  Input,
  Select,
} from "antd";
import { useNavigate } from "react-router-dom";
import CreateServiceContractor from "./CreateServiceContractor";
import UpdateServiceContractor from "./UpdateServiceContractor";
import { useEffect, useRef, useState } from "react";
import { PAGINATION } from "../../../utils/constant";
import useHeader from "../../../contexts/headerContext";
import * as _unitOfWork from "../../../api";
import Confirm from "../../../components/modal/Confirm";
import { staticPath } from "../../../router/routerConfig";
import { checkPermission } from "../../../helper/permission-helper";
import useAuth from "../../../contexts/authContext";
import { permissionCodeConstant } from "../../../utils/permissionConstant";
import { useTranslation } from "react-i18next";
import DrawerSearch from "../../../components/drawer/drawerSearch";
import { cleanEmptyValues } from "../../../helper/check-search-value";
import ShowSuccess from "../../../components/modal/result/successNotification";
import ShowError from "../../../components/modal/result/errorNotification";
import BulkUploadModal from "../../../components/modal/BulkUpload";
import DialogModal from "../../../components/modal/result/DialogNotification";

export default function ServiceContractors() {
  const { t } = useTranslation();
  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [serviceContractorUpdate, setServiceContractorUpdate] = useState(null);
  const navigate = useNavigate();
  const [totalRecord, setTotalRecord] = useState(0);
  const [serviceContractors, setServiceContractors] = useState([]);
  const [page, setPage] = useState(1);
  const [searchForm] = Form.useForm();
  const { setHeaderTitle } = useHeader();
  const { permissions } = useAuth();
  const [isOpenSearchAdvanced, setIsOpenSearchAdvanced] = useState(false);
  const [searchField, setSearchField] = useState("searchText");
  const [searchFilter, setSearchFilter] = useState({});
  const drawerRef = useRef();
  const [isOpenBulkUpload, setOpenBulkUpload] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [modalType, setModalType] = useState("error");

  useEffect(() => {
    setHeaderTitle(t("serviceContractor.list.title"));
  }, []); // eslint-disable-line
  useEffect(() => {
    if (page > 1) {
      fetchServiceContractors(page, searchFilter);
    } else fetchServiceContractors(1, searchFilter);
  }, [page]); // eslint-disable-line
  const onCancelCreate = () => {
    setOpenCreate(false);
  };
  const onCallbackCreate = () => {
    setOpenCreate(false);
    fetchServiceContractors();
  };
  const onCancelUpdate = () => {
    setOpenUpdate(false);
  };
  const onCallbackUpdate = () => {
    setOpenUpdate(false);
    fetchServiceContractors();
  };
  const fetchServiceContractors = async (_page, value) => {
    const searchValue = searchForm.getFieldValue("searchValue");
    let filterValue = cleanEmptyValues(value || {});
    let payload = {
      page: _page || page,
      limit: PAGINATION.limit,
      // ...searchForm.getFieldsValue(),
      ...filterValue,
      [searchField]: searchValue,
    };
    let res =
      await _unitOfWork.serviceContractor.getServiceContractors(payload);
    if (res && res.code === 1) {
      setServiceContractors(res.data.results);
      setTotalRecord(res.data.totalResults);
    }
  };
  const onChangePagination = (value) => {
    setPage(value);
  };
  const onSearch = () => {
    setPage(1);
    fetchServiceContractors(1, searchFilter);
  };
  const resetSearch = () => {
    setSearchFilter({});
    if (drawerRef.current) drawerRef.current.resetForm();
    setPage(1);
    searchForm.resetFields();
    fetchServiceContractors();
  };
  const onClickDelete = async (_record) => {
    let res = await _unitOfWork.serviceContractor.deleteServiceContractor(
      _record.id,
    );
    if (res && res.code === 1) {
      fetchServiceContractors(1, searchFilter);
    }
  };
  const onClickUpdate = (_record) => {
    setServiceContractorUpdate(_record);
    setOpenUpdate(true);
  };
  const onClickUserMapping = (value) => {
    navigate(staticPath.serverContractorUserMapping + "/" + value.id);
  };

  const handleUpload = async (file, note) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("note", note);
    // console.log("file, note", file, note);
    let res =
      await _unitOfWork.serviceContractor.uploadServiceContractorExcel(
        formData,
      );
    if (res && res.code === 1 && res.result.success) {
      ShowSuccess(
        "topRight",
        t("common.notifications"),
        t("common.messages.success.upload_count", {
          count: res?.result?.insertCount || 0,
        }),
      );
      if (res?.result?.warnings) {
        setMessages(res?.result?.warnings);
        setModalType("warning");
        setIsModalOpen(true);
      }
    } else {
      ShowError(
        "topRight",
        t("common.notifications"),
        res?.message || t("common.messages.errors.upload_failed"),
      );
      setMessages(res?.result?.errors);
      setModalType("error");
      setIsModalOpen(true);
    }
    fetchServiceContractors();
    setOpenBulkUpload(false);
  };

  const columns = [
    {
      title: t("serviceContractor.list.columns.index"),
      dataIndex: "id",
      key: "id",
      width: "5%",
      align: "center",
      render: (_, record, _idx) => {
        return <span>{_idx + 1 + PAGINATION.limit * (page - 1)}</span>;
      },
    },
    {
      title: t("serviceContractor.list.columns.name"),
      dataIndex: "serviceContractorName",
      className: "text-left-column",
    },
    {
      title: t("serviceContractor.list.columns.contact_person"),
      dataIndex: "contactPerson",
      className: "text-left-column",
    },
    {
      title: t("serviceContractor.list.columns.email"),
      dataIndex: "contactEmail",
      className: "text-left-column",
    },
    {
      title: t("serviceContractor.list.columns.phone"),
      dataIndex: "contactPhoneNumber",
      className: "text-left-column",
    },
    {
      title: t("serviceContractor.list.columns.action"),
      dataIndex: "action",
      align: "center",
      width: "10%",
      render: (_, record) => (
        <Space size="middle">
          {checkPermission(
            permissions,
            permissionCodeConstant.service_contractor_update,
          ) && (
            <Tooltip title={t("serviceContractor.list.tooltips.edit")}>
              <Button
                type="primary"
                icon={<EditOutlined />}
                size="small"
                onClick={() => onClickUpdate(record)}
              />
            </Tooltip>
          )}
          {checkPermission(
            permissions,
            permissionCodeConstant.service_contractor_map_user,
          ) && (
            <Tooltip title={t("serviceContractor.list.tooltips.user_mapping")}>
              <Button
                icon={<UsergroupAddOutlined />}
                size="small"
                onClick={() => onClickUserMapping(record)}
              />
            </Tooltip>
          )}

          {checkPermission(
            permissions,
            permissionCodeConstant.service_contractor_delete,
          ) && (
            <Tooltip title={t("serviceContractor.list.tooltips.delete")}>
              <Button
                type="primary"
                onClick={() =>
                  Confirm(
                    t("serviceContractor.common.messages.confirm_delete"),
                    () => onClickDelete(record),
                  )
                }
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

  const serviceContractorsFieldsConfig = [
    {
      name: "serviceContractorName",
      labelKey: "serviceContractor.list.search.name",
      placeholderKey: "serviceContractor.common.placeholders.name",
      component: "Input",
    },
    {
      name: "contactPerson",
      labelKey: "serviceContractor.list.search.contact_person",
      placeholderKey: "serviceContractor.common.placeholders.contact_person",
      component: "Input",
    },
    {
      name: "contactEmail",
      labelKey: "serviceContractor.list.search.email",
      placeholderKey: "serviceContractor.common.placeholders.email",
      component: "Input",
    },
    {
      name: "contactPhoneNumber",
      labelKey: "serviceContractor.list.search.phone",
      placeholderKey: "serviceContractor.common.placeholders.phone",
      component: "Input",
    },
  ];

  const placeholderMap = {
    searchText: t("preventive.common.all"),
    serviceContractorName: t("serviceContractor.list.search.name"),
    contactPerson: t("serviceContractor.list.search.contact_person"),
    contactEmail: t("serviceContractor.list.search.email"),
    contactPhoneNumber: t("serviceContractor.list.search.phone"),
  };

  return (
    <div className="p-2">
      <Form
        labelWrap
        className="search-form"
        form={searchForm}
        layout="vertical"
        onFinish={onSearch}
      >
        {/* <Row gutter={32}>
            <Col span={6}>
              <Form.Item id="serviceContractorName" label={t("serviceContractor.list.search.name")} name="serviceContractorName">
                <Input placeholder={t("serviceContractor.common.placeholders.name")}></Input>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item id="contactPerson" label={t("serviceContractor.list.search.contact_person")} name="contactPerson">
                <Input placeholder={t("serviceContractor.common.placeholders.contact_person")}></Input>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item id="contactEmail" label={t("serviceContractor.list.search.email")} name="contactEmail">
                <Input placeholder={t("serviceContractor.common.placeholders.email")}></Input>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item id="contactPhoneNumber" label={t("serviceContractor.list.search.phone")} name="contactPhoneNumber">
                <Input placeholder={t("serviceContractor.common.placeholders.phone")}></Input>
              </Form.Item>
            </Col>
          </Row> */}
        <Row>
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
                    {
                      value: "serviceContractorName",
                      label: t("serviceContractor.list.search.name"),
                    },
                    {
                      value: "contactPerson",
                      label: t("serviceContractor.list.search.contact_person"),
                    },
                    {
                      value: "contactEmail",
                      label: t("serviceContractor.list.search.email"),
                    },
                    {
                      value: "contactPhoneNumber",
                      label: t("serviceContractor.list.search.phone"),
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
            <Button type="primary" className="mx-2" htmlType="submit">
              <SearchOutlined />
              {t("serviceContractor.common.buttons.search")}
            </Button>
            <Button className="bt-green mr-2" onClick={resetSearch}>
              <RedoOutlined />
              {t("serviceContractor.common.buttons.reset")}
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
            <Button
              className="button mr-2"
              onClick={() => setOpenBulkUpload(true)}
            >
              <UploadOutlined />
              {t("customer.actions.bulk_upload")}
            </Button>
            {checkPermission(
              permissions,
              permissionCodeConstant.service_contractor_create,
            ) && (
              <Button
                key="1"
                type="primary"
                onClick={() => setOpenCreate(true)}
              >
                <UsergroupAddOutlined />
                {t("serviceContractor.common.buttons.add")}
              </Button>
            )}
          </Col>
          <Col span={24} style={{ fontSize: 16, textAlign: "right" }}>
            <b>
              {t("serviceContractor.list.total", { count: totalRecord || 0 })}
            </b>
          </Col>
        </Row>
      </Form>
      <Table
        columns={columns}
        dataSource={serviceContractors}
        className="custom-table"
        pagination={false}
      ></Table>

      <Pagination
        className="pagination-table mt-2"
        onChange={onChangePagination}
        pageSize={PAGINATION.limit}
        total={totalRecord}
      />
      <CreateServiceContractor
        open={openCreate}
        handleOk={onCallbackCreate}
        handleCancel={onCancelCreate}
      />
      <UpdateServiceContractor
        serviceContractor={serviceContractorUpdate}
        open={openUpdate}
        handleOk={onCallbackUpdate}
        handleCancel={onCancelUpdate}
      />
      <DrawerSearch
        isOpen={isOpenSearchAdvanced}
        ref={drawerRef}
        onCallBack={(value) => {
          searchForm.resetFields(["searchValue"]);
          setSearchFilter(value);
          if (!value.isClose) {
            setPage(1);
            fetchServiceContractors(1, value);
          }
        }}
        onClose={() => {
          setIsOpenSearchAdvanced(false);
        }}
        fieldsConfig={serviceContractorsFieldsConfig}
      />
      <BulkUploadModal
        open={isOpenBulkUpload}
        onCancel={() => setOpenBulkUpload(false)}
        onUpload={handleUpload}
        templateUrl="/file/TemplateServiceContractor.xlsx"
      />
      <DialogModal
        open={isModalOpen}
        handleOk={() => setIsModalOpen(false)}
        type={modalType}
        message={messages}
      />
    </div>
  );
}
