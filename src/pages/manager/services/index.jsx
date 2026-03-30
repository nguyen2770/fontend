import {
  CheckCircleTwoTone,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  RedoOutlined,
  SearchOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  Row,
  Space,
  Pagination,
  Switch,
  Table,
  Tooltip,
  Card,
  Form,
  Input,
} from "antd";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { staticPath } from "../../../router/routerConfig";
import { PAGINATION } from "../../../utils/constant";
import useHeader from "../../../contexts/headerContext";
import * as _unitOfWork from "../../../api";
import Confirm from "../../../components/modal/Confirm";
import useAuth from "../../../contexts/authContext";
import { checkPermission } from "../../../helper/permission-helper";
import { permissionCodeConstant } from "../../../utils/permissionConstant";
import { useTranslation } from "react-i18next";
import "../../report/assetMaintenance/index.scss";

export default function Service() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [totalRecord, setTotalRecord] = useState(0);
  const [services, setServices] = useState([]);
  const [page, setPage] = useState(1);
  const [searchForm] = Form.useForm();
  const { setHeaderTitle } = useHeader();
  const { permissions } = useAuth();
  useEffect(() => {
    setHeaderTitle(t("service.list.title"));
  }, []); // eslint-disable-line

  useEffect(() => {
    fetchServices();
  }, [page]); // eslint-disable-line

  const fetchServices = async () => {
    let payload = {
      page: page,
      limit: PAGINATION.limit,
      ...searchForm.getFieldsValue(),
    };
    let res = await _unitOfWork.service.getServices(payload);
    if (res && res.code === 1) {
      setServices(res.data.results);
      setTotalRecord(res.data.totalResults);
    }
  };
  const onChangePagination = (value) => {
    setPage(value);
  };
  const onCreate = () => {
    navigate(staticPath.createService);
  };
  const goToUpdate = (value) => {
    navigate(staticPath.updateService + "/" + value.id);
  };
  const onClickUpdateStatus = async (_record) => {
    let res = await _unitOfWork.service.updateStatus(_record.id);
    if (res && res.code === 1) {
      fetchServices();
    }
  };
  const onClickDelete = async (_record) => {
    let res = await _unitOfWork.service.deleteService(_record.id);
    if (res && res.code === 1) {
      fetchServices();
    }
  };
  const resetSearch = () => {
    setPage(1);
    searchForm.resetFields();
    fetchServices();
  };
  const columns = [
    {
      title: t("service.list.columns.index"),
      dataIndex: "id",
      key: "id",
      width: "5%",
      align: "center",
      render: (_, record, _idx) => {
        return <span>{_idx + 1 + PAGINATION.limit * (page - 1)}</span>;
      },
    },
    {
      title: t("service.list.columns.name"),
      dataIndex: "serviceName",
    },
    {
      title: t("service.list.columns.action"),
      dataIndex: "action",
      align: "center",
      width: "10%",
      render: (_, record) => (
        <Space size="middle">
          {checkPermission(
            permissions,
            permissionCodeConstant.service_update,
          ) && (
            <Tooltip title={t("service.list.tooltips.edit")}>
              <Button
                onClick={() => goToUpdate(record)}
                type="primary"
                icon={<EditOutlined />}
                size="small"
              />
            </Tooltip>
          )}
          {checkPermission(
            permissions,
            permissionCodeConstant.service_delete,
          ) && (
            <Tooltip title={t("service.list.tooltips.delete")}>
              <Button
                type="primary"
                onClick={() =>
                  Confirm(t("service.common.messages.confirm_delete"), () =>
                    onClickDelete(record),
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

  return (
    <div className="p-2">
      <Form
        labelWrap
        className="search-form report-filter-row"
        form={searchForm}
        layout="vertical"
        onFinish={fetchServices}
      >
        <Row gutter={8}>
          <Col span={6}>
            <Form.Item
              id="serviceName"
              label={t("service.common.labels.service_name")}
              name="serviceName"
              className="text-gray-600"
            >
              <Input
                placeholder={t(
                  "service.common.placeholders.service_name_search",
                )}
              ></Input>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Button type="primary" className="mr-2" htmlType="submit">
              <SearchOutlined />
              {t("service.common.buttons.search")}
            </Button>
            <Button className="bt-green mr-2" onClick={resetSearch}>
              <RedoOutlined />
              {t("service.common.buttons.reset")}
            </Button>
          </Col>
          <Col span={12} style={{ textAlign: "right" }}>
            {checkPermission(
              permissions,
              permissionCodeConstant.service_create,
            ) && (
              <Button type="primary" onClick={onCreate}>
                <PlusOutlined />
                {t("service.common.buttons.add_service")}
              </Button>
            )}
          </Col>
          <Col span={24} style={{ fontSize: 16, textAlign: "right" }}>
            <b>{t("service.common.total", { count: totalRecord || 0 })}</b>
          </Col>
        </Row>
      </Form>
      <Table
        columns={columns}
        dataSource={services}
        className="custom-table"
        pagination={false}
      ></Table>
      {totalRecord > 0 && (
        <Pagination
          className="pagination-table mt-2"
          onChange={onChangePagination}
          pageSize={PAGINATION.limit}
          total={totalRecord}
        />
      )}
    </div>
  );
}
