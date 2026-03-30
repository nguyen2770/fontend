import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as _unitOfWork from "../../../api";
import {
  Button,
  Card,
  Checkbox,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  Row,
  Select,
  Table,
} from "antd";
import { useTranslation } from "react-i18next";
import { LeftOutlined } from "@ant-design/icons";
import { FORMAT_DATE, propertyInspectionStatus } from "../../../utils/constant";
import dayjs from "dayjs";
import { filterOption } from "../../../helper/search-select-helper";
import { staticPath } from "../../../router/routerConfig";
import ModalFileInWork from "../../report/general/ModalFileInWork";
import ListAttachment from "../../../components/attchment/ListAttachment";

export default function ViewPropertyInspection() {
  const params = useParams();
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const nagivate = useNavigate();
  const [propertyInspectionTasks, setPropertyInspectionTasks] = useState([]);
  const [breakdown, setBreakdown] = useState(null);
  const [listFiles, setListFiles] = useState([]);

  useEffect(() => {
    fetchData();
  }, [params.id]);

  const fetchData = async () => {
    const res = await _unitOfWork.propertyInspection.getPropertyInspectionById(
      params.id,
      {},
    );
    if (res && res.code === 1) {
      setPropertyInspectionTasks(res?.propertyInspectionTasks);
      setBreakdown(res.propertyInspection?.breakdown);
      form.setFieldsValue({
        ...res.propertyInspection,
        inspectionDate: res.propertyInspection?.inspectionDate
          ? dayjs(res.propertyInspection?.inspectionDate)
          : null,
        assetName: res.propertyInspection?.assetMaintenance?.assetName || "",
        manufacturerName:
          res.propertyInspection?.assetMaintenance?.manufacturerName || "",
        assetNumber:
          res.propertyInspection?.assetMaintenance?.assetNumber || "",
        serial: res.propertyInspection?.assetMaintenance?.serial || "",
        assetModelName:
          res.propertyInspection?.assetMaintenance?.assetModelName || "",
        categoryName:
          res.propertyInspection?.assetMaintenance?.categoryName || "",
        nameUser:
          res?.propertyInspection?.nameUser ||
          res?.propertyInspection?.createdBy?.fullName,
      });
      let files = [];
      if (
        res?.assetMaintenanceAttachments &&
        res.assetMaintenanceAttachments.length > 0
      ) {
        files = await Promise.all(
          res.assetMaintenanceAttachments.map(async (doc) => {
            const rawPath = doc.resource?.filePath;
            if (!rawPath) return "";
            const normalizedPath = rawPath.replace(/\\/g, "/");
            const parts = normalizedPath.split("uploads/");
            const relativePath = parts.length > 1 ? parts[1] : normalizedPath;
            return {
              ...doc,
              relativePath: relativePath,
            };
          }),
        );
      }
      setListFiles(files);
    }
  };
  const onClickViewBreakdown = () => {
    nagivate(
      staticPath.viewWorkOrderBreakdown + "/" + (breakdown.id || breakdown._id),
    );
  };
  const columns = [
    {
      title: t("propertyInspection.table.stt"),
      dataIndex: "index",
      align: "center",
      width: "5%",
    },
    {
      title: t("propertyInspection.table.content"),
      dataIndex: "content",
    },
    {
      title: t("propertyInspection.table.complete_the_task"),
      dataIndex: "status",
      width: "25%",
      align: "center",
      render: (_, record) => (
        <Checkbox
          checked={record.status || false}
          // onChange={(e) => handleStatusChange(e.target.checked, record)}
        />
      ),
    },
  ];
  return (
    <div className="" style={{ background: "#fff" }}>
      <Card
        extra={
          <>
            <Button onClick={() => nagivate(-1)}>
              <LeftOutlined />
              {t("common_buttons.back")}
            </Button>
          </>
        }
      >
        <Form
          labelWrap
          layout="horizontal"
          form={form}
          labelCol={{
            span: 9,
          }}
          wrapperCol={{
            span: 15,
          }}
          style={{ padding: "15px" }}
        >
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item label={t("Code")} name="code" labelAlign="left">
                <Input disabled></Input>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t("preventive.common.asset")}
                name="assetName"
                labelAlign="left"
              >
                <Input disabled></Input>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t("myTask.asset_details.asset_number")}
                name="assetNumber"
                labelAlign="left"
              >
                <Input disabled></Input>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t("myTask.asset_details.serial")}
                name="serial"
                labelAlign="left"
              >
                <Input disabled></Input>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t("myTask.asset_details.model")}
                name="assetModelName"
                labelAlign="left"
              >
                <Input disabled></Input>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t("myTask.asset_details.main_category")}
                name="categoryName"
                labelAlign="left"
              >
                <Input disabled></Input>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t("myTask.asset_details.manufacturer")}
                name="manufacturerName"
                labelAlign="left"
              >
                <Input disabled></Input>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t("propertyInspection.table.name_user")}
                name="nameUser"
                labelAlign="left"
              >
                <Input disabled></Input>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t("propertyInspection.inspection_date")}
                name="inspectionDate"
                labelAlign="left"
              >
                <DatePicker
                  disabled
                  format={FORMAT_DATE}
                  style={{ width: "100%" }}
                  allowClear
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t("propertyInspection.table.status")}
                name="status"
                labelAlign="left"
              >
                <Select
                  showSearch
                  allowClear
                  disabled
                  options={(propertyInspectionStatus.Options || []).map(
                    (item) => ({
                      value: item.value,
                      label: t(item.label),
                    }),
                  )}
                  filterOption={filterOption}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t("propertyInspection.table.note")}
                name="note"
                labelAlign="left"
              >
                <Input disabled></Input>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            {breakdown && (
              <Col span={12}>
                <Form.Item
                  label={t("propertyInspection.breakdown")}
                  name=""
                  labelAlign="left"
                >
                  <a
                    style={{ fontWeight: 700 }}
                    onClick={() => onClickViewBreakdown()}
                  >
                    {breakdown.code}
                  </a>
                </Form.Item>
              </Col>
            )}
          </Row>
          <Divider>{t("propertyInspection.checklist")}</Divider>
          <Row>
            <Col span={24}>
              <Table
                columns={columns}
                dataSource={propertyInspectionTasks}
                rowKey="uid"
                pagination={false}
                size="middle"
                className="checklist-table"
              />
            </Col>
            <Col span={24}>
              <ListAttachment listDocuments={listFiles} />
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  );
}
