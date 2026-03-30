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
import React, { useEffect, useState } from "react";
import { EditOutlined, RedoOutlined, SearchOutlined } from "@ant-design/icons";
import * as _unitOfWork from "../../../api";
import { PAGINATION } from "../../../utils/constant";
import { useNavigate } from "react-router-dom";
import useHeader from "../../../contexts/headerContext";
import useAuth from "../../../contexts/authContext";
import { useTranslation } from "react-i18next";
import UpdateNotificationType from "./UpdateNotificationType";
import "../../report/assetMaintenance/index.scss";

export default function NotificationSetting() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { setHeaderTitle } = useHeader();
  const { permissions } = useAuth();
  const { t } = useTranslation();
  const [totalRecord, setTotalRecord] = useState(0);
  const [notificationTypes, setNotificationTypes] = useState([]);
  const [page, setPage] = useState(1);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [notificationType, setNotificationType] = useState(null);

  useEffect(() => {
    setHeaderTitle(t("notification_configuration.title"));
  }, []);

  useEffect(() => {
    fetchNotificationSetting();
  }, [page]);
  const fetchNotificationSetting = async () => {
    const values = form.getFieldsValue();
    const payload = {
      page: page,
      limit: PAGINATION.limit,
      ...values,
    };
    let res = await _unitOfWork.notification.getNotificationTypes(payload);
    if (res && res.code === 1) {
      setNotificationTypes(res?.data?.results || []);
      setTotalRecord(res?.data?.totalResults || 0);
    }
  };

  const onSearch = async () => {
    setPage(1);
    fetchNotificationSetting();
  };
  const onClickUpdate = (record) => {
    setNotificationType(record);
    setOpenUpdateModal(true);
  };
  const onChangePagination = (value) => {
    setPage(value);
  };
  const resetSearch = () => {
    form.resetFields();
    setPage(1);
    fetchNotificationSetting();
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
      title: t("Tên cấu hình thông báo"),
      dataIndex: "name",
      key: "name",
      className: "text-left-column",
    },
    {
      title: t("Code"),
      dataIndex: "code",
      key: "code",
      align: "center",
      className: "text-left-column",
    },
    {
      title: t("Thông báo trước (ngày)"),
      dataIndex: "advanceNoticeDays",
      key: "advanceNoticeDays",
      align: "end",
    },
    {
      title: t("Số lần thông báo"),
      dataIndex: "numberOfNotification",
      key: "numberOfNotification",
      align: "end",
    },
    {
      title: t("asset.list.table.action"),
      width: "15%",
      dataIndex: "action",
      align: "center",
      render: (_, record) => (
        <div>
          {(record?.isNotifyTheManager === true ||
            record?.isPriorNoticeRequired === true) && (
            <Tooltip title={t("purchase.actions.edit")}>
              <Button
                type="primary"
                icon={<EditOutlined />}
                size="small"
                onClick={() => onClickUpdate(record)}
              />
            </Tooltip>
          )}
        </div>
      ),
    },
  ];
  return (
    <div className="p-2">
      <Form
        labelWrap
        className="search-form report-filter-row"
        form={form}
        onFinish={onSearch}
        layout="vertical"
      >
        <Row gutter={16} className="">
          <Col span={6}>
            <Form.Item label={t("Tên cấu hình thông báo")} name="name">
              <Input placeholder={t("Nhập tên cấu hình thông báo")} />
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
          <Col span={12} style={{ fontSize: 16, textAlign: "right" }}>
            <b>{t("asset.list.total", { count: totalRecord || 0 })}</b>
          </Col>
        </Row>
        <Table
          rowKey="id"
          columns={columns}
          key={"id"}
          dataSource={notificationTypes}
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
        <UpdateNotificationType
          open={openUpdateModal}
          handleCancel={() => setOpenUpdateModal(false)}
          onRefresh={fetchNotificationSetting}
          notificationType={notificationType}
        />
      </Form>
    </div>
  );
}
