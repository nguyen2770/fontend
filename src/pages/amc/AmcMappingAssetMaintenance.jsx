import {
  DeleteOutlined,
  LeftCircleFilled,
  UserAddOutlined,
} from "@ant-design/icons";
import { Button, Col, Row, Space, Table, Tooltip, Card, Form } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import * as _unitOfWork from "../../api";
import Confirm from "../../components/modal/Confirm";
import useHeader from "../../contexts/headerContext";
import UserMappingModal from "../../components/modal/mappingUser/UserMappingModal";
import { useTranslation } from "react-i18next";
import AssetMaintenanceModel from "../../components/modal/assetModel/AssetMaintenanceModel";
import ShowSuccess from "../../components/modal/result/successNotification";
import ShowError from "../../components/modal/result/errorNotification";
import { parseToLabel } from "../../helper/parse-helper";
import { assetType } from "../../utils/constant";
import { parseDate } from "../../helper/date-helper";

export default function AmcMappingAssetMaintenance() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const prams = useParams();
  const [amcMappingAssetMaintenance, setAmcMappingAssetMaintenance] = useState(
    []
  );
  const [searchForm] = Form.useForm();
  const { setHeaderTitle } = useHeader();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setHeaderTitle(t("calibration_contract.buttons.linking_contracts_to_assets"));
    fetchServiceserviceContractorUserMappingss();
  }, []); // eslint-disable-line

  const fetchServiceserviceContractorUserMappingss = async () => {
    let res = await _unitOfWork.amc.getAmcMappingAssetMaintenanceByRes({
      amc: prams.id,
    });
    if (res && res.code === 1) {
      setAmcMappingAssetMaintenance(res?.data);
    }
  };

  const onCreate = () => {
    setOpen(true);
  };

  const onClickDelete = async (_record) => {
    let res = await _unitOfWork.amc.deleteAmcMappingAssetMaintenance(
      _record.id
    );
    if (res && res.code === 1) {
      fetchServiceserviceContractorUserMappingss();
      ShowSuccess("topRight", "Thông báo", "Xóa thành công");
    } else {
      ShowError("topRight", "Thông báo", "Xóa thất bại");
    }
  };
  const onSelectAssetMaintenance = async (_data) => {
    const data = {
      amc: prams.id,
      assetMaintenance: _data?.id,
    };
    let res = await _unitOfWork.amc.createAmcMappingAssetMaintenance(data);
    if (res && res.code === 1) {
      ShowSuccess("topRight", "Thông báo", "Thêm liên kết thành công");
      fetchServiceserviceContractorUserMappingss();
    }
  };
  const columns = [
    {
      title: t("assetMaintenance.export.index"),
      dataIndex: "id",
      key: "id",
      width: "50px",
      align: "center",
      render: (_text, _record, index) => index + 1,
    },
    {
      title: t("assetMaintenance.list.table.asset_name"),
      dataIndex: "assetMaintenance",
      align: "center",
      className: "text-left-column",
      render: (text, record) => {
        return <span>{text?.assetModel?.asset?.assetName}</span>;
      },
    },
    {
      title: t("assetMaintenance.list.table.serial"),
      dataIndex: "assetMaintenance",
      align: "center",
      className: "text-left-column",
      render: (text, record) => {
        return <span>{text?.serial}</span>;
      },
    },
    {
      title: t("assetMaintenance.list.table.asset_number"),
      dataIndex: "assetMaintenance",
      align: "center",
      className: "text-left-column",
      render: (text, record) => {
        return <span>{text?.assetNumber}</span>;
      },
    },
    {
      title: t("assetMaintenance.list.table.model"),
      dataIndex: "assetMaintenance",
      align: "center",
      className: "text-left-column",
      render: (text, record) => {
        return <span>{text?.assetModel?.assetModelName || []}</span>;
      },
    },
    {
      title: t("assetMaintenance.list.table.asset_style"),
      dataIndex: "assetMaintenance",
      align: "center",
      render: (text, record) =>
        t(t(parseToLabel(assetType.Options, text?.assetStyle))),
    },
    {
      title: t("calibration_contract.created_at"),
      dataIndex: "createdAt",
      align: "center",
      render: (text, record) => parseDate(text),
    },

    {
      title: t("serviceContractor.userMapping.columns.action"),
      dataIndex: "action",
      align: "center",
      width: "10%",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title={t("serviceContractor.userMapping.tooltips.delete")}>
            <Button
              type="primary"
              onClick={() =>
                Confirm(
                  t("serviceContractor.userMapping.messages.confirm_delete"),
                  () => onClickDelete(record)
                )
              }
              danger
              icon={<DeleteOutlined />}
              size="small"
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="content-manager">
      <Card>
        <Form
labelWrap
          className="search-form mb-12px"
          form={searchForm}
          layout="vertical"
        //   onFinish={serviceContractorUserMappings}
        >
          <Row gutter={8}></Row>
          <Row>
            <Col span={12}></Col>
            <Col span={12} style={{ textAlign: "right" }}>
              <Button onClick={() => navigate(-1)}>
                <LeftCircleFilled />
                {t("common_buttons.back")}
              </Button>
              <Button type="primary" onClick={onCreate} className="ml-2">
                <UserAddOutlined />
                {t("common_buttons.create")}
              </Button>
            </Col>
          </Row>
        </Form>
        <Table
          columns={columns}
          dataSource={amcMappingAssetMaintenance}
          className="custom-table"
          pagination={false}
        ></Table>
        <AssetMaintenanceModel
          open={open}
          handleCancel={() => setOpen(false)}
          onSelectAssetMaintenance={onSelectAssetMaintenance}
        />
      </Card>
    </div>
  );
}
