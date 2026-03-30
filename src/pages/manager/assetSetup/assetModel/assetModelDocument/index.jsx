import { useEffect, useState } from "react";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Col, Row, Table, Tooltip } from "antd";
import CreateAssetModelDocument from "./CreateAssetModelDocument";
import UpdateAssetModelDocument from "./UpdateAssetModelDocument";
import { generateFullUrl } from "../../../../../api/restApi";
import * as _unitOfWork from "../../../../../api";
import Comfirm from "../../../../../components/modal/Confirm";
import { assetModelDocumentCategory } from "../../../../../utils/constant";
import { useTranslation } from "react-i18next";
import TabAttachment from "../../../../../components/fileViewer/TabAttachment";

export default function AssetModelDocument({
  assetModel,
  notButtonDeleteDocument = true,
  notButtonUpdateDocument = true,
  notButtonCreateDocuemnt = true,
}) {
  const { t } = useTranslation();
  const [isOpenCreate, setIsOpenCreate] = useState(false);
  const [isOpenUpdate, setIsOpenUpdate] = useState(false);
  const [assetModelDocuments, setAssetModelDocuments] = useState([]);
  const [assetModelDocumentChange, setAssetModelDocumentChange] =
    useState(null);

  useEffect(() => {
    if (assetModel) {
      fetchAssetModelDocuments();
    }
  }, [assetModel]);

  const fetchAssetModelDocuments = async () => {
    const res =
      await _unitOfWork.assetModelDocument.getAssetModelDocumentByAssetModel({
        assetModel: assetModel.id || assetModel._id,
      });
    if (res && res.code === 1) {
      const data = res.data.map(item => {
        return {
          ...item,
          id: item._id,
        }
      });
      console.log(data);
      setAssetModelDocuments(data);
    }
  };

  const onClickUpdate = (values) => {
    setIsOpenUpdate(true);
    setAssetModelDocumentChange(values);
  };

  const onClickDelete = async (values) => {
    const res = await _unitOfWork.assetModelDocument.deleteAssetModelDocument({
      id: values.id,
    });
    if (res && res.code === 1) {
      fetchAssetModelDocuments();
    }
  };

  const columns = [
    {
      title: t("assetModel.common.table.index"),
      dataIndex: "key",
      align: "center",
      width: 60,
      render: (_text, _record, index) => index + 1,
    },
    {
      title: t("assetModel.document.table.category"),
      dataIndex: "documentCategory",
      align: "center",
      className: "text-left-column",
      render: (text) =>
        t(assetModelDocumentCategory[text]) ||
        t("assetModel.common.messages.unknown"),
    },
    {
      title: t("assetModel.document.table.file"),
      dataIndex: "resourceId",
      align: "center",
      className: "text-left-column",
      render: (resourceId) => {
        if (!resourceId) return t("assetModel.common.messages.no_file");
        return (
          <a
            href={`${generateFullUrl()}/resource/image/${resourceId.id}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {resourceId.fileName}
          </a>
        );
      },
    },
    {
      title: t("assetModel.common.table.action"),
      dataIndex: "action",
      align: "center",
      width: 90,
      render: (_, record) => (
        <div>
          {notButtonUpdateDocument && (
            <Tooltip title={t("assetModel.common.buttons.update")}>
              <Button
                type="primary"
                icon={<EditOutlined />}
                size="small"
                onClick={() => onClickUpdate(record)}
              />
            </Tooltip>
          )}
          {notButtonDeleteDocument && (
            <Tooltip title={t("assetModel.common.buttons.delete")}>
              <Button
                type="primary"
                danger
                icon={<DeleteOutlined />}
                size="small"
                className="ml-2"
                onClick={() =>
                  Comfirm(t("assetModel.common.messages.confirm_delete"), () =>
                    onClickDelete(record),
                  )
                }
              />
            </Tooltip>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      {/* <Row className="mb-1">
        <Col span={24} style={{ textAlign: "right" }}>
          {notButtonCreateDocuemnt && (
            <Button
              type="primary"
              onClick={() => setIsOpenCreate(true)}
              className="ml-3"
            >
              <PlusOutlined /> {t("assetModel.document.list_add_button")}
            </Button>
          )}
        </Col>
      </Row> */}
      <TabAttachment
        listDocuments={assetModelDocuments}
        onClickDelete={onClickDelete}
        onClickCreate={() => setIsOpenCreate(true)}
        notButtonCreateDocument={notButtonCreateDocuemnt}
      />
      <CreateAssetModelDocument
        open={isOpenCreate}
        handleCancel={() => setIsOpenCreate(false)}
        onRefresh={fetchAssetModelDocuments}
        assetModel={assetModel}
      />
      {/* <Table
        rowKey="id"
        columns={columns}
        dataSource={assetModelDocuments.filter((f) => !f.isDefault)}
        bordered
        pagination={false}
      />
      <UpdateAssetModelDocument
        open={isOpenUpdate}
        handleCancel={() => setIsOpenUpdate(false)}
        handleOk={() => setIsOpenUpdate(false)}
        AssetModelDocumentChange={assetModelDocumentChange}
        assetModel={assetModel}
        onRefresh={fetchAssetModelDocuments}
      /> */}
    </div>
  );
}
