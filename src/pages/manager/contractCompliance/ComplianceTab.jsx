import React, { useEffect, useState } from "react";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
  SearchOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  Pagination,
  Row,
  Select,
  Table,
  Tooltip,
} from "antd";
import CreateComplianceType from "./CreateComplianceType";
import UpdateComplianceType from "./UpdateComplianceType";
import { contractType, PAGINATION } from "../../../utils/constant";
import Comfirm from "../../../components/modal/Confirm";
import { parseToLabel } from "../../../helper/parse-helper";
import ShowSuccess from "../../../components/modal/result/successNotification";
import ShowErorr from "../../../components/modal/result/errorNotification";
import * as _unitOfWork from "../../../api";
import useAuth from "../../../contexts/authContext";
import { checkPermission } from "../../../helper/permission-helper";
import { permissionCodeConstant } from "../../../utils/permissionConstant";
import { useTranslation } from "react-i18next";

export default function ComplianceTable() {
  const { t } = useTranslation();
  const [isOpenCreate, setIsOpenCreate] = useState(false);
  const [isOpenUpdate, setIsOpenUpdate] = useState(false);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(PAGINATION);
  const [totalRecord, setTotalRecord] = useState(0);
  const [complianceTypes, setComplianceTypes] = useState([]);
  const [complianceTypeId, setComplianceTypeId] = useState([]);
  const [contractTypes, setContractTypes] = useState([]);
  const [data, setData] = useState([]);
  const [searchForm] = Form.useForm();
  const { permissions } = useAuth();
  useEffect(() => {
    fetchGetListComplianceType();
  }, [page]);

  useEffect(() => {
    fetchGetAllContractType();
  }, []);

  useEffect(() => {
    const totalPages = Math.ceil(totalRecord / pagination.limit);
    if (page > totalPages) {
      setPage(totalPages || 1);
    }
  }, [totalRecord]);

  const onChangePagination = (value) => {
    setPage(value);
  };
  const fetchGetAllContractType = async () => {
    const res = await _unitOfWork.contractType.getAllContractType();
    if (res && res.data) {
      setContractTypes(res.data);
    }
  };

  const fetchGetListComplianceType = async () => {
    let payload = {
      page: page,
      limit: PAGINATION.limit,
      ...searchForm.getFieldsValue(),
    };
    const res = await _unitOfWork.complianceType.getListComplianceTypes(
      payload
    );

    if (res && res.results && res.results?.results) {
      setComplianceTypes(res.results?.results);
      setTotalRecord(res.results?.totalResults);
    }
  };

  const onClickUpdate = (values) => {
    setComplianceTypeId(values.id);
    setData(values);
    setIsOpenUpdate(true);
  };
  const onDelete = async (values) => {
    const res = await _unitOfWork.complianceType.deleteComplianceType({
      id: values.id,
    });
    if (res && res.code === 1) {
      ShowSuccess("topRight", t("contractCompliance.common.notify_title"), t("contractCompliance.common.messages.delete_success_compliance"));
      fetchGetListComplianceType();
    } else {
      ShowErorr(
        "topRight",
        t("contractCompliance.common.notify_title"),
        res.message || t("contractCompliance.common.messages.delete_error_compliance")
      );
    }
  };

  const onRefresh = () => {
    setPage(1);
    searchForm.resetFields();
    fetchGetListComplianceType();
  };

  const columns = [
    {
      title: t("contractCompliance.common.columns.index"),
      dataIndex: "id",
      key: "id",
      width: "60px",
      align: "center",
      render: (_text, _record, index) =>
        (page - 1) * PAGINATION.limit + index + 1,
    },
    {
      title: t("contractCompliance.common.columns.compliance_contract_type"),
      dataIndex: "contractTypeId",
      align: "center",
      className: "text-left-column",
      render: (text) => {
        return <span> {text.contractTypeName || []}</span>;
      },
    },
    {
      title: t("contractCompliance.common.columns.compliance_type_name"),
      dataIndex: "complianceTypeName",
      align: "center",
      className: "text-left-column",
    },
    {
      title: t("contractCompliance.common.columns.compliance_type"),
      dataIndex: "complianceType",
      align: "center",
      render: (text) => t(parseToLabel(contractType.Option || [], text)),
    },
    {
      title: t("contractCompliance.common.columns.expiryreneweddate"),
      dataIndex: "expiryreneweddate",
      align: "center",
      render: (checked) => <Checkbox checked={checked} />,
    },
    {
      title: t("contractCompliance.common.columns.mandatory"),
      dataIndex: "mandatory",
      align: "center",
      render: (checked) => <Checkbox checked={checked} />,
    },
    {
      title: t("contractCompliance.common.columns.verification"),
      dataIndex: "verification",
      align: "center",
      render: (checked) => <Checkbox checked={checked} />,
    },
    {
      title: t("contractCompliance.common.columns.stop_service"),
      dataIndex: "stop_service",
      align: "center",
      render: (checked) => <Checkbox checked={checked} />,
    },
    {
      title: t("contractCompliance.common.columns.action"),
      dataIndex: "action",
      align: "center",
      render: (_, record) => (
        <div>
         {checkPermission(permissions, permissionCodeConstant.compliance_update) && (
          <Tooltip title={t("contractCompliance.common.tooltips.edit")}>
            <Button
              type="primary"
              icon={<EditOutlined />}
              size="small"
              onClick={() => onClickUpdate(record)}
            />
          </Tooltip>
         )}
          {checkPermission(permissions, permissionCodeConstant.compliance_delete) && (
          <Tooltip title={t("contractCompliance.common.tooltips.delete")}>
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              size="small"
              className="ml-2"
              onClick={() => Comfirm(t("contractCompliance.common.messages.confirm_delete"), () => onDelete(record))}
            />
          </Tooltip>)}
        </div>
      ),
    },
  ];

  return (
    <div className="p-3">
      <Form
labelWrap
        className="search-form mb-12px"
        form={searchForm}
        layout="vertical"
        onFinish={fetchGetListComplianceType}
      >
        <Row className="mb-1">
          <Col span={6} className="mr-4">
            <Form.Item
              name="complianceTypeName"
              label={t("contractCompliance.common.labels.compliance_type_name")}
              labelAlign="left"
            >
              <Input placeholder={t("contractCompliance.common.placeholders.compliance_type_name")} />
            </Form.Item>
          </Col>
          <Col span={6} className="mr-4">
            <Form.Item
              name="complianceType"
              label={t("contractCompliance.common.labels.compliance_type")}
              labelAlign="left"
            >
              <Select
                showSearch
                allowClear
                options={(contractType.Option || []).map((item) => ({
                  key: item.id,
                  value: item.value,
                  label: t(item.label),
                }))}
              ></Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Button type="primary" className="mr-2" htmlType="submit">
              <SearchOutlined />
              {t("contractCompliance.common.buttons.search")}
            </Button>
            <Button className="mr-2" onClick={() => onRefresh()}>
              <SyncOutlined />
              {t("contractCompliance.common.buttons.refresh")}
            </Button>
          </Col>
          <Col span={12} style={{ textAlign: "right" }}>
            <Tooltip title={t("contractCompliance.common.tooltips.support")} color="#616263">
              <QuestionCircleOutlined
                style={{ fontSize: "20px", cursor: "pointer" }}
              />
            </Tooltip>
             {checkPermission(permissions, permissionCodeConstant.compliance_create) && (
            <Button
              key="1"
              type="primary"
              onClick={() => setIsOpenCreate(true)}
              className="ml-3"
            >
              <PlusOutlined />
              {t("contractCompliance.common.buttons.add")}
            </Button>)}
          </Col>
          <Col span={24} style={{ fontSize: 16, textAlign: "right" }}>
            <b>{t("contractCompliance.common.total", { count: totalRecord || 0 })}</b>
          </Col>

        </Row>

        <Table
          rowKey="id"
          columns={columns}
          key={"id"}
          dataSource={complianceTypes}
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
        <CreateComplianceType
          open={isOpenCreate}
          handleCancel={() => setIsOpenCreate(false)}
          handleOk={() => setIsOpenCreate(false)}
          onRefresh={fetchGetListComplianceType}
          contractTypes={contractTypes}
        />
        <UpdateComplianceType
          open={isOpenUpdate}
          handleCancel={() => setIsOpenUpdate(false)}
          handleOk={() => setIsOpenUpdate(false)}
          id={complianceTypeId}
          onRefresh={fetchGetListComplianceType}
          data={data}
          contractTypes={contractTypes}
        />
      </Form>
    </div >
  );
}