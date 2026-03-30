import { useEffect, useState } from "react";
import {
  Row,
  Col,
  Card,
  Button,
  Input,
  Form,
  Select,
  Divider,
  Table,
  message,
  Modal,
} from "antd";
import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { FORMAT_DATE } from "../../utils/constant";
import * as _unitOfWork from "../../api";
import Confirm from "../../components/modal/Confirm";
import ConfirmWithReasonModal from "../../components/modal/ConfirmWithReason";
import { useTranslation } from "react-i18next";

const ApproveRequestPurchase = ({ id, open, handleClose, onfinish }) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [branches, setBranches] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [isOpenModalReject, setIsOpenModalReject] = useState();
  const [action, setAction] = useState();
  useEffect(() => {
    if (open) {
      fetchRequestPurchaseById(id);
      fetchDepartments();
      fetchBranches();
      fetchDataTable();
      fetchSuppliers();
    }
  }, [open]);

  const fetchRequestPurchaseById = async (id) => {
    const res = await _unitOfWork.requestPurchase.getRequestPurchaseById({
      id,
    });
    if (res) {
      form.setFieldsValue({ ...res, createdName: res.createdBy?.fullName });
      setAction(res.action);
    }
  };

  const fetchDepartments = async () => {
    const department = await _unitOfWork.department.getAllDepartment();
    if (department?.data) {
      const option = department.data.map((item) => ({
        label: item.departmentName,
        value: item.id,
      }));
      setDepartments(option);
    }
  };

  const fetchBranches = async () => {
    const branch = await _unitOfWork.branch.getAllBranch();
    if (branch?.data) {
      const option = branch.data.map((item) => ({
        label: item.name,
        value: item.id,
      }));
      setBranches(option);
    }
  };

  const fetchSuppliers = async () => {
    const supplier = await _unitOfWork.supplier.getAllSupplier();
    if (supplier?.data) {
      const option = supplier.data.map((item) => ({
        label: item.supplierName,
        value: item.id,
      }));
      setSuppliers(option);
    }
  };

  const fetchDataTable = async () => {
    const res = await _unitOfWork.requestPurchase.getRequestPurchasesDetailById(
      { id },
    );
    if (res.data) {
      const dataTable = await Promise.all(
        res.data.map(async (item) => {
          const vatAmount =
            (parseFloat(item.vatPercent || 0) / 100) *
            parseFloat(item.qty || 0) *
            parseFloat(item.unitPrice || 0);
          const totalAmount =
            vatAmount +
            parseFloat(item.qty || 0) * parseFloat(item.unitPrice || 0);

          if (item.itemType === "SpareParts") {
            return {
              ...item,
              code: item.sparePart?.code,
              name: item.sparePart?.sparePartsName,
              uomName: item.sparePart?.uomId?.uomName,
              needDate: item.needDate
                ? dayjs(item.needDate).format(FORMAT_DATE)
                : null,
              vatAmount,
              totalAmount,
            };
          } else {
            return {
              ...item,
              code: item.assetModel?.assetModelName || "",
              name: item.asset?.assetName,
              needDate: item.needDate
                ? dayjs(item.needDate).format(FORMAT_DATE)
                : null,
              vatAmount,
              totalAmount,
              uom: item.uom?.id,
              uomName: item.uom?.uomName,
            };
          }
        }),
      );
      setData(dataTable);
    }
  };

  const handleApprove = async () => {
    Confirm(t("modal.messages.approve_confirm"), async () => {
      const result =
        await _unitOfWork.requestPurchase.updateRequestPurchaseStatus({
          RequestPurchase: { id, action: "approved" },
        });
      if (result) {
        message.success(t("modal.messages.approve_success"));
        onfinish();
      }
    });
  };

  const handleReject = async (reason) => {
    const result =
      await _unitOfWork.requestPurchase.updateRequestPurchaseStatus({
        RequestPurchase: { id, action: "rejected", comment: reason },
      });
    if (result) {
      message.success(t("modal.messages.reject_success"));
      onfinish();
    }
  };
  const columns = [
    {
      title: t("modal.common.table.index"),
      dataIndex: "id",
      key: "id",
      width: 60,
      align: "center",
      render: (_text, _record, index) => index + 1,
    },
    {
      title: t("modal.requestPurchase.table.code"),
      dataIndex: "code",
      key: "code",
      width: 120,
    },
    {
      title: t("modal.requestPurchase.table.name"),
      dataIndex: "name",
      key: "name",
      width: 200,
    },
    {
      title: t("modal.requestPurchase.table.uom"),
      dataIndex: "uomName",
      key: "uomName",
      width: 80,
      align: "center",
    },
    {
      title: t("modal.requestPurchase.table.qty"),
      dataIndex: "qty",
      key: "qty",
      width: 100,
      align: "right",
    },
    {
      title: t("modal.requestPurchase.table.unit_price"),
      dataIndex: "unitPrice",
      key: "unitPrice",
      width: 120,
      align: "right",
    },
    {
      title: t("modal.requestPurchase.table.vat_percent"),
      dataIndex: "vatPercent",
      key: "vatPercent",
      width: 100,
      align: "right",
    },
    {
      title: t("modal.requestPurchase.table.vat_amount"),
      dataIndex: "vatAmount",
      key: "vatAmount",
      width: 120,
      align: "right",
    },
    {
      title: t("modal.requestPurchase.table.total_amount"),
      dataIndex: "totalAmount",
      key: "totalAmount",
      width: 140,
      align: "right",
    },
    {
      title: t("modal.requestPurchase.table.supplier"),
      dataIndex: "supplier",
      key: "supplier",
      width: 160,
    },
    {
      title: t("modal.requestPurchase.table.need_date"),
      dataIndex: "needDate",
      key: "needDate",
      width: 120,
    },
    {
      title: t("modal.requestPurchase.table.usage_purpose"),
      dataIndex: "usagePurpose",
      key: "usagePurpose",
      width: 180,
    },
    {
      title: t("modal.requestPurchase.table.note"),
      dataIndex: "note",
      key: "note",
      width: 150,
    },
  ];

  return (
    <Modal
      open={open}
      footer={null}
      width={"80%"}
      closable={false}
      className="custom-modal"
    >
      <Form
        labelWrap
        form={form}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
      >
        <Card
          title={
            action === "pendingApproval"
              ? t("modal.requestPurchase.title_pending")
              : t("modal.requestPurchase.title_detail")
          }
          extra={
            <>
              <Button className="mr-2" onClick={handleClose}>
                <ArrowLeftOutlined /> {t("modal.common.buttons.back")}
              </Button>
              {action && action === "pendingApproval" && (
                <>
                  <Button
                    type="primary"
                    className="mr-2"
                    icon={<CheckCircleOutlined />}
                    onClick={handleApprove}
                  >
                    {t("modal.common.buttons.approve")}
                  </Button>
                  <Button
                    danger
                    icon={<CloseCircleOutlined />}
                    onClick={() => setIsOpenModalReject(true)}
                  >
                    {t("modal.common.buttons.reject")}
                  </Button>
                </>
              )}
            </>
          }
        >
          <Row gutter={32}>
            <Col span={12}>
              <Form.Item
                labelAlign="left"
                label={t("modal.requestPurchase.form.code")}
                name="code"
              >
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                labelAlign="left"
                label={t("modal.requestPurchase.form.created_by")}
                name="createdName"
              >
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                labelAlign="left"
                label={t("modal.requestPurchase.form.branch")}
                name="branch"
              >
                <Select options={branches} disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                labelAlign="left"
                label={t("modal.requestPurchase.form.department")}
                name="department"
              >
                <Select options={departments} disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                labelAlign="left"
                label={t("modal.requestPurchase.form.supplier")}
                name="supplier"
              >
                <Select options={suppliers} disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                labelAlign="left"
                label={t("modal.requestPurchase.form.note")}
                name="description"
              >
                <Input disabled />
              </Form.Item>
            </Col>
          </Row>
          <Divider orientation="left" size="small">
            {t("modal.requestPurchase.divider_items")}
          </Divider>
          <Table
            rowKey="id"
            columns={columns}
            scroll={{ x: 1800 }}
            className="wp-100"
            dataSource={data}
            bordered
            pagination={false}
          />
          <ConfirmWithReasonModal
            visible={isOpenModalReject}
            onConfirm={handleReject}
            onCancel={() => setIsOpenModalReject(false)}
          />
        </Card>
      </Form>
    </Modal>
  );
};

export default ApproveRequestPurchase;
