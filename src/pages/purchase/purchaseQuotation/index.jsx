import { useEffect, useState } from "react";
import {
  DeleteOutlined,
  EditOutlined,
  FilterOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
  RedoOutlined,
  SearchOutlined,
  SwapOutlined
} from "@ant-design/icons";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Pagination,
  Row,
  Space,
  Table,
  Tooltip
} from "antd";
import dayjs from "dayjs";
import { FORMAT_DATE, PAGINATION } from "../../../utils/constant";
import * as _unitOfWork from "../../../api";
import { staticPath } from "../../../router/routerConfig";
import useHeader from "../../../contexts/headerContext";
import Comfirm from "../../../components/modal/Confirm";
import { useCustomNav } from "../../../helper/navigate-helper";
import useAuth from "../../../contexts/authContext";
import { checkPermission } from "../../../helper/permission-helper";
import { permissionCodeConstant } from "../../../utils/permissionConstant";
import { useTranslation } from "react-i18next";
import SearchSelectInput from "../../../components/common/SearchSelectInput";
import DrawerSearchPurchase from "../../../components/drawer/drawerSearchPurchase";

export default function PurchaseQuotation() {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(PAGINATION);
  const [totalRecord, setTotalRecord] = useState(0);
  const navigate = useCustomNav();
  const [purchaseQuotations, setPurchaseQuotations] = useState([]);
  const { setHeaderTitle } = useHeader();
  const { permissions } = useAuth();
  const [searchField, setSearchField] = useState("searchText");
  const [isOpenSearchAdvanced, setIsOpenSearchAdvanced] = useState(false);
  const [searchParams, setSearchParams] = useState({
    code: "",
    startDate: "",
    endDate: ""
  });

  useEffect(() => {
    setHeaderTitle(t("purchaseQuotation.list.title"));

  }, [t, setHeaderTitle]);

  useEffect(() => {
    fetchPurchaseQuotations();
  }, [page]);

  const onClickGoTocompare_view = () => {
    navigate(staticPath.quotationComparison);
  }

  const onChangePagination = (value) => {
    setPage(value);
  };

  const fetchPurchaseQuotations = async (page = 1, value) => {
    const searchValue = form.getFieldValue("searchValue");

    try {
      let payload = {
        page,
        limit: PAGINATION.limit,
        ...searchParams,
        // startDate: searchParams.startDate
        //   ? dayjs(searchParams.startDate, FORMAT_DATE).toDate()
        //   : "",
        // endDate: searchParams.endDate
        //   ? dayjs(searchParams.endDate, FORMAT_DATE).toDate()
        //   : ""
        ...value,
        [searchField]: searchValue,
      };
      const res =
        await _unitOfWork.purchaseQuotation.getListPurchaseQuotation(
          payload
        );
      if (res && res.results && res.results.results) {
        const data = res.results.results;
        const dataWithNames = await Promise.all(
          data.map(async (item) => {
            const createdAt = dayjs(item.createdAt).format(FORMAT_DATE);
            const branchName = item.branch?.name;
            const departmentName =
              item.department?.departmentName;
            return {
              ...item,
              branchName,
              departmentName,
              createdAt
            };
          })
        );
        setPurchaseQuotations(dataWithNames);
        setTotalRecord(res.results.totalResults);
      }
    } catch (error) {
      console.error("Failed to fetch purchase quotations:", error);
      message.error(t("purchaseQuotation.messages.delete_error"));
    }
  };




  const handleDelete = async (id) => {
    try {
      const res =
        await _unitOfWork.purchaseQuotation.deletePurchaseQuotation({
          id
        });
      if (res && res.code === 1) {
        fetchPurchaseQuotations();
        message.success(
          t("purchaseQuotation.messages.delete_success")
        );
      } else {
        message.error(t("purchaseQuotation.messages.delete_error"));
      }
    } catch (error) {
      message.error(t("purchaseQuotation.messages.delete_error"));
    }
  };

  const columns = [
    {
      title: t("purchaseQuotation.list.table.index"),
      dataIndex: "id",
      key: "id",
      width: "60px",
      align: "center",
      render: (_text, _record, index) =>
        (page - 1) * PAGINATION.limit + index + 1
    },
    {
      title: t("purchaseQuotation.list.table.code"),
      dataIndex: "code",
      width: "180px",
      key: "code"
    },
    {
      title: t("purchaseQuotation.list.table.note"),
      dataIndex: "note",
      key: "note"
    },
    {
      title: t("purchaseQuotation.list.table.quotation_date"),
      dataIndex: "quotationDate",
      key: "quotationDate",
      align: "center",
      width: "180px",
      render: (text) => (
        <span>
          {text ? dayjs(text).format(FORMAT_DATE) : undefined}
        </span>
      )
    },
    {
      title: t("purchaseQuotation.list.table.created_at"),
      dataIndex: "createdAt",
      key: "createdAt",
      align: "center",
      width: "180px",
      sorter: (a, b) =>
        dayjs(a.createdAt, FORMAT_DATE).toDate() -
        dayjs(b.createdAt, FORMAT_DATE).toDate(),
      sortDirections: ["ascend", "descend"]
    },
    {
      title: t("purchaseQuotation.list.table.action"),
      dataIndex: "action",
      align: "center",
      width: "120px",
      render: (_, record) => (
        <div>
          {checkPermission(
            permissions,
            permissionCodeConstant.quotation_edit
          ) && (
              <Tooltip title={t("purchase.actions.edit")}>
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  size="small"
                  onClick={() =>
                    navigate(
                      `${staticPath.updatePurchaseQuotation}/${record.id}`
                    )
                  }
                />
              </Tooltip>
            )}
          {checkPermission(
            permissions,
            permissionCodeConstant.quotation_delete
          ) && (
              <Tooltip title={t("purchase.actions.delete")}>
                <Button
                  type="primary"
                  danger
                  icon={<DeleteOutlined />}
                  size="small"
                  className="ml-2"
                  onClick={() =>
                    Comfirm(
                      t("purchaseQuotation.messages.confirm_delete"),
                      () => handleDelete(record.id)
                    )
                  }
                />
              </Tooltip>
            )}
        </div>
      )
    }
  ];

  const onClickGoToCreate = () => {
    navigate(staticPath.createPurchaseQuotation);
  };

  const handleSearch = () => {
    if (page > 1) {
      setPage(1);
    } else {
      fetchPurchaseQuotations();
    }
  };

  const handleReset = () => {
    form.resetFields();
    if (page > 1) {
      setPage(1);
    } else {
      fetchPurchaseQuotations();
    }
  };

  return (
    <div className="p-3">
      <Form
labelWrap
        form={form}
        layout="vertical"
        onFinish={handleSearch}
        initialValues={{
          code: "",
          startDate: "",
          endDate: ""
        }}
      >
        <Row align="middle" gutter={16} style={{ marginBottom: 2 }}>
          <Col span={8}>
            <SearchSelectInput
              form={form}
              fieldValue={searchField}
              onFieldChange={setSearchField}
              options={[
                { value: "searchText", label: t("preventive.common.all") },
                { value: "code", label: t("suppliesNeed.list.search.code_label") },
                { value: "productName", label: t("purchaseQuotation.list.search.product_name_label") },

              ]}
            />
          </Col>
          {/* <Col span={4}>
            <Form.Item
              name="code"
              label={t("purchaseQuotation.list.search.code_label")}
            >
              <Input
                placeholder={t(
                  "purchaseQuotation.list.search.placeholder_code"
                )}
              />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item
              name="productName"
              label={t(
                "purchaseQuotation.list.search.product_name_label"
              )}
            >
              <Input
                placeholder={t(
                  "purchaseQuotation.list.search.placeholder_product_name"
                )}
              />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item
              name="startDate"
              label={t("purchaseQuotation.list.search.start_label")}
            >
              <DatePicker
                placeholder={t(
                  "purchaseQuotation.list.search.placeholder_start"
                )}
                format={FORMAT_DATE}
                style={{ width: "100%" }}
                allowClear
              />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item
              name="endDate"
              label={t("purchaseQuotation.list.search.end_label")}
            >
              <DatePicker
                placeholder={t(
                  "purchaseQuotation.list.search.placeholder_end"
                )}
                format={FORMAT_DATE}
                style={{ width: "100%" }}
                allowClear
              />
            </Form.Item>
          </Col> */}

          <Col span={8} style={{ textAlign: "left" }}>
            <Space>

              <Button
                type="primary"
                // className="mr-1"
                htmlType="submit"
              >
                <SearchOutlined />
                {t("purchase.buttons.search")}
              </Button>
              <Button
                onClick={handleReset}
                className="bt-green"
              >
                <RedoOutlined />
                {t("purchase.buttons.reset")}
              </Button>
              <Button
                icon={<FilterOutlined style={{ fontSize: 20, position: "relative", top: 1 }} />}
                title={t("preventive.buttons.advanced_search")}
                onClick={() => setIsOpenSearchAdvanced(true)}

              />
            </Space>
          </Col>
          <Col span={8} style={{ textAlign: "right" }}>
            {/* <Tooltip
              title={t("purchase.actions.help")}
              color="#616263"
            >
              <QuestionCircleOutlined
                style={{
                  fontSize: 20,
                  cursor: "pointer",
                  marginLeft: 10
                }}
              />
              
            </Tooltip> */}
            {checkPermission(
              permissions,
              permissionCodeConstant.quotation_compare_view
            ) && (
                <Button
                  key="2"
                  type="primary"
                  onClick={onClickGoTocompare_view}
                  className="ml-2"
                >
                  <SwapOutlined /> {t("common_buttons.compare")}
                </Button>
              )}
            {checkPermission(
              permissions,
              permissionCodeConstant.quotation_create
            ) && (
                <Button
                  key="2"
                  type="primary"
                  onClick={onClickGoToCreate}
                  className="ml-2"
                >
                  <PlusOutlined /> {t("purchase.buttons.create")}
                </Button>
              )}
          </Col>
          <Col
            span={24}
            style={{ fontSize: 16, textAlign: "right" }}
          >
            <b>
              {t("purchaseQuotation.list.total", {
                count: totalRecord || 0
              })}
            </b>
          </Col>
        </Row>
      </Form>
      <Table
        rowKey="id"
        columns={columns}
        key="id"
        dataSource={purchaseQuotations}
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
      <DrawerSearchPurchase
        isOpen={isOpenSearchAdvanced}
        onCallBack={(value) => {
          form.resetFields(["searchValue"]);
          fetchPurchaseQuotations(1, value);
        }}
        onClose={() => { setIsOpenSearchAdvanced(false) }}
        type="quotation"
      />
    </div>
  );
}