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
  message,
  Row,
  Select,
  Table,
} from "antd";
import { useTranslation } from "react-i18next";
import { LeftOutlined, PlusOutlined } from "@ant-design/icons";
import {
  FORMAT_DATE,
  priorityLevelStatus,
  propertyInspectionStatus,
} from "../../../utils/constant";
import dayjs from "dayjs";
import { filterOption } from "../../../helper/search-select-helper";
import ShowError from "../../../components/modal/result/errorNotification";
import ShowSuccess from "../../../components/modal/result/successNotification";
import AttachmentModel from "../../../components/modal/attachmentModel/AttachmentModel";

export default function UpdatePropertyInspection() {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const nagivate = useNavigate();
  const [propertyInspectionTasks, setPropertyInspectionTasks] = useState([]);
  const [fileLists, setFileLists] = useState([]);
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    fetchData();
  }, [params.id]);

  const fetchData = async () => {
    const res = await _unitOfWork.propertyInspection.getPropertyInspectionById(
      params.id,
      {},
    );
    if (res && res.code === 1) {
      const formattedData = res.propertyInspectionTasks.map((item, index) => ({
        ...item,
        uid: item._id || index, // đảm bảo unique
        index: index + 1,
        status: item.status || false,
      }));
      setPropertyInspectionTasks(formattedData);
      form.setFieldsValue({
        ...res.propertyInspection,
        inspectionDate: res.propertyInspection?.inspectionDate
          ? dayjs(res.propertyInspection?.inspectionDate)
          : null,
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
            return {
              ...doc?.resource,
              id: doc?.resource?.id,
              name: doc?.resource?.fileName + doc?.resource?.extension,
              src: _unitOfWork.resource.getImage(doc?.resource?.id),
              supportDocumentId: doc?.resource?.id,
            };
          }),
        );
      }
      setFileLists(files);
    }
  };

  const onFinish = async () => {
    const values = form.getFieldsValue();
    const newSupportDocuments = [];
    if (fileLists) {
      for (let i = 0; i < fileLists.length; i++) {
        const file = fileLists[i];
        const resUpload = await _unitOfWork.resource.uploadImage({
          file: file?.originFileObj,
        });
        if (resUpload && resUpload.code === 1) {
          newSupportDocuments.push({
            resource: resUpload.resourceId,
          });
        }
      }
    }
    const payload = {
      propertyInspectionId: params.id,
      ...values,
      checklistItems: propertyInspectionTasks.map((item) => ({
        content: item.content,
        status: item.status,
        index: item.index,
      })),
      listDocuments: newSupportDocuments,
    };
    console.log(payload);
    try {
      const res =
        await _unitOfWork.propertyInspection.updatePropertyInspectionById(
          payload,
        );
      if (res && res.code === 1) {
        navigate(-1);
        ShowSuccess(
          "topRight",
          t("notification.title"),
          t("taxGroup.update_success"),
        );
      }
    } catch (error) {
      message.error("spareCategory.messages.update_error");
    }
  };
  const handleStatusChange = (checked, record) => {
    setPropertyInspectionTasks((prev) =>
      prev.map((item) =>
        item.uid === record.uid ? { ...item, status: checked } : item,
      ),
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
          onChange={(e) => handleStatusChange(e.target.checked, record)}
        />
      ),
    },
  ];
  return (
    <div className="" style={{ background: "#fff" }}>
      <Form
        labelWrap
        layout="horizontal"
        form={form}
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        onFinish={onFinish}
      >
        <Card
          extra={
            <>
              <Button onClick={() => nagivate(-1)}>
                <LeftOutlined />
                {t("common_buttons.back")}
              </Button>
              <Button className="ml-2" type="primary" htmlType="submit">
                <PlusOutlined />
                {t("common_buttons.update")}
              </Button>
            </>
          }
        >
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item
                label={t("propertyInspection.table.name_user")}
                name="nameUser"
                labelAlign="left"
              >
                <Input></Input>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t("propertyInspection.inspection_date")}
                name="inspectionDate"
                labelAlign="left"
              >
                <DatePicker
                  format={FORMAT_DATE}
                  style={{ width: "100%" }}
                  allowClear
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t("propertyInspection.table.note")}
                name="note"
                labelAlign="left"
              >
                <Input></Input>
              </Form.Item>
            </Col>
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
          </Row>
          <Row>
            <Col span={24}>
              <AttachmentModel
                value={fileLists}
                notSize={true}
                onChange={setFileLists}
              />
            </Col>
          </Row>
        </Card>
      </Form>
    </div>
  );
}
