import { useEffect, useState } from "react";
import { DeleteOutlined, DownloadOutlined, EditOutlined, EyeOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Checkbox, Col, Row, Space, Table, Tooltip } from "antd";
import { saveAs } from "file-saver";
import CreateAssetMaintenanceDocument from "./CreateAssetMaintenanceDocument";
import UpdateAssetMaintenanceDocument from "./UpdateAssetMaintenanceDocument";
import { generateFullUrl } from "../../../../api/restApi";
import * as _unitOfWork from "../../../../api";
import { useTranslation } from "react-i18next";
import Confirm from "../../../../components/modal/Confirm";
import TabAttachment from "../../../../components/fileViewer/TabAttachment";
import { parseDateDDMMYYYY } from "../../../../helper/date-helper";
import { normalizeFileType } from "../../../../helper/normalizeFileType";
import FilePreviewer from "../../../../components/fileViewer/FilePreviewer";
export default function AssetMaintenanceDocument({
  AssetMaintenance,
  onChangeFiles,
  listFile,
  isCreate = false
}) {
  const { t } = useTranslation();
  const isStandalone = !AssetMaintenance;

  const [isOpenCreate, setIsOpenCreate] = useState(false);
  const [isOpenUpdate, setIsOpenUpdate] = useState(false);
  const [assetModelDocuments, setAssetModelDocuments] = useState([]);
  const [localFiles, setLocalFiles] = useState([]);
  const [assetModelDocumentChange, setAssetModelDocumentChange] =
    useState(null);
  const [previewFile, setPreviewFile] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  useEffect(() => {
    if (!isStandalone) {
      fetchAssetModelDocuments();
    }
  }, [AssetMaintenance]);

  const onSelectChange = (selectedRowKeys) => {
    setSelectedFiles(selectedRowKeys);
  };

  const onSelectAll = (e) => {
    const dataSource = isStandalone
      ? localFiles
      : assetModelDocuments.filter(f => !f.isDefault);

    if (e.target.checked) {
      setSelectedFiles(dataSource.map(item => item.id || item.uid));
    } else {
      setSelectedFiles([]);
    }
  };


  const fetchAssetModelDocuments = async () => {
    const res =
      await _unitOfWork.assetMaintenanceDocument.getResById({
        id: AssetMaintenance.id || AssetMaintenance._id
      });
    if (res?.code === 1) {
      setAssetModelDocuments(res.data);
    }
  };

  const onClickDelete = async (record) => {
    const res =
      await _unitOfWork.assetMaintenanceDocument
        .deleteAssetMaintenanceDocument({ id: record.id });

    if (res?.code === 1) {
      fetchAssetModelDocuments();
    }
  };

  const handlePreviewFile = async (record) => {
    let dataFileView;
    if (record?.resource?.id) {
      const extension = normalizeFileType(record?.resource?.extension);
      const response = await _unitOfWork.resource.previewResource(record?.resource?.id);
      if (!response || !response.data || !response.data.url) {
        console.error("Invalid preview response:", response);
        return;
      }
      const fileUrl = generateFullUrl(response.data.url);
      dataFileView = {
        url: fileUrl,
        id: record?.resource?.id,
        name: record?.resource?.fileName,
        extension: extension,
      };
    } else {
      dataFileView = {
        url: URL.createObjectURL(record.file),
        id: record?.uid,
        name: record?.file?.name,
        extension: normalizeFileType(record.file?.name.split('.').pop()),
      };
    }
    setPreviewFile(dataFileView);
    setIsModalVisible(true);
  };

  const handleDownloadSelected = async () => {
    const dataSource = isStandalone
      ? localFiles
      : assetModelDocuments.filter(f => !f.isDefault);

    const filesToDownload = dataSource.filter(item =>
      selectedFiles.includes(item.id || item.uid)
    );

    for (const record of filesToDownload) {
      try {
        // file đã lưu trên server
        if (record?.resource?.id) {
          const response = await _unitOfWork.resource.previewResource(record.resource.id);

          if (!response?.data?.url) continue;

          const fileUrl = generateFullUrl(response.data.url);

          saveAs(fileUrl, record.resource.fileName);
        }

        // file local chưa upload
        else if (record?.file) {
          saveAs(record.file, record.file.name);
        }

      } catch (err) {
        console.error("Download error:", err);
      }
    }
  };
  const columns = [
    {
      title: t("assetModel.common.table.index"),
      width: 60,
      align: "center",
      render: (_t, _r, idx) => idx + 1
    },
    {
      title: t("assetModel.document.table.category"),
      dataIndex: "documentCategory"
    },
    {
      title: t("assetModel.document.table.file"),
      dataIndex: "resource",
      render: (resource, record) => {
        return record.file?.name || resource.fileName;
      }
    },
    {
      title: "Người tải",
      dataIndex: ["resource", "createdBy", "fullName"],

    },
    {
      title: "Ngày tải",
      dataIndex: "updatedAt",
      render: (text) => (
        <span>{parseDateDDMMYYYY(text)}</span>
      )
    },
    {
      title: "Thao tác",
      width: 110,
      align: "center",
      render: (_, record) => (
        <>
          <Tooltip title={t("assetModel.common.buttons.update")}>
            <Button
              icon={<EyeOutlined />}
              size="small"
              className="mr-2"
              onClick={() => {
                handlePreviewFile(record)
              }}
            />
          </Tooltip>
          {!isStandalone && (
            <>
              <Tooltip title={t("assetModel.common.buttons.update")}>
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  size="small"
                  onClick={() => {
                    setAssetModelDocumentChange(record);
                    setIsOpenUpdate(true);
                  }}
                />
              </Tooltip>
              <Tooltip title={t("assetModel.common.buttons.delete")}>
                <Button
                  danger
                  type="primary"
                  size="small"
                  className="ml-2"
                  icon={<DeleteOutlined />}
                  onClick={() =>
                    Confirm(
                      t("assetModel.common.messages.confirm_delete"),
                      () => onClickDelete(record)
                    )
                  }
                />
              </Tooltip>
            </>
          )}
        </>
      )
    }
  ];

  return (
    <>
      <Row className="mb-1" >

        <Col span={24} style={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
          <Space align="center">
            {!isCreate && (
              <>
                <Checkbox
                  onChange={onSelectAll}
                  checked={
                    selectedFiles.length ===
                    (isStandalone
                      ? localFiles.length
                      : assetModelDocuments.filter(f => !f.isDefault).length) &&
                    selectedFiles.length > 0
                  }
                >
                  {t("workReportByPerson.list_file.select_all")}
                </Checkbox>

                <Button
                  type="primary"
                  disabled={selectedFiles.length === 0}
                  onClick={handleDownloadSelected}
                  icon={<DownloadOutlined />}
                >
                  {t("workReportByPerson.list_file.download_selected")} ({selectedFiles.length})
                </Button>
              </>
            )}

            {isCreate && (
              <Button
                type="primary"
                onClick={() => setIsOpenCreate(true)}
              >
                <PlusOutlined />
                {t("assetModel.document.list_add_button")}
              </Button>
            )}
          </Space>
        </Col>


      </Row>
      {/* <TabAttachment
        listDocuments={assetModelDocuments}
        onClickDelete={onClickDelete}
      /> */}
      <CreateAssetMaintenanceDocument
        open={isOpenCreate}
        handleCancel={() => setIsOpenCreate(false)}
        AssetMaintenance={AssetMaintenance}
        isStandalone={isStandalone}
        onRefresh={fetchAssetModelDocuments}
        onChangeFiles={(files) => {
          setLocalFiles([...listFile, ...files]);
          onChangeFiles?.(files);
        }}
      />

      <Table
        rowKey={(r) => r.id || r.uid}
        columns={columns}
        dataSource={
          isStandalone
            ? localFiles
            : assetModelDocuments.filter(f => !f.isDefault)
        }
        rowSelection={{
          type: 'checkbox',
          selectedRowKeys: selectedFiles,
          onChange: onSelectChange,
        }}
        pagination={false}
        bordered
      />

      {!isStandalone && (
        <UpdateAssetMaintenanceDocument
          open={isOpenUpdate}
          handleCancel={() => setIsOpenUpdate(false)}
          handleOk={() => setIsOpenUpdate(false)}
          AssetModelDocumentChange={assetModelDocumentChange}
          AssetMaintenance={AssetMaintenance}
          onRefresh={fetchAssetModelDocuments}
        />
      )}

      <FilePreviewer
        open={isModalVisible}
        onClose={() => {
          setIsModalVisible(false);
        }}
        id={previewFile?.id}
        url={previewFile?.url}
        fileType={previewFile?.extension}
        fileName={previewFile?.name}
        destroyOnClose
      />
    </>
  );
}