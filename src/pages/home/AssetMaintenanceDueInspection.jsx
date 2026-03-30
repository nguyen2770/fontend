import { useEffect, useState } from "react";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  RedoOutlined,
  SearchOutlined,
  RightSquareOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Pagination,
  Row,
  Table,
  Tooltip,
} from "antd";
import { useTranslation } from "react-i18next";
import {
  assetType,
  FORMAT_DATE,
  frequencyOptions,
  PAGINATION,
} from "../../utils/constant";
import * as _unitOfWork from "../../api";
import { parseDate } from "../../helper/date-helper";
import { parseToLabel } from "../../helper/parse-helper";
import { staticPath } from "../../router/routerConfig";
export default function AssetMaintenanceDueInspection() {
  const { t } = useTranslation();
  const [totalRecord, setTotalRecord] = useState(0);
  const [page, setPage] = useState(1);
  const [assetMaintenances, setAssetMaintenances] = useState([]);
  const [pagination, setPagination] = useState({ ...PAGINATION });
  const [form] = Form.useForm();
  // chưa sử dụng
  useEffect(() => {
    if (page > 1) {
      fetchAssetMaintenanceDueInspections();
    } else {
      fetchAssetMaintenanceDueInspections(1);
    }
  }, [page]);

  const fetchAssetMaintenanceDueInspections = async (_page) => {
    let res =
      await _unitOfWork.assetMaintenance.getAssetMaintenanceDueInspections({
        page: _page || page,
        limit: pagination.limit,
        ...form.getFieldsValue(),
      });
    if (res && res.code === 1) {
      setAssetMaintenances(res?.data?.results);
      setTotalRecord(res?.data?.totalResults || 0);
    }
  };
  const onClickView = (record) => {
    window.open(staticPath.viewAssetMaintenance + "/" + record.id, "_blank");
  };
  const onSearch = () => {
    setPage(1);
    fetchAssetMaintenanceDueInspections();
  };
  const columns = [
    {
      title: t("dashboard.inspection_calibration_due_date.table.stt"),
      dataIndex: "id",
      key: "id",
      width: "5%",
      align: "center",
      render: (_text, _record, index) =>
        (page - 1) * PAGINATION.limit + index + 1,
    },
    {
      dataIndex: "asset",
      key: "asset",
      title: t("dashboard.inspection_calibration_due_date.table.asset_name"),
      render: (_text, record) => <span>{record?.asset?.assetName}</span>,
    },
    {
      dataIndex: "assetNumber",
      key: "assetNumber",
      title: t("dashboard.inspection_calibration_due_date.table.asset_number"),
    },
    {
      dataIndex: "serial",
      key: "serial",
      title: t("dashboard.inspection_calibration_due_date.table.serial"),
    },
    {
      dataIndex: "assetModel",
      key: "assetModel",
      title: t("dashboard.inspection_calibration_due_date.table.model"),
      render: (_text, record) => (
        <span>{record?.assetModel?.assetModelName}</span>
      ),
    },
    {
      title: t("dashboard.inspection_calibration_due_date.table.asset_type"),
      dataIndex: "assetStyle",
      align: "center",
      className: "text-left-column",
      render: (text, record) => parseToLabel(assetType.Options, text),
    },
    {
      title: t("dashboard.inspection_calibration_due_date.table.customer"),
      dataIndex: "assetStyle",
      render: (text, record) => <span>{record?.customer?.customerName}</span>,
    },
    {
      dataIndex: "nextInspectionDate",
      key: "nextInspectionDate",
      title: t(
        "dashboard.inspection_calibration_due_date.table.inspection_date_next"
      ),
      align: "center",
      className: "text-bold",
      render: (_text, record) => parseDate(record?.nextInspectionDate),
    },
    {
      title: t("dashboard.inspection_calibration_due_date.table.action"),
      dataIndex: "action",
      align: "center",
      fixed: "right",
      render: (_, record) => (
        <div>
          <Tooltip
            title={t(
              "dashboard.inspection_calibration_due_date.table.detail_button"
            )}
          >
            <Button
              type="primary"
              icon={<RightSquareOutlined />}
              size="small"
              onClick={() => onClickView(record)}
            />
          </Tooltip>
        </div>
      ),
    },
  ];
  const onChangePagination = (value) => {
    setPage(value);
  };
  const resetSearch = () => {
    form.resetFields();
    setPage(1);
    fetchAssetMaintenanceDueInspections(1);
  };
  return (
    <div className="p-3">
      <Form labelWrap form={form} layout="vertical" className="mb-2" onFinish={onSearch}>
        <Row gutter={[16, 16]} style={{ width: "100%" }}>
          <Col span={6}>
            <Form.Item
              label={t(
                "dashboard.inspection_calibration_due_date.asset_number"
              )}
              name="assetNumber"
              labelAlign="left"
            >
              <Input
                placeholder={t(
                  "dashboard.inspection_calibration_due_date.enter_asset_number"
                )}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label={t("dashboard.inspection_calibration_due_date.serial")}
              name="serial"
              labelAlign="left"
            >
              <Input
                placeholder={t(
                  "dashboard.inspection_calibration_due_date.enter_serial"
                )}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label={t(
                "dashboard.inspection_calibration_due_date.next_inspection_date"
              )}
              name="nextInspectionDate"
              labelAlign="left"
            >
              <DatePicker
                style={{ width: "100%" }}
                placeholder={t(
                  "dashboard.inspection_calibration_due_date.chosse_inspection_date"
                )}
                format={FORMAT_DATE}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 16]} style={{ width: "100%" }}>
          <Col span={12}>
            <Button type="primary" className="mr-2" htmlType="submit">
              <SearchOutlined />
              {t("dashboard.inspection_calibration_due_date.search")}
            </Button>
            <Button className="bt-green mr-2" onClick={resetSearch}>
              <RedoOutlined />
              {t("dashboard.inspection_calibration_due_date.refresh")}
            </Button>
          </Col>
          <Col span={12} style={{ textAlign: "end" }}>
            <span style={{ fontWeight: 600, fontSize: "16px" }}>
              {t("dashboard.inspection_calibration_due_date.total", {
                count: totalRecord,
              })}
            </span>
          </Col>
        </Row>
      </Form>
      <Table
        rowKey="id"
        columns={columns}
        key={"id"}
        dataSource={assetMaintenances}
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
    </div>
  );
}
