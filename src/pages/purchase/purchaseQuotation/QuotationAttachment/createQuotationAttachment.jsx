import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Table,
  Tooltip
} from "antd";
import { useRef, useState } from "react";
import {
  DeleteOutlined,
  InfoCircleOutlined,
  PlusOutlined
} from "@ant-design/icons";
import * as _unitOfWork from "../../../../api";
import { useTranslation } from "react-i18next";

export default function CreateQuotationAttachment({
  open,
  // handleOk,
  handleCancel,
  handleFinish
}) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [taskItems, setTaskItems] = useState([
    { key: 1, attachFileName: "", file: null, resourceType: "" }
  ]);
  const fileInputRefs = useRef([]);

  const handleFileChange = (idx, e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        Modal.error({
          title: "Lỗi",
          content: "File vượt quá 10MB!"
        });
        return;
      }
      const newItems = [...taskItems];
      newItems[idx].attachFileName = file.name;
      newItems[idx].file = file;
      setTaskItems(newItems);
    }
  };

  const onSubmit = async () => {
    // try {
    //   const uploadedItems = await Promise.all(
    //     taskItems.map(async (item) => {
    //       if (item.file) {
    //         const formData = new FormData();
    //         formData.append("file", item.file);
    //         const res = await _unitOfWork.resource.uploadImage(formData);
    //         if (res) {
    //           return { ...res, resourceType: item.resourceType };
    //         }
    //       }
    //     })
    //   );
    //   handleOk(uploadedItems);
    //   handleCancel();
    //   setTaskItems([
    //     { key: 1, attachFileName: "", file: null, resourceType: "" }
    //   ]);
    // } catch {
    //   Modal.error({ title: "Lỗi", content: t("common.messages.errors.failed") });
    // }

    handleFinish(taskItems);
    console.log(taskItems)
    setTaskItems([
      { key: 1, attachFileName: "", file: null, resourceType: "" }
    ]);
    handleCancel();

  };

  const handleAdd = () => {
    setTaskItems([
      ...taskItems,
      {
        key: Date.now(),
        attachFileName: "",
        file: null,
        attachmentFilePath: "",
        resourceType: ""
      }
    ]);
  };

  const handleFileSelect = (idx) => {
    if (fileInputRefs.current[idx]) {
      fileInputRefs.current[idx].click();
    }
  };

  const handleResourceTypeChange = (idx, e) => {
    const newItems = [...taskItems];
    newItems[idx].resourceType = e.target.value;
    setTaskItems(newItems);
  };

  const handleDelete = (idx) => {
    if (taskItems.length < 1) return;
    setTaskItems(taskItems.filter((_, i) => i !== idx));
  };

  const columns = [
    {
      title: t("purchaseQuotation.tableDetail.index"),
      dataIndex: "stt",
      width: 60,
      align: "center",
      render: (_text, _record, idx) => idx + 1
    },
    {
      title: t("purchaseQuotation.attachment.file_type"),
      dataIndex: "resourceType",
      render: (_text, record, idx) => (
        <Input
          style={{ width: "100%" }}
          placeholder={t(
            "purchaseQuotation.attachment.file_type"
          )}
          value={record.resourceType}
          onChange={(e) => handleResourceTypeChange(idx, e)}
        />
      )
    },
    {
      title: (
        <span>
          {t("purchaseQuotation.attachment.document_field")}{" "}
          <Tooltip
            title={t("purchaseQuotation.attachment.hint")}
          >
            <InfoCircleOutlined style={{ color: "#1890ff" }} />
          </Tooltip>
        </span>
      ),
      dataIndex: "attachFileName",
      render: (_text, record, idx) => (
        <div>
          <Input
            readOnly
            value={record.attachFileName}
            placeholder={t(
              "purchaseQuotation.attachment.choose_file_placeholder"
            )}
            onClick={() => handleFileSelect(idx)}
          />
          <input
            type="file"
            style={{ display: "none" }}
            ref={(el) => (fileInputRefs.current[idx] = el)}
            onChange={(e) => handleFileChange(idx, e)}
          />
        </div>
      )
    },
    {
      title: t("purchaseQuotation.tableDetail.action"),
      dataIndex: "action",
      width: 100,
      align: "center",
      render: (_text, _record, idx) => (
        <Tooltip title={t("purchase.actions.delete")}>
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(idx)}
            disabled={taskItems.length < 1}
          />
        </Tooltip>
      )
    }
  ];

  return (
    <Modal
      open={open}
      footer={false}
      onCancel={handleCancel}
      width={800}
      className="custom-modal"
    >
      <Card title={t("purchaseQuotation.attachment.title")}>
        <Row>
          <Col span={24} style={{ textAlign: "end" }}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              className="mb-1"
              onClick={handleAdd}
            >
              {t("purchaseQuotation.attachment.add_button")}
            </Button>
            <Table
              columns={columns}
              dataSource={taskItems}
              pagination={false}
              rowKey={(record) => record.key}
            />
          </Col>
          <div className="modal-footer">
            <Button onClick={handleCancel}>
              {t("purchaseQuotation.attachment.footer.close")}
            </Button>
            <Button
              type="primary"
              htmlType="button"
              disabled={taskItems.some((i) => !i.file)}
              onClick={onSubmit}
            >
              {t("purchaseQuotation.attachment.footer.submit")}
            </Button>
          </div>
        </Row>
      </Card>
    </Modal>
  );
}