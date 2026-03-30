import {
  EyeFilled,
  EyeOutlined,
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
  breakdownStatus,
  calibrationWorkStatus,
  FORMAT_DATE,
  PAGINATION,
  priorityLevelStatus,
  priorityType,
} from "../../../../utils/constant";
import ComfirmStartDate from "../../../../components/modal/ComfirmStartDate";
import { useNavigate } from "react-router-dom";
import { parseDate, parseDateHH } from "../../../../helper/date-helper";
import { checkPermission } from "../../../../helper/permission-helper";
import { permissionCodeConstant } from "../../../../utils/permissionConstant";
import useAuth from "../../../../contexts/authContext";
import { staticPath } from "../../../../router/routerConfig";
import { filterOption } from "../../../../helper/search-select-helper";
import { parseToLabel } from "../../../../helper/parse-helper";
import { cleanEmptyValues } from "../../../../helper/check-search-value";

export default function AssetCalibrationWorkHistory({ assetMaintenance }) {
  const { t } = useTranslation();
  const [calibrationWorks, setCalibrationWorks] = useState([]);
  const [showComfirmStartDate, setShowComfirmStartDate] = useState(false);
  const [preventiveOfModel, setPreventiveOfModel] = useState("");
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const [totalRecord, setTotalRecord] = useState(0);
  const { permissions } = useAuth();
  const [searchForm] = Form.useForm();

  useEffect(() => {
    if (page > 1) {
      fetchGetAssetCalibrationWorkHistorys();
    } else {
      fetchGetAssetCalibrationWorkHistorys(1);
    }
  }, [page]);

  const fetchGetAssetCalibrationWorkHistorys = async (_page) => {
    const values = cleanEmptyValues(searchForm.getFieldsValue());
    let payload = {
      page: _page || page,
      limit: PAGINATION.limit,
      assetMaintenance: assetMaintenance?.id || assetMaintenance?._id,
      code: values?.code,
      importance: values?.importance,
      startDate: values?.startDate,
      endDate: values?.endDate,
      calibrationName: values?.calibrationName,
    };
    if (values?.statuses && values?.statuses.length > 0) {
      payload.statuses = values?.statuses;
    }
    const res =
      await _unitOfWork.calibrationWork.getAssetCalibrationWorkHistorys(
        payload
      );
    if (res && res.code === 1) {
      setCalibrationWorks(res?.calibrationWorks?.results);
      setTotalRecord(res?.calibrationWorks?.totalResults);
    }
  };

  const onSearch = () => {
    setPage(1);
    fetchGetAssetCalibrationWorkHistorys(1);
  };

  const onCallBack = async (date, initialValue) => {};

  const onChangePagination = (value) => {
    setPage(value);
  };

  const resetSearch = () => {
    searchForm.resetFields();
    setPage(1);
    fetchGetAssetCalibrationWorkHistorys();
  };
  const onClickViewCalibrationWork = (value) => {
    navigate(staticPath.calibrationTaskView + "/" + (value._id || value.id));
  };
  const columns = [
    {
      title: t("calibration.stt"),
      dataIndex: "id",
      key: "id",
      width: "6vw",
      align: "center",
      render: (_text, _record, index) =>
        (page - 1) * PAGINATION.limit + index + 1,
    },

    {
      title: t("calibration.code"),
      dataIndex: "code",
      align: "center",
      className: "text-bold",
    },
    {
      title: t("calibration.calibration_name"),
      dataIndex: "calibrationName",
      ellipsis: true,
    },
    {
      title: t("calibration.status"),
      dataIndex: "status",
      align: "center",
      render: (status) => {
        const option = calibrationWorkStatus.Options.find(
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
      title: t("calibration.start_date"),
      dataIndex: "startDate",
      key: "startDate",
      align: "center",
      render: (text) => parseDateHH(text),
    },
    {
      title: t("calibration.importance"),
      dataIndex: "importance",
      align: "center",
      render: (text) => t(parseToLabel(priorityType.Option, text)),
    },
    {
      title: t("breakdown.list.columns.action"),
      dataIndex: "action",
      fixed: "right",
      align: "center",
      width: "6vw",
      render: (_, record) => {
        return (
          <div>
            {checkPermission(
              permissions,
              permissionCodeConstant.calibration_work_view_detail
            ) && (
              <Tooltip title={t("preventiveSchedule.list.tooltips.view")}>
                <Button
                  icon={<EyeOutlined />}
                  size="small"
                  onClick={() => onClickViewCalibrationWork(record)}
                  className="ml-2"
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
            <Form.Item id="" label={t("calibration.code")} name="code">
              <Input
                placeholder={t("calibration.placeholder.enter_code")}
              ></Input>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              id=""
              label={t("calibration.calibration_name")}
              name="calibrationName"
            >
              <Input
                placeholder={t("calibration.placeholder.calibration_name")}
              ></Input>
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
            <Form.Item label={t("breakdown.common.status")} name="statuses">
              <Select
                showSearch
                allowClear
                mode="multiple"
                placeholder={t("breakdown.common.status")}
                options={(calibrationWorkStatus.Options || []).map((item) => ({
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
          dataSource={calibrationWorks}
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
