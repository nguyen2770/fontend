import React, { useEffect, useState } from "react";
import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
  RedoOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Pagination,
  Row,
  Col,
  Space,
  Table,
  Tooltip,
  Input,
  Form,
} from "antd";
import Confirm from "../../../components/modal/Confirm";
import { useNavigate } from "react-router-dom";
import { staticPath } from "../../../router/routerConfig";
import { PAGINATION } from "../../../utils/constant";
import * as _unitOfWork from "../../../api";
import useHeader from "../../../contexts/headerContext";
import { checkPermission } from "../../../helper/permission-helper";
import useAuth from "../../../contexts/authContext";
import { permissionCodeConstant } from "../../../utils/permissionConstant";
import { useTranslation } from "react-i18next";
import "../../report/assetMaintenance/index.scss";

export default function TaxGroup() {
  const [taxGroups, setTaxGroups] = useState([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(PAGINATION);
  const [totalRecord, setTotalRecord] = useState(0);
  const [searchForm] = Form.useForm();
  const [searchParams, setSearchParams] = useState({
    name: "",
  });
  const navigate = useNavigate();
  const { setHeaderTitle } = useHeader();
  const { permissions } = useAuth();
  const { t } = useTranslation();

  useEffect(() => {
    setHeaderTitle(t("taxGroup.title"));
  }, []);
  useEffect(() => {
    fetchGetTaxGroup();
  }, [page, searchParams]);

  useEffect(() => {
    const totalPages = Math.ceil(totalRecord / pagination.limit);
    if (page > totalPages) {
      setPage(totalPages || 1);
    }
  }, [totalRecord]);

  const fetchGetTaxGroup = async () => {
    let payload = {
      page: page,
      limit: pagination.limit,
      ...searchParams,
    };
    const res = await _unitOfWork.taxGroup.getListTaxGroups(payload);

    console.log("res", res);
    if (res && res.results?.results) {
      setTaxGroups(res.results?.results);
      setTotalRecord(res.results.totalResults);
    }
  };

  const onChangePagination = (value) => {
    setPage(value);
  };

  const onClickCreate = () => {
    navigate(staticPath.createTaxGroup);
  };

  const onClickUpdate = (values) => {
    navigate(staticPath.updateTaxGroup + "/" + values.id);
  };

  const onClikDelete = async (values) => {
    const res = await _unitOfWork.taxGroup.deleteTaxGroup({
      id: values.id,
    });
    if (res && res.code === 1) {
      fetchGetTaxGroup();
    }
  };

  const onSearch = () => {
    setSearchParams(searchForm.getFieldsValue());
    setPage(1);
  };

  const onReset = () => {
    searchForm.resetFields();
    setSearchParams({
      name: "",
    });
    setPage(1);
  };

  const columns = [
    {
      title: t("taxGroup.table.index"),
      dataIndex: "id",
      name: "id",
      width: "5%",
      align: "center",
      render: (_text, _record, index) =>
        (page - 1) * PAGINATION.limit + index + 1,
    },
    {
      title: t("taxGroup.table.tax_group_name"),
      dataIndex: "name",
      name: "name",
      className: "text-left-column",
      align: "left",
    },
    {
      title: t("taxGroup.table.actions"),
      dataIndex: "action",
      align: "center",
      width: "10%",
      render: (_, record) => (
        <Space size="middle">
          {checkPermission(
            permissions,
            permissionCodeConstant.tax_group_update,
          ) && (
            <Tooltip title={t("taxGroup.table.edit")}>
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
            permissionCodeConstant.tax_group_delete,
          ) && (
            <Tooltip title={t("taxGroup.table.delete")}>
              <Button
                type="primary"
                danger
                icon={<DeleteOutlined />}
                size="small"
                onClick={() =>
                  Confirm(t("taxGroup.table.confirm_delete"), () =>
                    onClikDelete(record),
                  )
                }
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="content-manager">
      <Card>
        <Form
labelWrap
          className="search-form report-filter-row"
          form={searchForm}
          layout="vertical"
          onFinish={onSearch}
        >
          <Row>
            <Col span={6}>
              <Form.Item
                id=""
                label={t("taxGroup.form.tax_group_name")}
                name="name"
              >
                <Input
                  placeholder={t("taxGroup.form.tax_group_name_placeholder")}
                ></Input>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Button type="primary" className="mr-2" htmlType="submit">
                <SearchOutlined /> {t("taxGroup.search_button")}
              </Button>
              <Button className="bt-green mr-2" onClick={onReset}>
                <RedoOutlined /> {t("taxGroup.reset_button")}
              </Button>
            </Col>

            <Col span={12} style={{ fontSize: 16, textAlign: "right" }}>
              {checkPermission(
                permissions,
                permissionCodeConstant.tax_group_create,
              ) && (
                <Button
                  key="1"
                  type="primary"
                  className="ml-3"
                  onClick={() => onClickCreate()}
                >
                  <PlusCircleOutlined /> {t("taxGroup.create_button")}
                </Button>
              )}
            </Col>
            <Col span={24} style={{ fontSize: 16, textAlign: "right" }}>
              <b>{t("taxGroup.total", { count: totalRecord || 0 })}</b>
            </Col>
          </Row>
        </Form>

        <Table
          key={"id"}
          rowKey="id"
          columns={columns}
          dataSource={taxGroups}
          pagination={false}
          bordered
          className="custom-table"
        />
        <Pagination
          current={page}
          className="pagination-table mt-2"
          onChange={onChangePagination}
          pageSize={pagination.limit}
          total={totalRecord}
        />
      </Card>
    </div>
  );
}
