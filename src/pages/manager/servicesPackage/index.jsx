import {
  BellOutlined,
  CheckCircleTwoTone,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
  RedoOutlined,
  SearchOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import {
  Button,
  Space,
  Switch,
  Table,
  Tooltip,
  Form,
  Pagination,
  Row,
  Col,
  Input,
  Card,
} from "antd";
import Confirm from "../../../components/modal/Confirm";
import { useNavigate } from "react-router-dom";
import { staticPath } from "../../../router/routerConfig";
import * as _unitOfWork from "../../../api";
import { useEffect, useState } from "react";
import useHeader from "../../../contexts/headerContext";
import { optionServicePackageType, PAGINATION } from "../../../utils/constant";
import { parseToLabel } from "../../../helper/parse-helper";
import useAuth from "../../../contexts/authContext";
import { checkPermission } from "../../../helper/permission-helper";
import { permissionCodeConstant } from "../../../utils/permissionConstant";
import { useTranslation } from "react-i18next";
import "./index.scss";

export default function ServicesPackage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setHeaderTitle } = useHeader();
  const [servicePackages, setServicePackages] = useState([]);
  const [totalRecord, setTotalRecord] = useState(0);
  const [page, setPage] = useState(1);
  const [searchForm] = Form.useForm();
  const { permissions } = useAuth();
  useEffect(() => {
    setHeaderTitle(t("servicePackage.page.title"));
  }, []); // eslint-disable-line
  useEffect(() => {
    fetchServicePackages();
  }, [page]); // eslint-disable-line
  const fetchServicePackages = async () => {
    let payload = {
      page: page,
      limit: PAGINATION.limit,
      ...searchForm.getFieldsValue(),
    };
    let res = await _unitOfWork.servicePackage.getServicePackages(payload);
    if (res && res.code === 1) {
      setServicePackages(res.data.results);
      setTotalRecord(res.data.totalResults);
    }
  };
  const onClickCreate = () => {
    navigate(staticPath.createServicesPackage);
  };
  const onUpdate = (value) => {
    navigate(staticPath.updateServicesPackage + "/" + value.id);
  };
  const onSearch = () => {
    setPage(1);
    fetchServicePackages();
  };
  const resetSearch = () => {
    setPage(1);
    searchForm.resetFields();
    fetchServicePackages();
  };
  const onDetail = (value) => {
    navigate(staticPath.detailServicesPackage + "/" + value.id);
  };
  const onClickUpdateStatus = async (_record) => {
    let res = await _unitOfWork.servicePackage.updateStatus(_record.id);
    if (res && res.code === 1) {
      fetchServicePackages();
    }
  };
  const onDeleteServicePackage = async (_servicePackage) => {
    let res = await _unitOfWork.servicePackage.deleteServicePackage(
      _servicePackage.id,
    );
    if (res && res.code === 1) {
      fetchServicePackages();
    }
  };
  const columns = [
    {
      title: t("servicePackage.common.table.index"),
      dataIndex: "key",
      key: "id",
      width: "5%",
      align: "center",
      render: (_, record, _idx) => {
        return <span>{_idx + 1 + PAGINATION.limit * (page - 1)}</span>;
      },
    },
    {
      title: t("servicePackage.common.labels.service_package_code"),
      dataIndex: "servicePackageCode",
      className: "text-left-column",
      align: "center",
    },
    {
      title: t("servicePackage.common.labels.service_package_name"),
      dataIndex: "servicePackageName",
      className: "text-left-column",
    },
    {
      title: t("servicePackage.common.labels.service_package_type"),
      dataIndex: "servicePackageType",
      className: "text-left-column",
      render: (text) => t(parseToLabel(optionServicePackageType, text)),
    },
    {
      title: t("servicePackage.common.labels.action"),
      dataIndex: "action",
      align: "center",
      width: "10%",
      render: (_, record) => (
        <Space size="middle">
          {checkPermission(
            permissions,
            permissionCodeConstant.service_package_update,
          ) && (
            <Tooltip title={t("servicePackage.list.tooltips.update")}>
              <Button
                type="primary"
                icon={<EditOutlined />}
                size="small"
                onClick={() => onUpdate(record)}
              />
            </Tooltip>
          )}
          {checkPermission(
            permissions,
            permissionCodeConstant.service_package_view_detail,
          ) && (
            <Tooltip title={t("servicePackage.list.tooltips.view_detail")}>
              <Button
                type="primary"
                icon={<EyeOutlined />}
                size="small"
                onClick={() => onDetail(record)}
              />
            </Tooltip>
          )}
          {checkPermission(
            permissions,
            permissionCodeConstant.service_package_delete,
          ) && (
            <Tooltip title={t("servicePackage.list.tooltips.delete")}>
              <Button
                type="primary"
                danger
                icon={<DeleteOutlined />}
                size="small"
                onClick={() =>
                  Confirm("Xác nhận xóa ?", () =>
                    onDeleteServicePackage(record),
                  )
                }
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];
  const onChangePagination = (value) => {
    setPage(value);
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
        <Row gutter={32}>
          <Col span={6}>
            <Form.Item
              id=""
              label={t("servicePackage.common.labels.service_package_code")}
              name="servicePackageCode"
            >
              <Input
                placeholder={t(
                  "servicePackage.common.placeholders.service_code_search",
                )}
              ></Input>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              id=""
              label={t("servicePackage.common.labels.service_package_name")}
              name="servicePackageName"
            >
              <Input
                placeholder={t(
                  "servicePackage.common.placeholders.service_name_search",
                )}
              ></Input>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Button type="primary" className="mr-2" htmlType="submit">
              <SearchOutlined />
              {t("servicePackage.common.buttons.search")}
            </Button>
            <Button className="bt-green mr-2" onClick={resetSearch}>
              <RedoOutlined />
              {t("servicePackage.common.buttons.reset")}
            </Button>
          </Col>
          <Col span={12} style={{ textAlign: "right" }}>
            {checkPermission(
              permissions,
              permissionCodeConstant.service_package_create,
            ) && (
              <Button key="1" type="primary" onClick={() => onClickCreate()}>
                <PlusOutlined />
                {t("servicePackage.common.buttons.add_package")}
              </Button>
            )}
          </Col>
          <Col span={24} style={{ fontSize: 16, textAlign: "right" }}>
            <b>
              {t("servicePackage.common.total", { count: totalRecord || 0 })}
            </b>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={servicePackages}
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
      </Form>
    </div>
  );
}
