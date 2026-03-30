import { useEffect, useState } from "react";
import {
  CheckSquareFilled,
  CloseSquareOutlined,
  DeleteOutlined,
  EditOutlined,
  LeftOutlined,
  PlusOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Input,
  message,
  Radio,
  Row,
  Select,
  Space,
  Table,
  Tooltip,
} from "antd";
import * as _unitOfWork from "../../../api";
import { useTranslation } from "react-i18next";
import TextArea from "antd/es/input/TextArea";
import useHeader from "../../../contexts/headerContext";
import { useNavigate, useParams } from "react-router-dom";

export default function UpdateAssetMaintenanceChecklist() {
  const { t } = useTranslation();
  const [assetModelChecklists, setAssetModelChecklists] = useState([]);
  const { setHeaderTitle } = useHeader();
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    fetchAssetMaintenanceChecklists();
  }, []);

  useEffect(() => {
    setHeaderTitle(t("assetMaintenanceModel.update_asset_maintenance_checklist"));
  }, [setHeaderTitle, t]);

  const fetchAssetMaintenanceChecklists = async () => {
    let res =
      await _unitOfWork.assetMaintenance.getAssetMaintenanceChecklistByRes({
        assetMaintenance: params?.id,
      });

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

  const onSave = async () => {
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
        `Dòng ${firstErrorRow}: Vui lòng nhập đầy đủ nội dung công việc!`,
      );
      return;
    }
    const payload = newData.map((item, index) => ({
      content: item.content.trim(),
      note: item.note?.trim() || "",
      index: index + 1, // ✅ STT chuẩn
    }));
    let res =
      await _unitOfWork.assetMaintenance.updateAssetMaintenanceChecklistByAssetMaintenance(
        {
          assetMaintenance: params.id,
          checklists: payload,
        },
      );
    if (res && res.code === 1) {
      message.success(t("notification.save_success"));
      fetchAssetMaintenanceChecklists();
    }
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
    {
      title: t("assetMaintenanceModel.table.actions"),
      align: "center",
      width: "10%",
      render: (_, record) => (
        <Tooltip title={t("common_buttons.delete")}>
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
    <div>
      <Card
        style={{ marginBottom: 16 }}
        // extra={
        //   <Space>
        //     <Col>

        //     </Col>
        //   </Space>
        // }
      >
        <div className="mb-2" style={{ textAlign: "end" }}>
          <Button
            onClick={() => navigate(-1)}
            icon={<LeftOutlined />}
            style={{ marginRight: 8 }}
          >
            {t("assetMaintenanceModel.back")}
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={onAddRow}>
            {t("assetMaintenanceModel.create_asset_model_checklist")}
          </Button>
        </div>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={assetModelChecklists}
          bordered
          pagination={false}
        />
        <div className="mt-2" style={{ textAlign: "center" }}>
          <Button type="primary" icon={<SaveOutlined />} onClick={onSave}>
            {t("common_buttons.save")}
          </Button>
        </div>
      </Card>
    </div>
  );
}
