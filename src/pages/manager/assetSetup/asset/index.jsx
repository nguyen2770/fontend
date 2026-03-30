import React, { useEffect, useState } from "react";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  RedoOutlined,
  SearchOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Input,
  Pagination,
  Row,
  Table,
  Tooltip,
} from "antd";
import CreateAsset from "./CreateAsset";
import UpdateAsset from "./UpdateAsset";
import {
  createNewUsingAFormulaType,
  PAGINATION,
} from "../../../../utils/constant";
import * as _unitOfWork from "../../../../api";
import Comfirm from "../../../../components/modal/Confirm";
import useHeader from "../../../../contexts/headerContext";
import useAuth from "../../../../contexts/authContext";
import { checkPermission } from "../../../../helper/permission-helper";
import { permissionCodeConstant } from "../../../../utils/permissionConstant";
import { useTranslation } from "react-i18next";
import BulkUploadModal from "../../../../components/modal/BulkUpload";
import DialogModal from "../../../../components/modal/result/DialogNotification";
import ShowError from "../../../../components/modal/result/errorNotification";
import ShowSuccess from "../../../../components/modal/result/successNotification";

export default function Asset() {
  const { t } = useTranslation();
  const [isOpenCreate, setIsOpenCreate] = useState(false);
  const [isOpenUpdate, setIsOpenUpdate] = useState(false);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(PAGINATION);
  const [totalRecord, setTotalRecord] = useState(0);
  const [assets, setAssets] = useState([]);
  const [assetId, setAssetId] = useState();
  const { setHeaderTitle } = useHeader();
  const [searchForm] = Form.useForm();
  const { permissions, companySetting } = useAuth();
  const [isOpenBulkUpload, setOpenBulkUpload] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [modalType, setModalType] = useState("error");

  // useEffect(() => {
  //   setHeaderTitle(t("asset.list.title"));
  // }, [t, setHeaderTitle]);

  useEffect(() => {
    fetchGetListAsset();
  }, [page]);

  const onChangePagination = (value) => {
    setPage(value);
  };

  const fetchGetListAsset = async () => {
    let payload = {
      page,
      limit: PAGINATION.limit,
      ...searchForm.getFieldsValue(),
    };
    const res = await _unitOfWork.asset.getListAssets(payload);
    if (res && res.results && res.results?.results) {
      setAssets(res.results?.results);
      setTotalRecord(res.results.totalResults);
    }
  };

  const onClickUpdate = (values) => {
    setAssetId(values.id);
    setIsOpenUpdate(true);
  };

  const onDeleteCategory = async (values) => {
    const res = await _unitOfWork.asset.deleteAsset({
      id: values.id,
    });
    if (res && res.code === 1) {
      if (assets.length === 1 && page > 1) {
        setPage(1);
      } else {
        fetchGetListAsset();
      }
    }
  };

  const handleUpload = async (file, note) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("note", note);
    // console.log("file, note", file, note);
    let res = await _unitOfWork.importData.uploadAssetExcel(formData);
    if (res && res.code === 1 && res.result.success) {
      ShowSuccess(
        "topRight",
        t("common.notifications"),
        t("common.messages.success.upload_count", {
          count: res?.result?.insertCount || 0,
        }),
      );
      if (res?.result?.warnings) {
        setMessages(res?.result?.warnings);
        setModalType("warning");
        setIsModalOpen(true);
      }
    } else {
      ShowError(
        "topRight",
        t("common.notifications"),
        res?.message || t("common.messages.errors.upload_failed"),
      );
      setMessages(res?.result?.errors);
      setModalType("error");
      setIsModalOpen(true);
    }
    fetchGetListAsset();
    setOpenBulkUpload(false);
  };

  const columns = [
    {
      title: t("asset.list.table.index"),
      dataIndex: "id",
      key: "id",
      width: "5%",
      align: "center",
      render: (_text, _record, index) =>
        (page - 1) * PAGINATION.limit + index + 1,
    },
    {
      title: t("asset.list.table.name"),
      dataIndex: "assetName",
      key: "name",
      align: "center",
      className: "text-left-column",
    },
    ...((companySetting.createNewUsingAFormula ===
      createNewUsingAFormulaType.healthInsurance ||
      companySetting.createNewUsingAFormula ===
        createNewUsingAFormulaType.healthInsuranceDecree3176) &&
    companySetting?.autoGenerateAssetNumber
      ? [
          {
            title: t("asset.symbol"),
            dataIndex: "symbol",
            key: "symbol",
          },
        ]
      : []),
    {
      title: t("asset.list.table.action"),
      width: "15%",
      dataIndex: "action",
      align: "center",
      render: (_, record) => (
        <div>
          {checkPermission(
            permissions,
            permissionCodeConstant.equipment_category_update,
          ) && (
            <Tooltip title={t("purchase.actions.edit")}>
              <Button
                type="primary"
                icon={<EditOutlined />}
                size="small"
                onClick={() => onClickUpdate(record)}
              />
            </Tooltip>
          )}
          {checkPermission(
            permissions,
            permissionCodeConstant.equipment_category_delete,
          ) && (
            <Tooltip title={t("purchase.actions.delete")}>
              <Button
                type="primary"
                danger
                icon={<DeleteOutlined />}
                size="small"
                className="ml-2"
                onClick={() =>
                  Comfirm(t("asset.messages.confirm_delete"), () =>
                    onDeleteCategory(record),
                  )
                }
              />
            </Tooltip>
          )}
        </div>
      ),
    },
  ];

  const onSearch = () => {
    pagination.page = 1;
    fetchGetListAsset();
  };

  const resetSearch = () => {
    pagination.page = 1;
    searchForm.resetFields();
    fetchGetListAsset();
  };

  return (
    <div className="p-3">
      <Form
        labelWrap
        className="search-form"
        form={searchForm}
        layout="vertical"
        onFinish={onSearch}
      >
        <Row gutter={32}>
          <Col span={6}>
            <Form.Item
              label={t("asset.list.search.name_label")}
              name="assetName"
            >
              <Input placeholder={t("asset.list.search.placeholder_name")} />
            </Form.Item>
          </Col>
        </Row>
        <Row className="mb-1">
          <Col span={12}>
            <Button type="primary" className="mr-2" htmlType="submit">
              <SearchOutlined />
              {t("purchase.buttons.search")}
            </Button>
            <Button className="bt-green mr-2" onClick={resetSearch}>
              <RedoOutlined />
              {t("purchase.buttons.reset")}
            </Button>
          </Col>
          <Col span={12} style={{ textAlign: "right" }}>
            <Button className="button" onClick={() => setOpenBulkUpload(true)}>
              <UploadOutlined />
              {t("customer.actions.bulk_upload")}
            </Button>
            {checkPermission(
              permissions,
              permissionCodeConstant.equipment_category_create,
            ) && (
              <Button
                key="1"
                type="primary"
                onClick={() => setIsOpenCreate(true)}
                className="ml-3"
              >
                <PlusOutlined />
                {t("purchase.buttons.create")}
              </Button>
            )}
          </Col>
          <Col span={24} style={{ fontSize: 16, textAlign: "right" }}>
            <b>{t("asset.list.total", { count: totalRecord || 0 })}</b>
          </Col>
        </Row>

        <Table
          rowKey="id"
          columns={columns}
          key={"id"}
          dataSource={assets}
          bordered
          pagination={false}
        />
        <Pagination
          className="pagination-table mt-2"
          onChange={onChangePagination}
          pageSize={pagination.limit}
          total={totalRecord}
          current={page}
        />
        <CreateAsset
          open={isOpenCreate}
          handleCancel={() => setIsOpenCreate(false)}
          handleOk={() => setIsOpenCreate(false)}
          onRefresh={fetchGetListAsset}
        />
        <UpdateAsset
          open={isOpenUpdate}
          handleCancel={() => setIsOpenUpdate(false)}
          handleOk={() => setIsOpenUpdate(false)}
          id={assetId}
          onRefresh={fetchGetListAsset}
        />
        <BulkUploadModal
          open={isOpenBulkUpload}
          onCancel={() => setOpenBulkUpload(false)}
          onUpload={handleUpload}
          templateUrl="/file/TemplateAsset2.xlsx"
        />
        <DialogModal
          open={isModalOpen}
          handleOk={() => setIsModalOpen(false)}
          type={modalType}
          message={messages}
        />
      </Form>
    </div>
  );
}
