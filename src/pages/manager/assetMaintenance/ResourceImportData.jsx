import { Button, Card, Form, Modal, Pagination, Table, Tooltip } from "antd";
import { useEffect, useState } from "react";
import * as _unitOfWork from "../../../api";
import { CheckCircleOutlined, DeleteOutlined } from "@ant-design/icons";
import { PAGINATION } from "../../../utils/constant";
import Comfirm from "../../../components/modal/Confirm";
import { parseDate } from "../../../helper/date-helper";
import ShowSuccess from "../../../components/modal/result/successNotification";
import { useTranslation } from "react-i18next";

export default function ResourceImportData({
  open,
  handleOk,
  handleCancel,
  onRefresh,
}) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [page, setPage] = useState(1);
  const [totalRecord, setTotalRecord] = useState(0);
  const [resourceImportDatas, setResourceImportDatas] = useState([]);

  useEffect(() => {
    if (open) {
      if (page > 1) {
        fetchGetAllResourceImportData();
      } else {
        fetchGetAllResourceImportData(1);
      }
      fetchGetAllResourceImportData();
    }
  }, [open, page]);

  const onChangePagination = (value) => {
    setPage(value);
    fetchGetAllResourceImportData(1);
  };

  const fetchGetAllResourceImportData = async (_page) => {
    let payload = {
      page: _page || page,
      limit: PAGINATION.limit,
    };
    let res =
      await _unitOfWork.resourceImportData.getListResourceImportDataAssetMaintenance(
        payload
      );
    if (res && res.code === 1) {
      setResourceImportDatas(res?.data?.results);
      setTotalRecord(res?.data?.totalRecord);
    }
  };

  const onFinish = async () => {};
  const onCancel = () => {
    handleCancel();
  };
  const onClickCompirm = async (record) => {
    const res = await _unitOfWork.resourceImportData.confirmCloseFileDeletion({
      id: record.id,
      confirmFileDeletion: true,
    });
    if (res && res.code === 1) {
      ShowSuccess(
        "topRight",
        t("common.notifications"),
        t("assetMaintenance.messages.confirm_close_document")
      );
      fetchGetAllResourceImportData(1);
    }
  };
  const onDelete = async (record) => {
    const res = await _unitOfWork.resourceImportData.confirmDeleteFile({
      id: record.id,
    });
    if (res && res.code === 1) {
      ShowSuccess(
        "topRight",
        t("common.notifications"),
        t("assetMaintenance.messages.delete_file_success")
      );
      onRefresh();
      onCancel();
    }
    fetchGetAllResourceImportData(1);
  };
  const columns = [
    {
      title: t("assetMaintenance.export.index"),
      dataIndex: "id",
      key: "id",
      width: "50px",
      align: "center",
      render: (_text, _record, index) =>
        (page - 1) * PAGINATION.limit + index + 1,
    },
    {
      title: t("assetMaintenance.form.fields.parameter_name"),
      dataIndex: "action",
      align: "center",
      render: (_text, record) => {
        const url =
          _unitOfWork.resourceImportData.getDocumentResourceImportData(
            record.id
          );
        return (
          <a
            onClick={() => window.open(url, "_blank", "noopener,noreferrer")}
            style={{ cursor: "pointer" }}
          >
            {record.fileName + record.extension}
          </a>
        );
      },
    },
    {
      title: t("assetMaintenance.form.fields.purchase_date"),
      dataIndex: "createdAt",
      align: "center",
      render: (_text) => parseDate(_text),
    },
    {
      title: t("assetMaintenance.table.action"),
      dataIndex: "action",
      align: "center",
      render: (_, record) => (
        <>
          {record.confirmFileDeletion === false && (
            <div>
              <Tooltip
                title={t("assetMaintenance.messages.confirm_close_document")}
              >
                <Button
                  type="primary"
                  icon={<CheckCircleOutlined />}
                  size="small"
                  onClick={() =>
                    Comfirm(
                      t("assetMaintenance.messages.confirm_close_document"),
                      () => onClickCompirm(record)
                    )
                  }
                />
              </Tooltip>
              <Tooltip title={t("assetMaintenance.actions.delete")}>
                <Button
                  type="primary"
                  danger
                  icon={<DeleteOutlined />}
                  size="small"
                  className="ml-2"
                  onClick={() =>
                    Comfirm(t("assetMaintenance.messages.confirm_delete"), () =>
                      onDelete(record)
                    )
                  }
                />
              </Tooltip>
            </div>
          )}
        </>
      ),
    },
  ];
  return (
    <Modal
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      className="custom-modal"
      footer={false}
      width={"50%"}
    >
      <Form
labelWrap
        form={form}
        onFinish={onFinish}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ paddingBottom: "50px" }}
      >
        <Card title={t("assetMaintenance.actions.file_bulk_upload")}></Card>
        <Table
          rowKey="id"
          columns={columns}
          key={"id"}
          dataSource={resourceImportDatas}
          bordered
          pagination={false}
          scroll={{ x: "max-content" }}
          className="ml-2 mr-2"
        ></Table>
        <Pagination
          className="pagination-table mt-2 mb-3"
          onChange={onChangePagination}
          pageSize={PAGINATION.limit}
          total={totalRecord}
          current={page}
        />
      </Form>
    </Modal>
  );
}
