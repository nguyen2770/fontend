import {
  EyeFilled,
  PauseCircleOutlined,
  PlayCircleOutlined,
  RedoOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Button,
  Table,
  Tooltip,
  Form,
  Pagination,
  Row,
  Col,
  Select,
  Input,
  DatePicker,
} from "antd";
import React, { useEffect, useState } from "react";
import * as _unitOfWork from "../../../../api";
import { useTranslation } from "react-i18next";
import {
  assetMaintenanceStatus,
  assetType,
  breakdownStatus,
  FORMAT_DATE,
  frequencyAllOptions,
  monitoringType,
  PAGINATION,
  priorityLevelStatus,
  priorityType,
  ScheduleBasedOnType,
} from "../../../../utils/constant";
import { parseToLabel } from "../../../../helper/parse-helper";
import Comfirm from "../../../../components/modal/Confirm";
import ShowSuccess from "../../../../components/modal/result/successNotification";
import ComfirmStartDate from "../../../../components/modal/ComfirmStartDate";
import { useNavigate } from "react-router-dom";
import { parseDate } from "../../../../helper/date-helper";
import { checkPermission } from "../../../../helper/permission-helper";
import { permissionCodeConstant } from "../../../../utils/permissionConstant";
import useAuth from "../../../../contexts/authContext";
import { staticPath } from "../../../../router/routerConfig";
import {
  dropdownRender,
  filterOption,
} from "../../../../helper/search-select-helper";
import { cleanEmptyValues } from "../../../../helper/check-search-value";

