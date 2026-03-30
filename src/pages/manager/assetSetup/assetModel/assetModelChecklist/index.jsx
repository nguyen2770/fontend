import { useEffect, useState } from "react";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Col,
  Form,
  message,
  Row,
  Table,
  Tooltip,
} from "antd";
import * as _unitOfWork from "../../../../../api";
import { useTranslation } from "react-i18next";
import TextArea from "antd/es/input/TextArea";

export default function AssetModelChecklist({ assetModel }) {
  const { t } = useTranslation();
  const [assetModelChecklists, setAssetModelChecklists] = useState([]);
  useState(null);
  const [form] = Form.useForm();
  useEffect(() => {
    if (assetModel) fetchAssetModelChecklists();
  }, [assetModel]);

  const fetchAssetModelChecklists = async () => {
    let res = await _unitOfWork.assetModelChecklist.getAssetModelChecklistByRes(
      {
        assetModel: assetModel.id,
      },
    );

    if (res && res.code === 1) {
      const sorted = [...res.data].sort(
        (a, b) => (a.index || 0) - (b.index || 0),
      );
      setAssetModelChecklists(sorted);
    }
  };

  const onAddRow = () => {
    setAssetModelChecklists((prev) => [
      ...prev,
      {
        id: `temp-${Date.now()}`,
        content: "",
        note: "",
        isNew: true,
      },
    ]);
  };

  const onSave = async () => {
    const values = form.getFieldsValue();
    let firstErrorRow = null;
    const newData = assetModelChecklists.map((item, index) => {
      const contentError = !item.content?.trim();
      if (contentError && firstErrorRow === null) {
        firstErrorRow = index + 1; // STT
      }
      return {
        ...item,
        contentError,
      };
    });

    setAssetModelChecklists(newData);

    if (firstErrorRow) {
      message.error(
        t("assetMaintenanceModel.row_error", { firstErrorRow: firstErrorRow }),
      );
      return;
    }
    const checkReset = values.checkResetAssetMaintenanceChecklist;
    const payload = newData.map((item, index) => ({
      content: item.content.trim(),
      note: item.note?.trim() || "",
      assetModel: assetModel.id,
      index: index + 1, // ✅ STT chuẩn
    }));

    let res = await _unitOfWork.assetModelChecklist.updateAssetModelChecklist(
      assetModel.id,
      {
        checklists: payload,
        checkReset,
      },
    );
    if (res && res.code === 1) {
      message.success(t("notification.save_success"));
      fetchAssetModelChecklists();
    }
  };

  const onClickDelete = (record) => {
    setAssetModelChecklists((prev) => {
      const filtered = prev.filter((item) => item.id !== record.id);
      // 🔥 Reset lại index
      return filtered.map((item, idx) => ({
        ...item,
        index: idx + 1,
      }));
    });
  };
  const handleChange = (value, record, field) => {
    setAssetModelChecklists((prev) =>
      prev.map((item) =>
        item.id === record.id ? { ...item, [field]: value } : item,
      ),
    );
  };

  const columns = [
    {
      title: t("assetMaintenanceModel.table.stt"),
      dataIndex: "index",
      render: (_t, _r, index) => _t || index + 1,
      width: "8%",
      align: "center",
    },
    {
      title: t("assetMaintenanceModel.table.checklist_name"),
      dataIndex: "content",
      render: (text, record) => (
        <TextArea
          value={text}
          status={record.contentError ? "error" : ""}
          placeholder={t("assetMaintenanceModel.placeholder.checklist_name")}
          onChange={(e) => handleChange(e.target.value, record, "content")}
        />
      ),
    },
    // {
    //   width: "30%",
    //   title: t("Ghi chú"),
    //   dataIndex: "note",
    //   render: (text, record) => (
    //     <TextArea
    //       value={text}
    //       onChange={(e) => handleChange(e.target.value, record, "note")}
    //     />
    //   ),
    // },
    // {
    //   title: t("workTask.columns.answer_type"),
    //   dataIndex: "answerTypeInspection",
    //   //   width: 250,
    //   align: "center",
    //   render: (_, record, itemIdx) => (
    //     <Select
    //       allowClear
    //       filterOption={filterOption}
    //       showSearch={true}
    //       value={record.answerTypeInspection}
    //       onChange={(value) =>
    //         handleChange(value, record, "answerTypeInspection")
    //       }
    //       className="wp-100"
    //       placeholder={t("workTask.placeholders.select_answer_type")}
    //       options={(answerTypes || []).map((item, key) => ({
    //         key: key,
    //         value: item.value,
    //         label: t(item.label),
    //       }))}
    //     />
    //   ),
    // },
    {
      title: t("assetMaintenanceModel.table.actions"),
      align: "center",
      width: "10%",
      render: (_, record) => (
        <Tooltip title="Xóa">
          <Button
            danger
            icon={<DeleteOutlined />}
            size="small"
            onClick={() => onClickDelete(record)}
          />
        </Tooltip>
      ),
    },
  ];

  return (
    <Form
      labelWrap
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      form={form}
      initialValues={{
        checkResetAssetMaintenanceChecklist: false,
      }}
      // onFinish={onSave}
    >
      <Row gutter={32}>
        <Col span={12}>
          <Form.Item
            labelAlign="left"
            name="checkResetAssetMaintenanceChecklist"
            valuePropName="checked"
          >
            <Checkbox style={{ fontWeight: 700 }}>
              {t(
                "assetMaintenanceModel.update_the_list_for_all_assets_belonging_to_this_model",
              )}
            </Checkbox>
          </Form.Item>
        </Col>
        <Col span={12} style={{ textAlign: "end" }}>
          <Button type="primary" icon={<PlusOutlined />} onClick={onAddRow}>
            {t("assetMaintenanceModel.create_asset_model_checklist")}
          </Button>
        </Col>
      </Row>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={assetModelChecklists}
        bordered
        pagination={false}
      />
      <div className="mt-3" style={{ textAlign: "center" }}>
        <Button type="primary" icon={<SaveOutlined />} onClick={onSave}>
          {t("common_buttons.save")}
        </Button>
      </div>
    </Form>
  );
}
