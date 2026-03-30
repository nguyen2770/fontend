import {
  DeleteOutlined,
  EyeFilled,
  LeftOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  message,
  Row,
  Table,
  Tooltip,
} from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as _unitOfWork from "../../../api";
import Confirm from "../../../components/modal/Confirm";
import { assetType } from "../../../utils/constant";
import { parseToLabel } from "../../../helper/parse-helper";
import { useTranslation } from "react-i18next";
import SelectAssetMaintenance from "../../../components/modal/SelectAssetMaintenance";
import { staticPath } from "../../../router/routerConfig";
import useHeader from "../../../contexts/headerContext";

const PropertyAccessories = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [assetMaintenances, setAssetMaintenances] = useState([]);
  const [assetMaintenance, setAssetMaintenance] = useState(null);
  const [isOpenModal, setIsOpenModel] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { setHeaderTitle } = useHeader();

  useEffect(() => {
    fetcGetPropertyAccessoriesByAssetMaintenance();
    fetchGetAssetMaintenance();
    setHeaderTitle(t("Thông tin danh sách thiết bị phụ của tài sản"));
  }, [id]);
  const fetchGetAssetMaintenance = async () => {
    let res = await _unitOfWork.assetMaintenance.getAssetMaintenanceById({
      id: id,
    });
    if (res && res.code === 1) {
      setAssetMaintenance(res?.data);
    }
  };
  const fetcGetPropertyAccessoriesByAssetMaintenance = async () => {
    const res =
      await _unitOfWork.assetMaintenance.getPropertyAccessoriesByAssetMaintenance(
        {
          id,
        },
      );
    if (res && res.data) {
      setAssetMaintenances(res.data);
    }
  };
  const onDelete = async (recordId) => {
    const res =
      await _unitOfWork.assetMaintenance.deleteParentIdInPropertyAccessories({
        id: recordId,
      });
    if (res && res.code === 1) {
      fetcGetPropertyAccessoriesByAssetMaintenance();
      message.success(t("Xóa thành công"));
    }
  };
  const onSubmitBack = async (ids) => {
    let res =
      await _unitOfWork.assetMaintenance.mapPropertyAccessoriesWithAssetMaintenance(
        { listPropertyAccessories: ids, id: id },
      );
    if (res && res.code === 1) {
      fetcGetPropertyAccessoriesByAssetMaintenance();
      message.success(t("Gán thiết bị phụ cho tài sản thành công"));
    }
  };
  const onClickViewAssetMaintenance = (values) => {
    navigate(staticPath.viewAssetMaintenance + "/" + values.id);
  };
  const columns = [
    {
      title: t("users.mappingAsset.columns.index"),
      dataIndex: "key",
      width: 70,
      align: "center",
      render: (_text, _record, index) => <span>{index + 1}</span>,
    },
    {
      title: t("users.mappingAsset.columns.asset_name"),
      dataIndex: "assetName",
      render: (text, record) => (
        <span>{text?.assetName || record?.assetModel?.asset?.assetName}</span>
      ),
    },
    {
      title: t("users.mappingAsset.columns.serial"),
      dataIndex: "serial",
    },
    {
      title: t("users.mappingAsset.columns.asset_number"),
      dataIndex: "assetNumber",
    },
    {
      title: t("users.mappingAsset.columns.model"),
      dataIndex: "assetModel",
      render: (text) => <span>{text?.assetModelName}</span>,
    },
    {
      title: t("Danh mục"),
      dataIndex: "categoryName",
    },
    {
      title: t("Hãng sản xuất"),
      dataIndex: "manufacturerName",
    },
    {
      title: t("Người dùng tài sản"),
      dataIndex: "customer",
      render: (text) => <span>{text?.customerName}</span>,
    },
    {
      title: t("users.mappingAsset.columns.action"),
      align: "center",
      render: (_, record) => (
        <>
          <Tooltip title={t("Chi tiết")}>
            <Button
              icon={<EyeFilled />}
              size="small"
              onClick={() => onClickViewAssetMaintenance(record)}
              className="mr-2"
            />
          </Tooltip>
          <Tooltip title={t("users.list.tooltips.delete")}>
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              size="small"
              onClick={() =>
                Confirm(t("users.mappingAsset.buttons.confirm_delete"), () =>
                  onDelete(record.id),
                )
              }
            />
          </Tooltip>
        </>
      ),
    },
  ];

  return (
    <Card
      extra={
        <Row className="mb-2">
          <Col span={24} style={{ textAlign: "right" }}>
            <Button onClick={() => navigate(-1)} className="ml-3">
              <LeftOutlined /> {t("users.mappingAsset.buttons.back")}
            </Button>
          </Col>
        </Row>
      }
    >
      <Form form={form} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Form.Item label={t("Tên tài sản")} labelAlign="left">
              <Input
                value={assetMaintenance?.assetModel?.asset?.assetName}
                disabled
              ></Input>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={t("Số se-ri")} labelAlign="left">
              <Input value={assetMaintenance?.serial} disabled></Input>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={t("Mã tài sản")} labelAlign="left">
              <Input value={assetMaintenance?.assetNumber} disabled></Input>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={t("Model")} labelAlign="left">
              <Input
                value={assetMaintenance?.assetModel?.assetModelName}
                disabled
              ></Input>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={t("Kiểu tài sản")} labelAlign="left">
              <Input
                value={parseToLabel(
                  assetType.Options,
                  assetMaintenance?.assetStyle,
                )}
                disabled
              ></Input>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={t("Hãng sản xuất")} labelAlign="left">
              <Input
                value={assetMaintenance?.manufacturerName}
                disabled
              ></Input>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Divider>Danh sách thiết bị phụ của tài sản</Divider>
      <Row>
        <Col span={24} style={{ textAlign: "end", marginBottom: 3 }}>
          <Button
            type="primary"
            onClick={() => {
              setIsOpenModel(true);
            }}
            className="ml-3"
          >
            <PlusOutlined /> {t("Thêm mới thiết bị phụ")}
          </Button>
        </Col>
      </Row>
      <Table
        key={"id"}
        rowKey="id"
        columns={columns}
        dataSource={assetMaintenances}
        className="custom-table"
        bordered
        pagination={false}
      />
      <SelectAssetMaintenance
        open={isOpenModal}
        id={id}
        onSubmitBack={onSubmitBack}
        onClose={() => {
          setIsOpenModel(false);
        }}
      />
    </Card>
  );
};

export default PropertyAccessories;
