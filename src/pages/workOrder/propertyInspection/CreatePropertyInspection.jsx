import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as _unitOfWork from "../../../api";
import {
  Button,
  Card,
  Checkbox,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  message,
  Row,
  Select,
  Table,
} from "antd";
import { useTranslation } from "react-i18next";
import { LeftOutlined, PlusOutlined } from "@ant-design/icons";
import {
  FORMAT_DATE,
  priorityLevelStatus,
  propertyInspectionStatus,
} from "../../../utils/constant";
import dayjs from "dayjs";
import { filterOption } from "../../../helper/search-select-helper";
import { staticPath } from "../../../router/routerConfig";
import AttachmentModel from "../../../components/modal/attachmentModel/AttachmentModel";
import AssetMaintenanceModel from "../../../components/modal/assetModel/AssetMaintenanceModel";
import Search from "antd/es/input/Search";
import ShowError from "../../../components/modal/result/errorNotification";
import ShowSuccess from "../../../components/modal/result/successNotification";

export default function CreatePropertyInspection() {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const nagivate = useNavigate();
  const [propertyInspectionTasks, setPropertyInspectionTasks] = useState([]);
  const [isOpenAsseMaintenancetModel, setIsOpenAssetMaintenanceModel] =
    useState(false);
  const [assetMaintenceChange, setAssetMaintenceChange] = useState(null);
  const [fileList, setFileList] = useState([]);
  const checkboxBreakdown = Form.useWatch("checkboxBreakdown", form);
  const navigate = useNavigate();

  useEffect(() => {
    if (assetMaintenceChange)
      fetchGetAssetMaintenanceCheckListByAssetMaintenance();
  }, [assetMaintenceChange]);

  const fetchGetAssetMaintenanceCheckListByAssetMaintenance = async () => {
    let res =
      await _unitOfWork.assetMaintenance.getAssetMaintenanceChecklistByRes({
        assetMaintenance: assetMaintenceChange?._id || assetMaintenceChange?.id,
      });
    if (res && res.code === 1) {
      const formattedData = res.data.map((item, index) => ({
        ...item,
        uid: item._id || index, // đảm bảo unique
        index: index + 1,
        status: item.status || false,
      }));
      setPropertyInspectionTasks(formattedData);
    }
  };

  const onFinish = async () => {
    if (!assetMaintenceChange) {
      ShowError(
        "topRigth",
        t("notification.warning"),
        t("propertyInspection.no_assets_have_been_selected_for_inspection_yet"),
      );
    }
    const newSupportDocuments = [];
    if (fileList) {
      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        const resUpload = await _unitOfWork.resource.uploadImage({
          file: file?.originFileObj,
        });
        if (resUpload && resUpload.code === 1) {
          newSupportDocuments.push({
            resource: resUpload.resourceId,
          });
        }
      }
    }
    const payload = {
      assetMaintenance: assetMaintenceChange?._id || assetMaintenceChange?.id,
      checklistItems: propertyInspectionTasks.map((item) => ({
        content: item.content,
        status: item.status,
        index: item.index,
      })),
      checkboxBreakdown: checkboxBreakdown || false,
      breakdownDescription: form.getFieldValue("breakdownDescription") || "",
      priorityLevel: form.getFieldValue("priorityLevel") || null,
      note: form.getFieldValue("note") || "",
      nameUser: form.getFieldValue("nameUser") || "",
      listDocuments: newSupportDocuments,
    };
    try {
      const res =
        await _unitOfWork.propertyInspection.createPropertyInspection(payload);
      if (res && res.code === 1) {
        navigate(-1);
        ShowSuccess(
          "topRight",
          t("notification.title"),
          t("taxGroup.create_success"),
        );
      }
    } catch (error) {
      message.error("spareCategory.messages.create_error");
    }
  };
  const handleStatusChange = (checked, record) => {
    setPropertyInspectionTasks((prev) =>
      prev.map((item) =>
        item.uid === record.uid ? { ...item, status: checked } : item,
      ),
    );
  };
  const onClickSearchAssetMaintenance = (value) => {
    setIsOpenAssetMaintenanceModel(true);
    form.setFieldsValue({
      serial: null,
      assetNumber: null,
      customer: null,
      asset: null,
      assetModel: null,
      category: null,
      manufacturer: null,
      assetMaintenanceStatus: null,
    });
  };
  const columns = [
    {
      title: t("propertyInspection.table.stt"),
      dataIndex: "index",
      align: "center",
      width: "5%",
    },
    {
      title: t("propertyInspection.table.content"),
      dataIndex: "content",
    },
    {
      title: t("propertyInspection.table.complete_the_task"),
      dataIndex: "status",
      width: "25%",
      align: "center",
      render: (_, record) => (
        <Checkbox
          checked={record.status || false}
          onChange={(e) => handleStatusChange(e.target.checked, record)}
        />
      ),
    },
  ];
  const onChange = (e) => {
    form.setFieldsValue({
      checkboxBreakdown: e.target.checked,
    });
  };
  return (
    <div className="" style={{ background: "#fff" }}>
      <Form
        labelWrap
        layout="horizontal"
        form={form}
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        onFinish={onFinish}
      >
        <Card
          extra={
            <>
              <Button onClick={() => nagivate(-1)}>
                <LeftOutlined />
                {t("common_buttons.back")}
              </Button>
              <Button className="ml-2" type="primary" htmlType="submit">
                <PlusOutlined />
                {t("common_buttons.create")}
              </Button>
            </>
          }
        >
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item
                label={t("assetMaintenance.asset_number")}
                name="assetNumber"
                labelAlign="left"
                rules={[
                  {
                    required: true,
                    message: t("assetMaintenance.please_select_an_asset"),
                  },
                ]}
              >
                <Search
                  placeholder={t("preventive.form.serial_placeholder")}
                  allowClear
                  enterButton={t("preventive.buttons.find_asset")}
                  onSearch={onClickSearchAssetMaintenance}
                  readOnly
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t("preventive.form.serial")}
                name="serial"
                labelAlign="left"
              >
                <Input
                  placeholder={t("preventive.form.serial")}
                  disabled
                ></Input>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t("breakdown.create.fields.customer")}
                name="customer"
                labelAlign="left"
              >
                <Input
                  placeholder={t("breakdown.create.fields.customer")}
                  disabled
                ></Input>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t("breakdown.create.fields.asset")}
                name="asset"
                labelAlign="left"
              >
                <Input
                  placeholder={t("breakdown.create.placeholders.asset")}
                  disabled
                ></Input>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t("breakdown.create.fields.asset_model")}
                name="assetModel"
                labelAlign="left"
              >
                <Input
                  placeholder={t("breakdown.create.placeholders.model")}
                  disabled
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t("category.form.fields.name")}
                name="category"
                labelAlign="left"
              >
                <Input
                  placeholder={t("category.form.fields.name_placeholder")}
                  disabled
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t("manufacturer.form.fields.name")}
                name="manufacturer"
                labelAlign="left"
              >
                <Input
                  placeholder={t("manufacturer.form.fields.name_placeholder")}
                  disabled
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t("propertyInspection.table.name_user")}
                name="nameUser"
                labelAlign="left"
              >
                <Input></Input>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t("propertyInspection.inspection_date")}
                name="inspectionDate"
                labelAlign="left"
              >
                <DatePicker
                  format={FORMAT_DATE}
                  style={{ width: "100%" }}
                  allowClear
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t("propertyInspection.table.status")}
                name="status"
                labelAlign="left"
              >
                <Select
                  showSearch
                  allowClear
                  options={(propertyInspectionStatus.Options || []).map(
                    (item) => ({
                      value: item.value,
                      label: t(item.label),
                    }),
                  )}
                  filterOption={filterOption}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t("propertyInspection.table.note")}
                name="note"
                labelAlign="left"
              >
                <Input></Input>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="checkboxBreakdown"
                label={t("propertyInspection.job_situation")}
                labelAlign="left"
              >
                <Checkbox onChange={onChange}>
                  {t("propertyInspection.encountered_a_problem")}
                </Checkbox>
              </Form.Item>
            </Col>
            {checkboxBreakdown && checkboxBreakdown === true && (
              <>
                <Col span={12}>
                  <Form.Item
                    label={t("breakdown.create.fields.priority_level")}
                    name="priorityLevel"
                    labelAlign="left"
                    style={{ marginBottom: 12 }}
                    rules={[
                      {
                        required: true,
                        message: t(
                          "propertyInspection.please_select_your_priority_level",
                        ),
                      },
                    ]}
                  >
                    <Select
                      placeholder={t(
                        "breakdown.create.placeholders.priority_level",
                      )}
                      options={(priorityLevelStatus.Options || []).map(
                        (item) => ({
                          value: item.value,
                          label: t(item.label),
                        }),
                      )}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label={t("breakdown.create.fields.description")}
                    name="breakdownDescription"
                    labelAlign="left"
                    rules={[
                      {
                        required: true,
                        message: t("breakdown.create.placeholders.description"),
                      },
                    ]}
                  >
                    <Input.TextArea
                      rows={4}
                      placeholder={t("breakdown.create.fields.description")}
                    />
                  </Form.Item>
                </Col>
              </>
            )}
          </Row>
          <Divider>{t("propertyInspection.checklist")}</Divider>
          <Row>
            <Col span={24}>
              <Table
                columns={columns}
                dataSource={propertyInspectionTasks}
                rowKey="uid"
                pagination={false}
                size="middle"
                className="checklist-table"
              />
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <AttachmentModel value={fileList} onChange={setFileList} />
              <AssetMaintenanceModel
                open={isOpenAsseMaintenancetModel}
                handleCancel={() => setIsOpenAssetMaintenanceModel(false)}
                form={form}
                assetChange={assetMaintenceChange}
                onSelectAssetMaintenance={async (assetMaintenance) => {
                  setAssetMaintenceChange(assetMaintenance);
                  form.setFieldsValue({
                    assetModel: assetMaintenance?.assetModel?.assetModelName,
                    asset: assetMaintenance?.assetModel?.asset?.assetName,
                    serial: assetMaintenance?.serial,
                    assetNumber: assetMaintenance?.assetNumber,
                    customer: assetMaintenance?.customer?.customerName,
                    category:
                      assetMaintenance?.assetModel?.category?.categoryName,
                    manufacturer:
                      assetMaintenance?.assetModel?.manufacturer
                        ?.manufacturerName,
                  });
                }}
              />
            </Col>{" "}
          </Row>
        </Card>
      </Form>
    </div>
  );
}
