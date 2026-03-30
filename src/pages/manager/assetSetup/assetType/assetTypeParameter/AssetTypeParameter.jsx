import React, { useEffect, useState } from "react";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined
} from "@ant-design/icons";
import {
  Button,
  Col,
  Pagination,
  Row,
  Table,
  Tooltip
} from "antd";
import CreateAssetTypeParameter from "./CreateAssetTypeParameter";
import UpdateAssetTypeParamater from "./UpdateAssetTypeParamater";
import * as _unitOfWork from "../../../../../api";
import Comfirm from "../../../../../components/modal/Confirm";
import { PAGINATION } from "../../../../../utils/constant";
import { useTranslation } from "react-i18next";

export default function AssetTypeParameter({ assetType }) {
  const { t } = useTranslation();
  const [isOpenCreate, setIsOpenCreate] = useState(false);
  const [isOpenUpdate, setIsOpenUpdate] = useState(false);
  const [assetTypeParameters, setAssetTypeParameters] = useState([]);
  const [page, setPage] = useState(1);
  const [totalRecord, setTotalRecord] = useState(0);
  const [assetTypeParameterChange, setAssetTypeParameterChange] =
    useState(null);

  useEffect(() => {
    if (assetType) {
      fetchAssetTypeParameters();
    }
  }, [assetType, page]);

  const onChangePagination = (value) => {
    setPage(value);
  };

  const fetchAssetTypeParameters = async () => {
    let payload = {
      assetType: assetType.id,
      page,
      limit: PAGINATION.limit
    };
    const res =
      await _unitOfWork.assetTypeParameter.getListAssetTypeParameters(
        payload
      );
    if (res && res.results) {
      setAssetTypeParameters(res.results?.results);
      setTotalRecord(res.results.totalResults);
    }
  };
  const onClickUpdate = (values) => {
    setIsOpenUpdate(true);
    setAssetTypeParameterChange(values);
  };
  const onClickDelete = async (values) => {
    const res =
      await _unitOfWork.assetTypeParameter.deleteAssetTypeParameter(
        {
          id: values.id
        }
      );
    if (res && res.code === 1) {
      fetchAssetTypeParameters();
    }
  };
  const columns = [
    {
      title: t("assetType.parameter.list.table.index"),
      dataIndex: "key",
      align: "center",
      width: "60px",
      render: (_text, _record, index) => index + 1
    },
    {
      title: t("assetType.parameter.list.table.name"),
      dataIndex: "name",
      className: "text-left-column",
      align: "center"
    },
    {
      title: t("assetType.parameter.list.table.value"),
      dataIndex: "value",
      className: "text-left-column",
      align: "center"
    },
    {
      title: t("assetType.parameter.list.table.uom"),
      dataIndex: "uom",
      className: "text-left-column",
      render: (text) => <span>{text?.uomName || ""}</span>
    },
    {
      title: t("assetType.parameter.list.table.description"),
      dataIndex: "discription",
      className: "text-left-column"
    },
    {
      title: t("assetType.parameter.list.table.action"),
      dataIndex: "action",
      align: "center",
      width: "100px",
      render: (_, record) => (
        <div>
          <Tooltip title={t("assetType.parameter.list.buttons.edit")}>
            <Button
              type="primary"
              icon={<EditOutlined />}
              size="small"
              onClick={() => onClickUpdate(record)}
            />
          </Tooltip>
          <Tooltip title={t("assetType.parameter.list.buttons.delete")}>
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              size="small"
              className="ml-2"
              onClick={() =>
                Comfirm(
                  t(
                    "assetType.parameter.list.messages.confirm_delete"
                  ),
                  () => onClickDelete(record)
                )
              }
            />
          </Tooltip>
        </div>
      )
    }
  ];

  return (
    <div>
      <Row className="mb-1">
        <Col span={24} style={{ textAlign: "right" }}>
          <Button
            key="1"
            type="primary"
            onClick={() => setIsOpenCreate(true)}
            className="ml-3"
          >
            <PlusOutlined />
            {t("assetType.parameter.list.add_button")}
          </Button>
        </Col>
      </Row>
      <Table
        key={"id"}
        rowKey="id"
        columns={columns}
        dataSource={assetTypeParameters}
        bordered
        pagination={false}
      />
      <Pagination
        className="pagination-table mt-2"
        onChange={onChangePagination}
        pageSize={PAGINATION.limit}
        total={totalRecord}
        current={page}
      />
      <CreateAssetTypeParameter
        open={isOpenCreate}
        handleCancel={() => setIsOpenCreate(false)}
        onRefresh={fetchAssetTypeParameters}
        assetType={assetType}
      />
      <UpdateAssetTypeParamater
        open={isOpenUpdate}
        handleCancel={() => setIsOpenUpdate(false)}
        assetTypeParameterChange={assetTypeParameterChange}
        assetType={assetType}
        onRefresh={fetchAssetTypeParameters}
      />
    </div>
  );
}