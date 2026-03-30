import { EyeOutlined, RedoOutlined, SearchOutlined } from "@ant-design/icons";
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
  breakdownStatus,
  FORMAT_DATE,
  PAGINATION,
  priorityType,
  schedulePreventiveStatus,
} from "../../../../utils/constant";
import { parseToLabel } from "../../../../helper/parse-helper";
import ComfirmStartDate from "../../../../components/modal/ComfirmStartDate";
import { useNavigate } from "react-router-dom";
import { checkPermission } from "../../../../helper/permission-helper";
import { permissionCodeConstant } from "../../../../utils/permissionConstant";
import useAuth from "../../../../contexts/authContext";
import { staticPath } from "../../../../router/routerConfig";
import { filterOption } from "../../../../helper/search-select-helper";
import { parseDateHH } from "../../../../helper/date-helper";
import { cleanEmptyValues } from "../../../../helper/check-search-value";

export default function AssetSchedulePreventiveHistory({ assetMaintenance }) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [schedulePreventives, setSchedulePreventives] = useState([]);
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
      importance: values?.importance,
      startDate: values?.startDate,
      endDate: values?.endDate,
      preventiveName: values?.preventiveName,
    };
    if (values?.statuses && values?.statuses.length > 0) {
      payload.statuses = values?.statuses;
    }
    const res =
      await _unitOfWork.schedulePreventive.getAssetSchedulePreventivetHistorys(
        payload
      );
    if (res && res.code === 1) {
      setSchedulePreventives(res?.schedulePreventives?.results);
      setTotalRecord(res?.schedulePreventives?.totalResults);
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
  const onClickViewSchedulePreventive = (value) => {
    navigate(staticPath.viewSchedulePreventive + "/" + (value._id || value.id));
  };
  const columns = [
    {
      title: t("preventiveSchedule.list.table.index"),
      dataIndex: "id",
      key: "id",
      width: "6vw",
      align: "center",
      render: (_text, _record, index) =>
        (page - 1) * PAGINATION.limit + index + 1,
    },
    {
      title: t("preventiveSchedule.list.table.code"),
      dataIndex: "code",
      align: "center",
      className: "text-bold",
    },
    {
      title: t("preventiveSchedule.list.table.name"),
      dataIndex: "preventive",
      ellipsis: true,
      render: (text) => {
        return <span>{text?.preventiveName || []}</span>;
      },
    },
    {
      title: t("preventiveSchedule.list.table.status"),
      dataIndex: "status",
      align: "center",
      render: (status) => {
        const option = schedulePreventiveStatus.Options.find(
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
      title: t("preventiveSchedule.list.table.start_date"),
      dataIndex: "startDate",
      key: "startDate",
      align: "center",
      render: (text) => parseDateHH(text),
    },
    {
      title: t("preventiveSchedule.list.table.priority"),
      dataIndex: "preventive",
      align: "center",
      render: (text) => t(parseToLabel(priorityType.Option, text?.importance)),
    },
    {
      title: t("breakdown.list.columns.action"),
      dataIndex: "action",
      fixed: "right",
      width: "6vw",
      align: "center",
      render: (_, record) => {
        return (
          <div>
            {checkPermission(
              permissions,
              permissionCodeConstant.schedule_preventive_view_detail
            ) && (
              <Tooltip title={t("preventiveSchedule.list.tooltips.view")}>
                <Button
                  icon={<EyeOutlined />}
                  size="small"
                  onClick={() => onClickViewSchedulePreventive(record)}
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
      <Form labelWrap form={searchForm} layout="vertical" className="search-form">
        <Row gutter={32}>
          <Col span={6}>
            <Form.Item
              id=""
              label={t("preventiveSchedule.list.search.code")}
              name="code"
            >
              <Input
                placeholder={t("preventiveSchedule.list.search.enter_code")}
              ></Input>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              id=""
              label={t("preventiveSchedule.list.search.preventive_name")}
              name="preventiveName"
            >
              <Input
                placeholder={t(
                  "preventiveSchedule.list.search.preventive_name"
                )}
              ></Input>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label={t("breakdown.common.status")} name="statuses">
              <Select
                showSearch
                allowClear
                mode="multiple"
                placeholder={t("breakdown.common.status")}
                options={(schedulePreventiveStatus.Options || []).map(
                  (item) => ({
                    value: item.value,
                    label: t(item.label),
                  })
                )}
                filterOption={filterOption}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label={t("preventiveSchedule.list.search.priority")}
              name="importance"
            >
              <Select
                showSearch
                allowClear
                placeholder={t("preventiveSchedule.list.search.priority")}
                options={(priorityType.Option || []).map((item) => ({
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
          dataSource={schedulePreventives}
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
