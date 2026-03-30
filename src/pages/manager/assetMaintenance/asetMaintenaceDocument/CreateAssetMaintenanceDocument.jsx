import {
  Button,
  Card,
  Col,
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

const createEmptyItem = () => ({
  uid: crypto.randomUUID(),
  documentCategory: "",
  file: null
});

export default function CreateAssetMaintenanceDocument({
  open,
  handleCancel,
  AssetMaintenance,
  isStandalone,
  onRefresh,
  onChangeFiles
}) {
  const { t } = useTranslation();
  const [items, setItems] = useState([createEmptyItem()]);
  const fileRefs = useRef({});

  const isValid = items.every(i => i.documentCategory && i.file);

  const onFinish = async () => {
    if (isStandalone) {
      onChangeFiles?.(items);
      handleCancel();
      setItems([createEmptyItem()]);
      return;
    }

    try {
      const payload = await Promise.all(
        items.map(async (i) => {
          const fd = new FormData();
          fd.append("file", i.file);
          const res = await _unitOfWork.resource.uploadImage(fd);

          return {
            assetMaintenance:
              AssetMaintenance.id || AssetMaintenance._id,
            documentCategory: i.documentCategory,
            resource: res.resourceId
          };
        })
      );

      const res =
        await _unitOfWork.assetMaintenanceDocument
          .createAssetMaintenanceDocument(payload);

      if (res?.code === 1) {
        Modal.success({
          title: t("assetModel.document.messages.create_success")
        });
        onRefresh();
        handleCancel();
        setItems([createEmptyItem()]);
      }
    } catch {
      Modal.error({
        title: t("assetModel.document.messages.create_error")
      });
    }
  };

  const columns = [
    {
      title: t("assetModel.common.table.index"),
      width: 60,
      align: "center",
      render: (_t, _r, i) => i + 1
    },
    {
      title: t("assetModel.document.table.category"),
      render: (_, r) => (
        <Input
          value={r.documentCategory}
          onChange={e =>
            setItems(items =>
              items.map(i =>
                i.uid === r.uid
                  ? { ...i, documentCategory: e.target.value }
                  : i
              )
            )
          }
        />
      )
    },
    {
      title: (
        <>
          {t("assetModel.document.fields.file_full")}
          <Tooltip title={t("assetModel.document.fields.tooltip_file_rules")}>
            <InfoCircleOutlined className="ml-1" />
          </Tooltip>
        </>
      ),
      render: (_, r) => (
        <>
          <Input
            readOnly
            value={r.file?.name}
            onClick={() => fileRefs.current[r.uid]?.click()}
          />
          <input
            type="file"
            hidden
            ref={el => (fileRefs.current[r.uid] = el)}
            onChange={e => {
              const file = e.target.files[0];
              if (!file) return;
              setItems(items =>
                items.map(i =>
                  i.uid === r.uid ? { ...i, file } : i
                )
              );
            }}
          />
        </>
      )
    },
    {
      title: t("assetModel.common.table.action"),
      render: (_, r) => (
        <Button
          danger
          icon={<DeleteOutlined />}
          disabled={items.length === 1}
          onClick={() =>
            setItems(items => items.filter(i => i.uid !== r.uid))
          }
        />
      )
    }
  ];

  return (
    <Modal open={open} footer={false} closable={false} width={820} className="custom-modal">
      <Card title={t("assetModel.document.create_title")}>
        <Row>
          <Col span={24} style={{ textAlign: "right" }}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() =>
                setItems(items => [...items, createEmptyItem()])
              }
              className="mb-2"
            >
              {t("assetModel.common.buttons.add")}
            </Button>

            <Table
              rowKey="uid"
              columns={columns}
              dataSource={items}
              pagination={false}
              className="mt-2"
            />
          </Col>

          <div className="modal-footer">
            <Button onClick={handleCancel}>
              {t("assetModel.common.buttons.close")}
            </Button>
            <Button
              type="primary"
              disabled={!isValid}
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