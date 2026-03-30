import { useState, useEffect } from "react";
import {
  ArrowLeftOutlined,
  SaveOutlined
} from "@ant-design/icons";
import {
  Row,
  Col,
  Card,
  Button,
  Input,
  Form,
  Select,
  message,
  Tabs,
  DatePicker
} from "antd";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";
import * as _unitOfWork from "../../../api";
import Confirm from "../../../components/modal/Confirm";
import { FORMAT_DATE } from "../../../utils/constant";
import { useCustomNav } from "../../../helper/navigate-helper";
import useAuth from "../../../contexts/authContext";
import PurchaseQuotationDetail from "./PurchaseQuotationDetail";
import QuotationAttachment from "./QuotationAttachment";
import QuotationDetailTable from "./QuotationDetailTable";
import CreateQuotationAttachment from "./QuotationAttachment/createQuotationAttachment";
import { useTranslation } from "react-i18next";

export default function UpdateQuotation() {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const navigate = useCustomNav();
  const { user } = useAuth();
  const { id } = useParams();

  const [data, setData] = useState([]);
  const [purchaseRequest, setPurchaseRequest] = useState([]);
  const [editingDetail, setEditingDetail] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [isOpenModalDetail, setIsOpenModalDetail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isOpenCreate, setIsOpenCreate] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    fetchQuotationById();
    fetchQuotationDetail();
    fetchPurchaseRequest();
    fetchQuotationAttachmentByQuotation();
  }, []);

  const onClickDelete = async (record) => {
    setAttachments(attachments.filter((a) => a.resourceId !== record.resourceId));
    setFiles(files.filter((a) => a.key !== record.key));
  };

  const handleAddAttachments = (newItems) => {
    setAttachments((prev) => [...prev, ...newItems]);
  };

  const fetchQuotationById = async () => {
    const res =
      await _unitOfWork.purchaseQuotation.getPurchaseQuotationById({
        id
      });
    if (res.data) {
      form.setFieldsValue({
        ...res.data,
        requestPurchase: res.data.requestPurchase?.id,
        quotationDate: res.data.quotationDate
          ? dayjs(res.data.quotationDate)
          : null,
        createdName: res.data.createdBy?.fullName
      });
    }
  };

  const fetchQuotationDetail = async () => {
    const res =
      await _unitOfWork.purchaseQuotation.getPurchaseQuotationDetailById({
        id
      });
    if (!res?.data) return;
    const dataTable = res.data.map((item) => {
      const {
        itemType,
        item: itm,
        uom,
        deliveryTime,
        qty = 0,
        unitPrice = 0,
        vatPercent = 0
      } = item;
      const isSpare = itemType === "SpareParts";
      const code = isSpare ? itm?.code : itm?.assetModelName;
      const name = isSpare ? itm?.sparePartsName : itm?.asset?.assetName;
      const itemId = itm?.id || itm;
      const uomName = isSpare ? itm.uomId?.uomName : uom?.uomName;
      const uomId = isSpare ? itm.uomId?.id : uom?.id;
      const vatAmount = (vatPercent / 100) * qty * unitPrice;
      const totalAmount = vatAmount + qty * unitPrice;
      return {
        ...item,
        code,
        name,
        item: itemId,
        uomName,
        uom: uomId,
        deliveryTime: deliveryTime
          ? dayjs(deliveryTime).format(FORMAT_DATE)
          : undefined,
        vatAmount,
        totalAmount
      };
    });
    setData(dataTable);
  };

  const fetchQuotationAttachmentByQuotation = async () => {
    const res =
      await _unitOfWork.purchaseQuotation.getQuotationAttachmentByQuotation({
        id
      });
    if (res?.data) {
      setAttachments(res.data);
    }
  };

  const fetchPurchaseRequest = async () => {
    const res = await _unitOfWork.requestPurchase.getAllRequestPurchase();
    if (res?.data) {
      setPurchaseRequest(
        res.data.map((item) => ({ label: item.code, value: item.id }))
      );
    }
  };

  const handleChangePurchaseRequest = async (id) => {
    const res =
      await _unitOfWork.requestPurchase.getRequestPurchasesDetailById({
        id
      });
    if (res?.data) {
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
              totalAmount
            };
          }
          return {
            ...item,
            code: item.assetModel?.assetModelName || "",
            name: item.assetModel?.asset?.assetName,
            needDate: item.needDate
              ? dayjs(item.needDate).format(FORMAT_DATE)
              : null,
            vatAmount,
            totalAmount,
            uomName: item.uom?.uomName,
            uom: item.uom?.id
          };
        })
      );
      setData(dataTable);
    }
  };

  const handleAddDetail = (newData) => {
    if (editingIndex !== null) {
      const newList = [...data];
      newList[editingIndex] = newData;
      setData(newList);
      setEditingIndex(null);
      setEditingDetail(null);
    } else {
      setData((prev) => [...prev, newData]);
    }
    setIsOpenModalDetail(false);
  };

  const handleDelete = (record) => {
    setData((prev) =>
      prev.filter((item) =>
        item.id ? item.id !== record.id : item.key !== record.key
      )
    );
  };

  const onFinish = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const uploadedItems = await Promise.all(
        files.map(async (item) => {
          if (item.file) {
            const formData = new FormData();
            formData.append("file", item.file);
            const res = await _unitOfWork.resource.uploadImage(formData);
            if (res) {
              return { ...res, resourceType: item.resourceType };
            }
          }
        })
      );
      const detailData = data.map((item) => ({
        ...item,
        item: item.item?.id || item.item,
        deliveryTime: dayjs(item.deliveryTime, FORMAT_DATE).toDate(),
        uom: item.itemType === "AssetModel" ? item.uom : null
      }));
      const payload = {
        id: id,
        quotation: { ...values, id },
        quotationDetail: [...detailData],
        attachments: [...uploadedItems, ...attachments],
      };
      const res =
        await _unitOfWork.purchaseQuotation.updatePurchaseQuotation(
          payload
        );
      if (res?.code === 1) {
        message.success(t("purchaseQuotation.messages.update_success"));
        navigate(-1);
      } else {
        message.error(res?.message || t("common.messages.errors.failed"));
      }
    } catch (error) {
      message.error(t("common.messages.errors.failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      form={form}
      onFinish={() =>
        Confirm(
          t("purchaseQuotation.messages.confirm_update"),
          onFinish
        )
      }
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
    >
      <Card
        title={t("purchaseQuotation.form.update_title")}
        extra={
          <>
            <Button onClick={() => navigate(-1)}>
              <ArrowLeftOutlined /> {t("purchase.buttons.back")}
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              className="ml-2"
            >
              <SaveOutlined /> {t("purchase.buttons.save")}
            </Button>
          </>
        }
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label={t("purchaseQuotation.form.fields.creator")}
              name="createdName"
              labelAlign="left"
            >
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t("purchaseQuotation.form.fields.supplier")}
              name="supplier"
              labelAlign="left"
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t(
                "purchaseQuotation.form.fields.contact_phone"
              )}
              name="contactPhone"
              labelAlign="left"
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t(
                "purchaseQuotation.form.fields.contact_address"
              )}
              name="contactAddress"
              labelAlign="left"
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t("purchaseQuotation.form.fields.email")}
              name="email"
              labelAlign="left"
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t(
                "purchaseQuotation.form.fields.quotation_date"
              )}
              name="quotationDate"
              labelAlign="left"
            >
              <DatePicker format={FORMAT_DATE} className="w-100" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t(
                "purchaseQuotation.form.fields.request_purchase"
              )}
              name="requestPurchase"
              labelAlign="left"
            >
              <Select
                options={purchaseRequest}
                onChange={(value) => {
                  if (data) setData([]);
                  Confirm(
                    t(
                      "purchaseQuotation.messages.confirm_import_request"
                    ),
                    () => {
                      handleChangePurchaseRequest(value);
                    }
                  );
                }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t("purchaseQuotation.form.fields.note")}
              name="note"
              labelAlign="left"
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Tabs
          defaultActiveKey="detail"
          items={[
            {
              key: "detail",
              label: t("purchaseQuotation.tabs.detail"),
              children: (
                <QuotationDetailTable
                  data={data}
                  onEdit={(record, index) => {
                    setEditingIndex(index);
                    setEditingDetail(record);
                    setIsOpenModalDetail(true);
                  }}
                  onDelete={handleDelete}
                  onAdd={() => {
                    setEditingDetail(null);
                    setEditingIndex(null);
                    setIsOpenModalDetail(true);
                  }}
                />
              )
            },
            {
              key: "attachment",
              label: t("purchaseQuotation.tabs.attachment"),
              children: (
                <QuotationAttachment
                  attachments={[...attachments, ...files]}
                  handleAdd={() => {
                    setIsOpenCreate(true);
                  }}
                  handleDelete={onClickDelete}
                />
              )
            }
          ]}
        />

        <PurchaseQuotationDetail
          open={isOpenModalDetail}
          handleOk={handleAddDetail}
          handleCancel={() => {
            setIsOpenModalDetail(false);
            setEditingDetail(null);
            setEditingIndex(null);
          }}
          initialData={editingDetail}
        />
        <CreateQuotationAttachment
          open={isOpenCreate}
          handleCancel={() => setIsOpenCreate(false)}
          handleOk={handleAddAttachments}
          handleFinish={(data) => setFiles([...files,...data])}
        />
      </Card>
    </Form>
  );
}