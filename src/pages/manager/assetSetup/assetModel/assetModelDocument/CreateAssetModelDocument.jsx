import { Button, Card, Col, Form, Input, Modal, Row, Select, Table, Tooltip } from "antd";
import { useRef, useState } from "react";
import { DeleteOutlined, InfoCircleOutlined, PlusOutlined } from "@ant-design/icons";
import * as _unitOfWork from "../../../../../api";
import { assetModelDocumentCategory } from "../../../../../utils/constant";
import { useTranslation } from "react-i18next";

export default function CreateAssetModelDocument({
  open,
  handleOk,
  handleCancel,
  onRefresh,
  assetModel
}) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [taskItems, setTaskItems] = useState([
    { key: 1, attachFileName: "", file: null, documentCategory: "" }
  ]);
  const fileInputRefs = useRef([]);

  const onFinish = async () => {
    try {
      const uploadedItems = await Promise.all(
        taskItems.map(async (item) => {
          let resourceId = "";
          if (item.file) {
            const formData = new FormData();
            formData.append("file", item.file);
            const res = await _unitOfWork.resource.uploadImage(formData);
            resourceId = res.resourceId;
          }
          return {
            assetModel: assetModel.id || assetModel._id,
            resourceId,
            documentCategory: item.documentCategory
          };
        })
      );

      const res =
        await _unitOfWork.assetModelDocument.createAssetModelDocument({
          resources: uploadedItems
        });
      if (res?.code === 1) {
        Modal.success({
          title: t("assetModel.document.messages.create_success")
        });

        setTaskItems([{
          key: Date.now(),
          attachFileName: "",
          file: null,
          documentCategory: ""
        }])
        handleCancel();
        onRefresh();
      } else {
        Modal.error({
          title: t("assetModel.document.messages.create_error")
        });
      }
    } catch {
      Modal.error({
        title: t("assetModel.document.messages.create_error")
      });
    }
  };

  const handleFileSelect = (idx) => {
    fileInputRefs.current[idx]?.click?.();
  };

  const handleFileChange = (idx, e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024 * 1024) {
        Modal.error({
          title: t("assetModel.common.messages.upload_error_size")
        });
        return;
      }
      const newItems = [...taskItems];
      newItems[idx].attachFileName = file.name;
      newItems[idx].file = file;
      setTaskItems(newItems);
    }
  };

  const handleAdd = () => {
    setTaskItems([
      ...taskItems,
      {
        key: Date.now(),
        attachFileName: "",
        file: null,
        documentCategory: ""
      }
    ]);
  };

  const handleDocumentCategoryChange = (idx, value) => {
    const newItems = [...taskItems];
    newItems[idx].documentCategory = value;
    setTaskItems(newItems);
  };

  const handleDelete = (idx) => {
    setTaskItems(taskItems.filter((_, i) => i !== idx));
  };

  const isFormValid = () =>
    taskItems.every(
      (item) => item.documentCategory && (item.file)
    );

  const columns = [
    {
      title: t("assetModel.common.table.index"),
      dataIndex: "stt",
      width: 60,
      align: "center",
      render: (_text, _record, idx) => idx + 1
    },
    {
      title: t("assetModel.document.table.category"),
      dataIndex: "documentCategory",
      render: (_text, record, idx) => (
        <Select
          style={{ width: "100%" }}
          value={record.documentCategory}
          placeholder={t("assetModel.document.fields.category_placeholder")}
          onChange={(value) => handleDocumentCategoryChange(idx, value)}
        >
          {Object.entries(assetModelDocumentCategory).map(([key, label]) => (
            <Select.Option key={key} value={key}>
              {t(label)}
            </Select.Option>
          ))}
        </Select>
      )
    },
    {
      title: (
        <span>
          {t("assetModel.document.fields.file_full")}{" "}
          <Tooltip
            title={t(
              "assetModel.document.fields.tooltip_file_rules"
            )}
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
              "assetModel.document.fields.file_placeholder"
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
      title: t("assetModel.common.table.action"),
      dataIndex: "action",
      width: 90,
      align: "center",
      render: (_text, _record, idx) => (
        <Tooltip title={t("assetModel.common.buttons.delete")}>
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

  const onCancel = () => {
    handleCancel();
    form.resetFields();
    setTaskItems([{ key: 1, attachFileName: "", file: null, documentCategory: "" }]);
  };

  return (
    <Modal
      open={open}
      closable={false}
      className="custom-modal"
      footer={false}
      width={820}
      destroyOnClose
    >
      <Card title={t("assetModel.document.create_title")}>
        <Row>
          <Col span={24} style={{ textAlign: "right" }} className="mb-2">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAdd}
              className="mb-2"
            >
              {t("assetModel.common.buttons.add")}
            </Button>
            <Table
              columns={columns}
              dataSource={taskItems}
              pagination={false}
              rowKey="key"
              className="custom-table"
            />
          </Col>
          <div className="modal-footer">
            <Button onClick={onCancel}>
              {t("assetModel.common.buttons.close")}
            </Button>
            <Button
              type="primary"
              disabled={!isFormValid()}
              onClick={onFinish}
            >
              {t("assetModel.common.buttons.create")}
            </Button>
          </div>
        </Row>
      </Card>
    </Modal>
  );
}