export default function AssetIncidentHistory({ assetMaintenance }) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [breakdowns, setBreakdowns] = useState([]);
  const [showComfirmStartDate, setShowComfirmStartDate] = useState(false);
  const [preventiveOfModel, setPreventiveOfModel] = useState("");
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const [totalRecord, setTotalRecord] = useState(0);
  const { permissions } = useAuth();
  const [searchForm] = Form.useForm();

  useEffect(() => {
    if (page > 1) {
      fetchGetAssetIncidentHistorys();
    } else {
      fetchGetAssetIncidentHistorys(1);
    }
  }, [page]);

  const fetchGetAssetIncidentHistorys = async (_page) => {
    const values = cleanEmptyValues(searchForm.getFieldsValue());
    let payload = {
      page: _page || page,
      limit: PAGINATION.limit,
      assetMaintenance: assetMaintenance?.id || assetMaintenance?._id,
      code: values?.code,
      priorityLevel: values?.priorityLevel,

      startDate: values?.startDate,
      endDate: values?.endDate,
    };
    if (values?.statuses && values?.statuses.length > 0) {
      payload.statuses = values?.statuses;
    }
    const res = await _unitOfWork.breakdown.getAssetIncidentHistorys(payload);
    if (res && res.code === 1) {
      setBreakdowns(res?.breakdowns?.results);
      setTotalRecord(res?.breakdowns?.totalResults);
    }
  };

  const onSearch = () => {
    setPage(1);
    fetchGetAssetIncidentHistorys(1);
  };

  const onClickStart = (record) => {
    setPreventiveOfModel(record);
    setShowComfirmStartDate(true);
  };

  const onCallBack = async (date, initialValue) => {};

  const onClickStop = async (record) => {};
  const onChangePagination = (value) => {
    setPage(value);
  };
  const onClicView = (value) => {
    navigate(staticPath.viewWorkOrderBreakdown + "/" + value.id);
  };
  const resetSearch = () => {
    searchForm.resetFields();
    setPage(1);
    fetchGetAssetIncidentHistorys();
  };
  const columns = [
    {
      title: t("breakdown.list.columns.stt"),
      dataIndex: "id",
      key: "id",
      with: "6vw",
      align: "center",
      render: (_text, _record, index) =>
        (page - 1) * PAGINATION.limit + index + 1,
    },
    {
      title: t("breakdown.list.columns.code"),
      dataIndex: "code",
      render: (text) => <span style={{ fontWeight: 600 }}>{text}</span>,
    },
    {
      title: t("breakdown.list.columns.job_status"),
      dataIndex: "status",
      align: "center",
      render: (status) => {
        const option = breakdownStatus.Option.find(
          (opt) => opt.value === status
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
      title: t("breakdown.list.columns.asset_status"),
      dataIndex: "assetMaintenanceStatus",
      align: "center",
      render: (status) => {
        const option = assetMaintenanceStatus.Options.find(
          (opt) => opt.value === status
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
      title: t("breakdown.list.columns.priority"),
      dataIndex: "priorityLevel",
      align: "center",
      render: (status) => {
        const option = priorityLevelStatus.Options.find(
          (opt) => opt.value === status
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
      title: t("breakdown.list.columns.created_at"),
      dataIndex: "createdAt",
      align: "center",
      render: (text) => parseDate(text),
    },
    {
      title: t("breakdown.create.fields.description"),
      dataIndex: "defectDescription",
    },
    {
      title: t("breakdown.list.columns.action"),
      dataIndex: "action",
      fixed: "right",
      align: "center",
      with: "6vw",
      render: (_, record) => {
        return (
          <div>
            {checkPermission(
              permissions,
              permissionCodeConstant.breakdown_view_detail
            ) && (
              <Tooltip title={t("breakdown.list.tooltips.view")}>
                <Button
                  icon={<EyeFilled />}
                  size="small"
                  className="ml-2"
                  onClick={() => onClicView(record)}
                />
              </Tooltip>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="content-manager">
      <Form
labelWrap
        form={searchForm}
        layout="vertical"
        // onFinish={onSearch}
        className="search-form"
      >
        <Row gutter={32}>
          <Col span={6}>
            <Form.Item id="" label={t("breakdown.common.code")} name="code">
              <Input placeholder={t("breakdown.common.code")}></Input>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label={t("breakdown.common.status")} name="statuses">
              <Select
                showSearch
                allowClear
                mode="multiple"
                placeholder={t("breakdown.common.status")}
                options={(breakdownStatus.Option || []).map((item) => ({
                  value: item.value,
                  label: t(item.label),
                }))}
                filterOption={filterOption}
              />
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item
              name="startDate"
              label={t("orderPurchase.list.search.start_label")}
            >
              <DatePicker
                placeholder={t("orderPurchase.list.search.placeholder_start")}
                format={FORMAT_DATE}
                style={{ width: "100%" }}
                allowClear
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name="endDate"
              label={t("orderPurchase.list.search.end_label")}
            >
              <DatePicker
                placeholder={t("orderPurchase.list.search.placeholder_end")}
                format={FORMAT_DATE}
                style={{ width: "100%" }}
                allowClear
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label={t("breakdown.common.priority")}
              name="priorityLevel"
              labelAlign="left"
            >
              <Select
                placeholder={t("breakdown.common.priority")}
                allowClear
                options={(priorityLevelStatus.Options || []).map((item) => ({
                  value: item.value,
                  label: t(item.label),
                }))}
                filterOption={filterOption}
                showSearch={true}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row className="mb-1">
          <Col span={12}>
            <Button type="primary" className="mr-2" onClick={onSearch}>
              <SearchOutlined /> {t("assetModel.common.buttons.search")}
            </Button>
            <Button className="bt-green mr-2" onClick={resetSearch}>
              <RedoOutlined /> {t("assetModel.common.buttons.reset")}
            </Button>
          </Col>
          <Col span={12} style={{ fontSize: 16, textAlign: "right" }}>
            <b>
              {t("assetModel.model.total", {
                count: totalRecord || 0,
              })}
            </b>
          </Col>
        </Row>
        <Table
          rowKey="id"
          columns={columns}
          key={"id"}
          dataSource={breakdowns}
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
      <ComfirmStartDate
        open={showComfirmStartDate}
        hanldeColse={() => setShowComfirmStartDate(false)}
        onCallBack={onCallBack}
        preventiveOfModel={preventiveOfModel}
      />
    </div>
  );
}
