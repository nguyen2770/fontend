import React, { useEffect, useState } from "react";
import {
  Modal,
  Card,
  Row,
  Col,
  Input,
  Form,
  Tooltip,
  Button,
  Table,
  Space,
  message,
  Radio,
  Checkbox,
} from "antd";
import { BookOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons";
import * as _unitOfWork from "../../../../api";
import {
  assetType,
  breakdownSpareRequestDetailStatus,
  breakdownSpareRequestStatus,
} from "../../../../utils/constant";
import { parseToLabel } from "../../../../helper/parse-helper";
import Confirm from "../../../../components/modal/Confirm";
import AssignUser from "../AssignUser";
import { useTranslation } from "react-i18next";

const ApproveSparePartModal = ({ open, onCancel, data, onSubmit }) => {
  const { t } = useTranslation();
  const breakdown = data?.breakdown;
  const [form] = Form.useForm();
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [isOpenAssignUser, setIsOpenAssignUser] = useState(false);
  const [currentRejectingItem, setCurrentRejectingItem] = useState(null);
  const [breakdownSpareRequestDetails, setBreakdownSpareRequestDetails] =
    useState([]);
  const [commentText, setCommentText] = useState("");
  const [assignUser, setAssignUser] = useState([]);
  const [assignUserIds, setAssignUserIds] = useState([]);
  const [isAllRejected, setIsAllRejected] = useState(false);

  useEffect(() => {
    if (open && data?.id) {
      getAllBreakdownSpareRequestBySpareRequestId();
    }
  }, [open, data]);

  useEffect(() => {
    if (breakdownSpareRequestDetails.length > 0) {
      const allMatch = breakdownSpareRequestDetails.every(
        (item) =>
          item.requestStatus === breakdownSpareRequestDetailStatus.rejected ||
          item.requestStatus === breakdownSpareRequestDetailStatus.spareReplace
      );
      setIsAllRejected(allMatch);
    }
  }, [breakdownSpareRequestDetails]);

  const handleFieldChange = (value, record, field) => {
    const updated = breakdownSpareRequestDetails.map((item) => {
      if (item.id === record.id) {
        const updatedItem = {
          ...item,
          [field]: Number(value) || 0,
        };
        updatedItem.totalCost = updatedItem.qty * updatedItem.unitCost;
        return updatedItem;
      }
      return item;
    });
    setBreakdownSpareRequestDetails(updated);
  };

  const getTotalCost = () => {
    return breakdownSpareRequestDetails.reduce(
      (sum, item) => sum + (item.totalCost || 0),
      0
    );
  };
  const showComment = (item) => {
    Modal.info({
      title: t("breakdown.spareRequest.modal.reject_reason_modal.title"),
      content:
        item.comment ||
        t("breakdown.spareRequest.modal.reject_reason_modal.no_comment"),
      okText: t("breakdown.spareRequest.buttons.close"),
    });
  };
  
  const getColumns = () => {
    const baseColumns = [
      {
        title: t("breakdown.spareRequest.modal.table.index"),
        dataIndex: "id",
        key: "id",
        width: "60px",
        align: "center",
        render: (_text, _record, index) => index + 1,
      },
      {
        title: t("breakdown.spareRequest.modal.table.spare_part_name"),
        dataIndex: "sparePart",
        key: "sparePartName",
        render: (text) => <span>{text.sparePartsName || "-"}</span>,
      },
      {
        title: t("breakdown.spareRequest.modal.table.qty"),
        dataIndex: "qty",
        key: "qty",
        render: (_text, record) => (
          <Input
            type="number"
            value={record.qty}
            min={0}
            onChange={(e) => handleFieldChange(e.target.value, record, "qty")}
          />
        ),
      },
      {
        title: t("breakdown.spareRequest.modal.table.unit_cost"),
        dataIndex: "unitCost",
        key: "unitCost",
        render: (_text, record) => (
          <Input
            type="number"
            value={record.unitCost}
            min={0}
            onChange={(e) =>
              handleFieldChange(e.target.value, record, "unitCost")
            }
          />
        ),
      },
      {
        title: t("breakdown.spareRequest.modal.table.total_cost"),
        dataIndex: "totalCost",
        key: "totalCost",
        render: (_, record) => (
          <span>{(record.totalCost || 0).toLocaleString()}</span>
        ),
      },
      {
        title: t("breakdown.spareRequest.modal.table.status"),
        dataIndex: "requestStatus",
        key: "requestStatus",
        render: (text) => {
          const statusLabel =
            breakdownSpareRequestDetailStatus.Option.find(
              (opt) => opt.value === text
            )?.label || text;
          return <span>{statusLabel}</span>;
        },
      },
    ];

    if (open && data?.requestStatus !== breakdownSpareRequestStatus.submitted) {
      baseColumns.push({
        title: t("breakdown.spareRequest.modal.table.action"),
        dataIndex: "action",
        align: "center",
        fixed: "right",
        render: (_, record) => (
          <Space>
            {showButtonRejeced(record) && (
              <Tooltip
                title={t("breakdown.spareRequest.modal.tooltips.reject")}
              >
                <Button
                  icon={<CloseOutlined />}
                  size="small"
                  onClick={() => openCommentModal(record)}
                />
              </Tooltip>
            )}
            {showButtonRecovered(record) && (
              <>
                <Tooltip
                  title={t("breakdown.spareRequest.modal.tooltips.restore")}
                >
                  <Button
                    icon={<CheckOutlined />}
                    size="small"
                    onClick={() => restoreRejectedItem(record)}
                  />
                </Tooltip>
                <Tooltip
                  title={t("breakdown.spareRequest.modal.tooltips.view_reason")}
                >
                  <Button
                    icon={<BookOutlined />}
                    size="small"
                    onClick={() => showComment(record)}
                  />
                </Tooltip>
              </>
            )}
          </Space>
        ),
      });
    }

    return baseColumns;
  };

  const getAllBreakdownSpareRequestBySpareRequestId = async () => {
    const res =
      await _unitOfWork.breakdownSpareRequest.getAllBreakdownSpareRequestBySpareRequestId(
        { id: data.id }
      );
    if (res?.code === 1) {
      const withTotal = res.data?.map((item) => ({
        ...item,
        totalCost: item.qty * item.unitCost,
        currentStatus: item.requestStatus,
      }));
      setBreakdownSpareRequestDetails(withTotal);
    }
  };
  const openCommentModal = (item) => {
    setCurrentRejectingItem(item);
    setCommentText("");
    setCommentModalVisible(true);
  };

  const handleRejectWithComment = () => {
    const newDetails = [...breakdownSpareRequestDetails];
    let idxReject = newDetails.findIndex(
      (item) => item.id === currentRejectingItem.id
    );
    if (idxReject > -1) {
      newDetails[idxReject].requestStatus =
        breakdownSpareRequestDetailStatus.rejected;
      newDetails[idxReject].comment = commentText;
    }
    setBreakdownSpareRequestDetails(newDetails);
    setCommentModalVisible(false);
    setCurrentRejectingItem(null);
  };

  const restoreRejectedItem = (item) => {
    const newDetails = [...breakdownSpareRequestDetails];
    let idxReject = newDetails.findIndex(
      (newDetail) => newDetail.id === item.id
    );
    if (idxReject > -1) {
      newDetails[idxReject].requestStatus = item.currentStatus;
      newDetails[idxReject].comment = commentText;
    }
    setBreakdownSpareRequestDetails(newDetails);
  };

  const onClickAssginUser = (value) => {
    setIsOpenAssignUser(true);
    setAssignUser(value);
  };

  const onFinishSave = async () => {
    const values = form.getFieldsValue();
    if (data.requestStatus === breakdownSpareRequestStatus.approved) {
      const payload = {
        breakdownSpareRequestDetails: breakdownSpareRequestDetails,
        user: data.createdBy,
        enableIssue: values.enableIssue,
      };
      if (values && values.sendType && values.sendType === "technician") {
        payload.userIds = assignUserIds;
      }
      let res = await _unitOfWork.breakdownSpareRequest.approved(
        data.id,
        payload
      );
      if (res?.code === 1) {
        message.success(
          t("breakdown.spareRequest.modal.messages.approve_success")
        );
        onSubmit();
      } else {
        message.error(t("breakdown.spareRequest.modal.messages.approve_error"));
      }
      // if (values && values.sendType && values.sendType === "technician") {
      //   onAssignUser();
      // }
    }
  };
  const showButtonRejeced = (item) => {
    if (item.requestStatus === breakdownSpareRequestDetailStatus.approved) {
      return true;
    }
    return false;
  };
  const showButtonRecovered = (item) => {
    if (item.requestStatus === breakdownSpareRequestDetailStatus.rejected) {
      return true;
    }
    return false;
  };

  const callbackAssignUser = (value, selectedRowKeys) => {
    if (selectedRowKeys.length > 0) {
      setAssignUserIds(selectedRowKeys);
    }
    setIsOpenAssignUser(false);
    return true;
  };

  const onAssignUser = async () => {
    const payload = {
      userIds: assignUserIds,
      breakdownSpareRequestId: data.id,
      comment: form.getFieldValue("comment") || " ",
    };
    const res =
      await _unitOfWork.breakdownSpareRequest.assignUserFromSpareRequest(
        payload
      );
    if (res?.code === 1) {
      message.success(
        t("breakdown.spareRequest.modal.messages.assign_success")
      );
      onSubmit();
    } else {
      message.error(t("breakdown.spareRequest.modal.messages.assign_error"));
    }
  };
  return (
    <>
      <Modal
        open={open}
        onCancel={onCancel}
        footer={null}
        className="custom-modal"
        width={1200}
      >
        <Form labelWrap layout="vertical" form={form}>
          <Card title={t("breakdown.spareRequest.modal.title")}>
            <Row gutter={[16, 16]}>
              <Col span={6}>
                <Form.Item
                  label={t("breakdown.spareRequest.modal.fields.code")}
                >
                  <Input readOnly value={breakdown?.code || "--"} />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  label={t("breakdown.spareRequest.modal.fields.manufacturer")}
                >
                  <Input
                    readOnly
                    value={
                      breakdown?.assetMaintenance?.assetModel?.manufacturer
                        ?.manufacturerName || "-"
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  label={t("breakdown.spareRequest.modal.fields.asset_style")}
                >
                  <Input
                    readOnly
                    value={
                      t(
                        parseToLabel(
                          assetType.Options,
                          breakdown?.assetMaintenance?.assetStyle
                        )
                      ) || "-"
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  label={t("breakdown.spareRequest.modal.fields.type")}
                >
                  <Input
                    readOnly
                    value={
                      breakdown?.assetMaintenance?.assetModel?.asset
                        ?.assetName || "-"
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  label={t("breakdown.spareRequest.modal.fields.asset_name")}
                >
                  <Input
                    readOnly
                    value={
                      breakdown?.assetMaintenance?.assetModel?.asset
                        ?.assetName || "-"
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  label={t("breakdown.spareRequest.modal.fields.model_name")}
                >
                  <Input
                    readOnly
                    value={
                      breakdown?.assetMaintenance?.assetModel?.assetModelName ||
                      "-"
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  label={t("breakdown.spareRequest.modal.fields.serial")}
                >
                  <Input
                    readOnly
                    value={breakdown?.assetMaintenance?.serial || "-"}
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  label={t(
                    "breakdown.spareRequest.modal.fields.technician_name"
                  )}
                >
                  <Input
                    readOnly
                    value={
                      breakdownSpareRequestDetails[0]?.breakdownSpareRequest
                        ?.createdBy?.fullName || "-"
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  label={t("breakdown.spareRequest.modal.fields.estimate_cost")}
                >
                  <Input
                    readOnly
                    value={data?.unitCost?.toLocaleString() || "0"}
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  label={t(
                    "breakdown.spareRequest.modal.fields.requested_date"
                  )}
                >
                  <Input
                    readOnly
                    value={
                      new Date(breakdown?.createdAt).toLocaleString() || "-"
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  label={t("breakdown.spareRequest.modal.fields.status")}
                >
                  <Input
                    readOnly
                    value={
                      t(
                        breakdownSpareRequestDetailStatus.Option.find(
                          (opt) => opt.value === data?.requestStatus
                        )?.label
                      ) || "-"
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  label={t("breakdown.spareRequest.modal.fields.customer_name")}
                >
                  <Input
                    readOnly
                    value={
                      breakdown?.assetMaintenance?.customer?.customerName || "-"
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  label={t("breakdown.spareRequest.modal.fields.location_name")}
                >
                  <Input
                    readOnly
                    value={
                      breakdown?.assetMaintenance?.location?.locationName || "-"
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  label={t("breakdown.spareRequest.modal.fields.building")}
                >
                  <Input
                    readOnly
                    value={
                      breakdown?.assetMaintenance?.location?.building || "-"
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  label={t("breakdown.spareRequest.modal.fields.floor")}
                >
                  <Input
                    readOnly
                    value={breakdown?.assetMaintenance?.location?.floor || "-"}
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  label={t("breakdown.spareRequest.modal.fields.department")}
                >
                  <Input
                    readOnly
                    value={
                      breakdown?.assetMaintenance?.location?.department || "-"
                    }
                  />
                </Form.Item>
              </Col>
            </Row>

            <Table
              rowKey="id"
              columns={getColumns()}
              dataSource={[...breakdownSpareRequestDetails]}
              bordered
              pagination={false}
              scroll={{ x: "max-content" }}
            />

            <Row justify="end" style={{ marginTop: 16 }}>
              <Col>
                <strong>
                  {t("breakdown.spareRequest.modal.total_amount")}
                </strong>{" "}
                <span style={{ fontSize: 16, color: "#1890ff" }}>
                  {getTotalCost().toLocaleString()} VNĐ
                </span>
              </Col>
            </Row>

            {data.requestStatus === "approved" && !isAllRejected && (
              <>

                <Form.Item
                  label={<strong>{t("breakdown.spareRequest.modal.send_via")}</strong>}
                >
                  <Space style={{ width: "100%", justifyContent: "space-between" }}>
                    <Form.Item
                      name="sendType"
                      noStyle
                      rules={[
                        {
                          required: true,
                          message: t(
                            "breakdown.spareRequest.modal.validation.send_type_required"
                          ),
                        },
                      ]}
                    >
                      <Radio.Group
                        onChange={(e) => {
                          if (e.target.value === "technician") {
                            onClickAssginUser(data.breakdown);
                          } else {
                            setAssignUserIds([data.createdBy]);
                          }
                        }}
                      >
                        <Radio value="technician">
                          {t("breakdown.spareRequest.modal.send_type.technician")}
                        </Radio>
                        <Radio value="postman">
                          {t("breakdown.spareRequest.modal.send_type.requester")}
                        </Radio>
                      </Radio.Group>
                    </Form.Item>

                    <Form.Item name="enableIssue" valuePropName="checked" noStyle>
                      <Checkbox>Tạo phiếu xuất kho sử dụng</Checkbox>
                    </Form.Item>
                  </Space>
                </Form.Item>

                <Col span={24}>
                  <Form.Item
                    label={t("breakdown.spareRequest.modal.comment")}
                    name="comment"
                    rules={[
                      {
                        required: true,
                        message: t(
                          "breakdown.spareRequest.modal.validation.comment_required"
                        ),
                      },
                    ]}
                  >
                    <Input
                      placeholder={t(
                        "breakdown.spareRequest.modal.comment_placeholder"
                      )}
                    />
                  </Form.Item>
                </Col>
              </>
            )}

            <Row justify="end" style={{ marginTop: 24 }}>
              <Space>
                <Button onClick={onCancel}>
                  {t("breakdown.spareRequest.buttons.cancel")}
                </Button>
                <Button
                  type="primary"
                  onClick={() => {
                    form
                      .validateFields()
                      .then(() => {
                        Confirm(
                          t(
                            "breakdown.spareRequest.modal.confirm.save_changes"
                          ),
                          () => onFinishSave()
                        );
                      })
                      .catch(() => { });
                  }}
                >
                  {t("breakdown.spareRequest.buttons.save")}
                </Button>
              </Space>
            </Row>
          </Card>
        </Form>
      </Modal>

      <Modal
        title={t("breakdown.spareRequest.modal.reject_reason_modal.title")}
        open={commentModalVisible}
        onOk={handleRejectWithComment}
        onCancel={() => setCommentModalVisible(false)}
        okText={t("breakdown.spareRequest.modal.reject_reason_modal.ok")}
        cancelText={t(
          "breakdown.spareRequest.modal.reject_reason_modal.cancel"
        )}
      >
        <Input.TextArea
          rows={4}
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder={t(
            "breakdown.spareRequest.modal.reject_reason_modal.placeholder"
          )}
        />
      </Modal>

      <AssignUser
        open={isOpenAssignUser}
        hanldeColse={() => setIsOpenAssignUser(false)}
        assignUser={assignUser}
        onReset={getAllBreakdownSpareRequestBySpareRequestId}
        callbackAssignUser={callbackAssignUser}
      />
    </>
  );
};

export default ApproveSparePartModal;
