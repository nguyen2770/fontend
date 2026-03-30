import React, { useEffect, useState } from "react";
import {
  FormOutlined,
  HistoryOutlined,
  RedoOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Input,
  Pagination,
  Row,
  Space,
  Table,
  Tag,
  Tooltip,
} from "antd";
import {
  frequencyTypeOptions,
  PAGINATION,
  typeOfMaintenance,
} from "../../../utils/constant";
import * as _unitOfWork from "../../../api";
import useHeader from "../../../contexts/headerContext";
import useAuth from "../../../contexts/authContext";
import { checkPermission } from "../../../helper/permission-helper";
import { permissionCodeConstant } from "../../../utils/permissionConstant";
import { useTranslation } from "react-i18next";
import { parseToLabel } from "../../../helper/parse-helper";
import { parseDate, parseDateNotSum7 } from "../../../helper/date-helper";
import UpdatePreventiveMonitoringModal from "./UpdatePreventiveMonitoringModal";
import ViewPreventiveMonitoringModal from "./ViewPreventiveMonitoringModal";

export default function PreventiveMonitoring() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(PAGINATION);
  const [totalRecord, setTotalRecord] = useState(0);
  const [assets, setAssets] = useState([]);
  const { setHeaderTitle } = useHeader();
  const [searchForm] = Form.useForm();
  const { permissions } = useAuth();
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [preventiveMonitoring, setPreventiveMonitoring] = useState(null);

  useEffect(() => {
    setHeaderTitle(t("preventiveMonitoring.title"));
  }, [t, setHeaderTitle]);

  useEffect(() => {
    fetchGetPreventiveMonitoring();
  }, [page]);

  const onChangePagination = (value) => {
    setPage(value);
  };

  const fetchGetPreventiveMonitoring = async (_page) => {
    let payload = {
      page: _page || page,
      limit: PAGINATION.limit,
      ...searchForm.getFieldsValue(),
    };
    const res = await _unitOfWork.preventiveMonitoring.getPreventiveMonitorings(
      payload
    );
    if (res && res.code === 1) {
      setAssets(res?.results);
      setTotalRecord(res?.totalResults);
    }
  };
  const onClickUpdate = (record) => {
    setPreventiveMonitoring(record);
    setShowUpdateModal(true);
  };
  const onClickView = (record) => {
    setPreventiveMonitoring(record);
    setShowViewModal(true);
  };

 const columns = [
    {
      title: t("preventiveMonitoring.stt"),
      dataIndex: "id",
      key: "id",
      width: "60px",
      align: "center",
      render: (_text, _record, index) =>
        (page - 1) * PAGINATION.limit + index + 1,
    },
    {
      title: t("preventiveMonitoring.maintenance"),
      dataIndex: "preventive",
      key: "code",
      align: "center",
      className: "text-left-column",
      render: (text, record) => text?.code,
    },
    {
      title: t("dashboard.cards.asset.preventive"),
      dataIndex: "_source",
      key: "source",
      align: "center",
      render: (_text, record) => t(parseToLabel(typeOfMaintenance.options, record?._source)),
    },
    {
      title: t("preventiveMonitoring.action"),
      dataIndex: "action",
      align: "center",
      render: (_, record) => (
        <div>
          {checkPermission(
            permissions,
            permissionCodeConstant.preventive_monitoring_update
          ) && (
            <Tooltip title={t("preventiveConditionBased.enter_measured_value")}>
              <Button
                type="primary"
                icon={<FormOutlined />}
                size="small"
                onClick={() => onClickUpdate(record)}
              />
            </Tooltip>
          )}
          {checkPermission(
            permissions,
            permissionCodeConstant.preventive_monitoring_view_history
          ) && (
            <Tooltip title={t("preventiveConditionBased.view_measurement_history")}>
              <Button
                icon={<HistoryOutlined />}
                size="small"
                className="ml-2"
                onClick={() => onClickView(record)}
              />
            </Tooltip>
          )}
        </div>
      ),
    },
  ];

  const onSearch = () => {
    pagination.page = 1;
    fetchGetPreventiveMonitoring(1);
  };

  const resetSearch = () => {
    pagination.page = 1;
    searchForm.resetFields();
    fetchGetPreventiveMonitoring(1);
  };

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
          <Col span={6}>
            <Form.Item
              label={t("preventiveMonitoring.monitoring_point")}
              name="monitoringPointName"
            >
              <Input
                placeholder={t(
                  "preventiveMonitoring.placeholder.enter_monitoring_point"
                )}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row className="mb-1">
          <Col span={12}>
            <Button type="primary" className="mr-2" htmlType="submit">
              <SearchOutlined />
              {t("purchase.buttons.search")}
            </Button>
            <Button className="bt-green mr-2" onClick={resetSearch}>
              <RedoOutlined />
              {t("purchase.buttons.reset")}
            </Button>
          </Col>
          <Col span={12} style={{ fontSize: 16, textAlign: "right" }}>
            <b>{t("asset.list.total", { count: totalRecord || 0 })}</b>
          </Col>
        </Row>

        <Table
          rowKey="id"
          columns={columns}
          key={"id"}
          dataSource={assets}
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
        <UpdatePreventiveMonitoringModal
          open={showUpdateModal}
          handleCancel={() => setShowUpdateModal(false)}
          preventiveMonitoring={preventiveMonitoring}
          onRefresh={fetchGetPreventiveMonitoring}
        />
        <ViewPreventiveMonitoringModal
          open={showViewModal}
          handleCancel={() => setShowViewModal(false)}
          preventiveMonitoring={preventiveMonitoring}
        />
      </Form>
    </div>
  );
}
