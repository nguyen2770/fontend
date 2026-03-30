import React, { useEffect, useState } from "react";
import {
  CheckSquareOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  MoreOutlined,
  PlusOutlined,
  RedoOutlined,
  SearchOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  DatePicker,
  Dropdown,
  Form,
  Input,
  notification,
  Pagination,
  Row,
  Select,
  Table,
  Tooltip,
} from "antd";
import { FORMAT_DATE, PAGINATION } from "../../utils/constant";
import * as _unitOfWork from "../../api";
import "./index.scss";
import Comfirm from "../../components/modal/Confirm";
import useHeader from "../../contexts/headerContext";
import { filterOption } from "../../helper/search-select-helper";
import useAuth from "../../contexts/authContext";
import { checkPermission } from "../../helper/permission-helper";
import { permissionCodeConstant } from "../../utils/permissionConstant";
import { useTranslation } from "react-i18next";
import { staticPath } from "../../router/routerConfig";
import { useNavigate } from "react-router-dom";
import { parseDate } from "../../helper/date-helper";
import { parseToLabel } from "../../helper/parse-helper";
import { inventoryAssetStatus } from "../../utils/inventoryAssetConstant";

export default function InventoryAsset() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [dataSource, setDataSource] = useState([]);
  const [page, setPage] = useState(1);
  const [totalRecord, setTotalRecord] = useState(0);
  const [pagination, setPagination] = useState(PAGINATION);
  const { setHeaderTitle } = useHeader();
  const [searchForm] = Form.useForm();
  const [origins, setOrigins] = useState([]);
  const { permissions } = useAuth();

  useEffect(() => {
    fetchGetListInventoryAsset();
  }, [page]);

  useEffect(() => {
    setHeaderTitle("Quản lý kiểm kê");
    fetGetAllOrigins();
  }, [t, setHeaderTitle]);

  const fetchGetListInventoryAsset = async () => {
    let payload = {
      page: page,
      limit: PAGINATION.limit,
      ...searchForm.getFieldsValue(),
    };
    const res =
      await _unitOfWork.inventoryAsset.getListInventoryAssets(payload);
    if (res && res.results && res.results?.results) {
      setDataSource(res.results?.results);
      setTotalRecord(res.results.totalResults);
    }
  };

  const onChangePagination = (value) => {
    setPage(value);
  };

  const fetGetAllOrigins = async () => {
    let res = await _unitOfWork.origin.getAllOrigin();
    if (res && res.code === 1) {
      setOrigins(res.data);
    }
  };

  const onClickDelete = async (values) => {
    const res = await _unitOfWork.inventoryAsset.deleteInventoryAsset({
      id: values.id,
    });
    if (res && res.code === 1) {
      if (dataSource.length === 1 && page > 1) {
        setPage(1);
      } else {
        fetchGetListInventoryAsset();
      }
    }
  };

  const onSearch = () => {
    setPage(1);
    fetchGetListInventoryAsset();
  };

  const resetSearch = () => {
    setPage(1);
    searchForm.resetFields();
    fetchGetListInventoryAsset();
  };
  const onClickGoToCreate = () => {
    navigate(staticPath.createinventoryAsset);
  };
  const onClickUpdate = (_record) => {
    navigate(staticPath.updateInventoryAsset + _record.id);
  };
  const onClickGoToView = (_record) => {
    navigate(staticPath.viewInventoryAsset + _record.id);
  };
  const onClickConfirm = async (_record) => {
    let res = await _unitOfWork.inventoryAsset.confirmInventoryAsset({
      id: _record.id,
    });
    if (res && res.code === 1) {
      notification.success({
        message: "Thông báo",
        description: "Xác nhận lịch kiểm kê thành công!",
      });
      fetchGetListInventoryAsset();
    }
  };
  const columns = [
    {
      title: "STT",
      dataIndex: "key",
      align: "center",
      width: "50px",
      render: (_text, _record, index) =>
        (page - 1) * PAGINATION.limit + index + 1,
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      className: "text-left-column",
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "startDate",
      align: "center",
      width: "170px",
      render: (_text) => {
        return <span>{parseDate(_text)}</span>;
      },
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "endDate",
      align: "center",
      width: "170px",
      render: (_text) => {
        return <span>{parseDate(_text)}</span>;
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: "170px",
      align: "center",
      render: (_text) => {
        return (
          <span className={"inventory-asset-status-" + _text}>
            {parseToLabel(inventoryAssetStatus.Options, _text)}
          </span>
        );
      },
    },
    {
      title: "Thao tác",
      dataIndex: "action",
      align: "center",
      fixed: "right",
      width: "80px",
      render: (_, record) => {
        const menuItems = [
          record.status === inventoryAssetStatus.draft && {
            key: "confirm",
            label: "Xác nhận",
            icon: <CheckSquareOutlined />,
            onClick: () => Comfirm("Xác nhận", () => onClickConfirm(record)),
          },
          record.status === inventoryAssetStatus.draft && {
            key: "edit",
            label: "Chỉnh sửa",
            icon: <EditOutlined />,
            onClick: () => onClickUpdate(record),
          },
          (record.status === inventoryAssetStatus.draft ||
            record.status === inventoryAssetStatus.new) && {
            key: "delete",
            label: "Xóa",
            icon: <DeleteOutlined />,
            onClick: () =>
              Comfirm("Xác nhận xóa lịch kiểm kê", () => onClickDelete(record)),
          },
        ].filter(Boolean);

        return (
          <div>
            <Tooltip title={"Chi tiết"}>
              <Button
                icon={<EyeOutlined />}
                size="small"
                onClick={() => onClickGoToView(record)}
              />
            </Tooltip>
            <Dropdown trigger={["click"]} menu={{ items: menuItems }}>
              <Button icon={<MoreOutlined />} size="small" className="ml-2" />
            </Dropdown>
          </div>
        );
      },
    },
  ];

  return (
    <div className="p-3 container-content">
      <Form
        labelWrap
        className="search-form"
        form={searchForm}
        layout="vertical"
        onFinish={onSearch}
      >
        <Row gutter={32}>
          <Col span={6}>
            <Form.Item label="Tên lịch" name="InventoryAssetName">
              <Input placeholder={t("Nhập tên lịch kiểm kê")} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Ngày bắt đầu" name="origin">
              <DatePicker
                placeholder="Chọn ngày bắt đầu"
                format={FORMAT_DATE}
                style={{ width: "100%" }}
                allowClear
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Ngày kết thúc" name="origin">
              <DatePicker
                placeholder="Chọn ngày kết thúc"
                format={FORMAT_DATE}
                style={{ width: "100%" }}
                allowClear
              />
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
            <Button
              key="1"
              type="primary"
              className="ml-3"
              onClick={onClickGoToCreate}
            >
              <PlusOutlined />
              Thêm mới
            </Button>
          </Col>
          <Col span={24} style={{ fontSize: 16, textAlign: "right" }}>
            <b>
              {t("assetMaintenance.list.total", {
                count: totalRecord || 0,
              })}
            </b>
          </Col>
        </Row>
        <Table
          key={"id"}
          rowKey="id"
          columns={columns}
          dataSource={dataSource}
          pagination={false}
          bordered
        />
        <Pagination
          className="pagination-table mt-2"
          onChange={onChangePagination}
          pageSize={pagination.limit}
          total={totalRecord}
          current={page}
        />
      </Form>
    </div>
  );
}
