import { useEffect, useState } from "react";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  Input,
  message,
  Radio,
  Row,
  Select,
  Table,
  Tooltip,
} from "antd";
import * as _unitOfWork from "../../../api";
import { useTranslation } from "react-i18next";
import TextArea from "antd/es/input/TextArea";

export default function AssetMaintenanceChecklist({ assetMaintenance, disabledTrue }) {
  const { t } = useTranslation();
  const [assetModelChecklists, setAssetModelChecklists] = useState([]);
  useState(null);
  useEffect(() => {
    if (assetMaintenance) fetchAssetMaintenanceChecklists();
  }, [assetMaintenance]);

  const fetchAssetMaintenanceChecklists = async () => {
    let res = await _unitOfWork.assetMaintenance.getAssetMaintenanceChecklistByRes(
      {
        assetMaintenance: assetMaintenance.id || assetMaintenance._id,
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
        answerTypeInspection: null,
        isNew: true,
      },
    ]);
  };


  const onClickDelete = (record) => {
    setAssetModelChecklists((prev) =>
      prev.filter((item) => item.id !== record.id),
    );
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
      title: t("STT"),
      dataIndex: "index",
      render: (_t, _r, index) => _t || index + 1,
      width: "8%",
      align: "center",
    },
    {
      title: t("Nội dung"),
      dataIndex: "content",
      render: (text, record) => (
        <TextArea
          value={text}
          disabled={disabledTrue}
          status={record.contentError ? "error" : ""}
          placeholder={t("Nội dung công việc")}
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
    // {
    //   title: t("Thao tác"),
    //   align: "center",
    //   width: "10%",
    //   render: (_, record) => (
    //     <Tooltip title="Xóa">
    //       <Button
    //         danger
    //         icon={<DeleteOutlined />}
    //         size="small"
    //         onClick={() => onClickDelete(record)}
    //       />
    //     </Tooltip>
    //   ),
    // },
  ];

  return (
    <div>
      {/* <div className="mb-3" style={{ textAlign: "end" }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={onAddRow}>
          Thêm công việc kiểm tra
        </Button>
      </div> */}
      <Table
        rowKey="id"
        columns={columns}
        dataSource={assetModelChecklists}
        bordered
        pagination={false}
      />
    </div>
  );
}
