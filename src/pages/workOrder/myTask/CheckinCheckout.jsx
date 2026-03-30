import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Card,
  Button,
  DatePicker,
  TimePicker,
  Radio,
  Input,
  Switch,
  Divider,
  Tooltip,
  Tabs,
  Form,
  Table,
  Upload,
  message,
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  UploadOutlined,
  LeftOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import * as _unitOfWork from "../../../api";
import { useNavigate, useParams } from "react-router-dom";
import ScheduleDetails from "./ScheduleDetails";
import TaskDetails from "./TaskDetails";
import AddressDetails from "./AddressDetails";
import ShowSuccess from "../../../components/modal/result/successNotification";
import ShowError from "../../../components/modal/result/errorNotification";
import { answerTypeInspection, ServiceTaskType } from "../../../utils/constant";
import AssetDetailTab from "./AssetDetails";
import { useTranslation } from "react-i18next";
import TimeInput from "../../../components/common/TimeInput";

export default function CheckinCheckout() {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const params = useParams();
  const [
    schedulePreventiveTaskAssignUser,
    setSchedulePreventiveTaskAssignUser,
  ] = useState({});
  const [taskItemCheckInCheckOuts, setTaskItemCheckInCheckOuts] = useState([
    { key: 1, checkInDate: "", checkOutDate: "" },
  ]);
  const [schedulePreventiveTaskItems, setSchedulePreventiveTaskItems] =
    useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchScheduleDetails();
  }, []);

  useEffect(() => {
    if (schedulePreventiveTaskAssignUser) {
      form.setFieldsValue({
        downtimeHr:
          schedulePreventiveTaskAssignUser?.schedulePreventive?.downtimeHr,
        downtimeMin:
          schedulePreventiveTaskAssignUser?.schedulePreventive?.downtimeMin,
      });
    }
  }, [schedulePreventiveTaskAssignUser, form]);
  const fetchScheduleDetails = async () => {
    let res =
      await _unitOfWork.schedulePreventive.getSchedulePreventiveTaskAssignUserById(
        {
          id: params.id,
        },
      );
    if (res && res.code === 1) {
      setSchedulePreventiveTaskAssignUser(res?.data);
      setSchedulePreventiveTaskItems(res?.taskItems);
    }
  };
  const handleFinish = async () => {
    const values = form.getFieldsValue();
    for (let i = 0; i < taskItemCheckInCheckOuts.length; i++) {
      const item = taskItemCheckInCheckOuts[i];
      if (
        !item.checkOutTime ||
        !item.checkOutDate ||
        !item.checkInTime ||
        !item.checkInDate
      ) {
        message.error(
          t("myTask.checkin.validation.checkin_required_row", { row: i + 1 }),
        );
        return;
      }
      const checkInDateTime = dayjs(
        `${item.checkInDate} ${item.checkInTime}`,
        "YYYY-MM-DD HH:mm",
      );
      const checkOutDateTime = dayjs(
        `${item.checkOutDate} ${item.checkOutTime}`,
        "YYYY-MM-DD HH:mm",
      );
      if (
        checkOutDateTime.isBefore(checkInDateTime) ||
        checkOutDateTime.isSame(checkInDateTime)
      ) {
        message.error(
          t("myTask.checkin.validation.checkout_must_after_checkin", {
            row: i + 1,
          }),
        );
        return;
      }
    }

    const taskItems = await Promise.all(
      schedulePreventiveTaskItems.map(async (taskItem, taskItemIdx) => {
        const formTaskItem = values.taskItems?.[taskItemIdx] || {};
        let resource = null;

        if (
          Array.isArray(formTaskItem.file) &&
          formTaskItem.file.length > 0 &&
          formTaskItem.file[0].originFileObj
        ) {
          const resUpload = await _unitOfWork.resource.uploadImage({
            file: formTaskItem.file[0].originFileObj,
          });
          if (resUpload && resUpload.code === 1) {
            resource = resUpload.resourceId;
          }
        }

        const { file, ...rest } = formTaskItem;

        return {
          ...rest,
          taskItemId: taskItem._id || taskItem.id,
          resource,
        };
      }),
    );

    const checkInOutList = taskItemCheckInCheckOuts.map((item) => ({
      checkInDateTime:
        item.checkInDate && item.checkInTime
          ? dayjs(
              `${item.checkInDate} ${item.checkInTime}`,
              "YYYY-MM-DD HH:mm",
            ).toISOString()
          : null,
      checkOutDateTime:
        item.checkOutDate && item.checkOutTime
          ? dayjs(
              `${item.checkOutDate} ${item.checkOutTime}`,
              "YYYY-MM-DD HH:mm",
            ).toISOString()
          : null,
    }));

    const payload = {
      schedulePreventiveTask: {
        id:
          schedulePreventiveTaskAssignUser?.schedulePreventiveTask?.id ||
          schedulePreventiveTaskAssignUser?.schedulePreventiveTask?._id,
        downtimeHr: values.downtimeHr || 0,
        downtimeMin: values.downtimeMin || 0,
        comment: values.comment || "",
      },
      taskItems,
      checkInOutList,
      user:
        schedulePreventiveTaskAssignUser?.user?.id ||
        schedulePreventiveTaskAssignUser?.user?._id,
    };

    const res =
      await _unitOfWork.schedulePreventive.schedulePreventiveCheckInOut(
        payload,
      );
    if (res && res.code === 1) {
      navigate(-1);
      ShowSuccess(
        "topRight",
        t("common.notifications"),
        t("myTask.checkin.messages.complete_task"),
      );
    } else {
      ShowError(
        "topRight",
        t("common.notifications"),
        t("myTask.checkin.messages.incomplete_task"),
      );
    }
  };

  const handleChange = (field, value, idx) => {
    const newItems = [...taskItemCheckInCheckOuts];
    newItems[idx][field] = value;
    setTaskItemCheckInCheckOuts(newItems);
  };
  const handleAdd = () => {
    setTaskItemCheckInCheckOuts([
      ...taskItemCheckInCheckOuts,
      { key: Date.now(), checkInDate: "", checkOutDate: "" },
    ]);
  };

  const handleDelete = (idx) => {
    setTaskItemCheckInCheckOuts(
      taskItemCheckInCheckOuts.filter((_, i) => i !== idx),
    );
  };

  const columns = [
    {
      title: t("myTask.checkin.table.index"),
      dataIndex: "stt",
      width: 60,
      align: "center",
      render: (_text, _record, idx) => idx + 1,
    },
    {
      title: t("myTask.checkin.table.check_in_time"),
      dataIndex: "checkInDate",
      render: (_text, record, idx) => (
        <Row gutter={8}>
          <Col span={12}>
            <DatePicker
              style={{ width: "100%" }}
              value={record.checkInDate ? dayjs(record.checkInDate) : null}
              format="DD/MM/YYYY"
              onChange={(date) => {
                const dateStr = date ? date.format("YYYY-MM-DD") : "";
                handleChange("checkInDate", dateStr, idx);
              }}
              placeholder={t("myTask.checkin.table.check_in_date")}
            />
          </Col>
          <Col span={12}>
            <TimeInput
              style={{ width: "100%" }}
              value={
                record.checkInTime ? dayjs(record.checkInTime, "HH:mm") : null
              }
              format="HH:mm"
              onChange={(time) => {
                const timeStr = time ? time.format("HH:mm") : "";
                handleChange("checkInTime", timeStr, idx);
              }}
              placeholder={t("myTask.checkin.table.check_in_hh")}
            />
          </Col>
        </Row>
      ),
    },
    {
      title: t("myTask.checkin.table.check_out_time"),
      dataIndex: "checkOutDate",
      render: (_text, record, idx) => (
        <Row gutter={8}>
          <Col span={12}>
            <DatePicker
              style={{ width: "100%" }}
              value={record.checkOutDate ? dayjs(record.checkOutDate) : null}
              format="DD/MM/YYYY"
              onChange={(date) => {
                const dateStr = date ? date.format("YYYY-MM-DD") : "";
                handleChange("checkOutDate", dateStr, idx);
              }}
              placeholder={t("myTask.checkin.table.check_out_date")}
            />
          </Col>
          <Col span={12}>
            <TimeInput
              style={{ width: "100%" }}
              value={
                record.checkOutTime ? dayjs(record.checkOutTime, "HH:mm") : null
              }
              format="HH:mm"
              onChange={(time) => {
                const timeStr = time ? time.format("HH:mm") : "";
                handleChange("checkOutTime", timeStr, idx);
              }}
              placeholder={t("myTask.checkin.table.check_out_hh")}
            />
          </Col>
        </Row>
      ),
    },
    {
      title: t("myTask.checkin.table.action"),
      dataIndex: "action",
      width: 100,
      align: "center",
      render: (_text, _record, idx) => (
        <Tooltip title={t("myTask.checkin.table.delete_tooltip")}>
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(idx)}
          />
        </Tooltip>
      ),
    },
  ];
  return (
    <Card style={{ padding: 0 }}>
      <Tabs
        defaultActiveKey="asset"
        style={{
          marginBottom: 24,
          background: "#fff",
          borderRadius: 8,
          padding: "0 16px",
        }}
        items={[
          {
            key: "asset",
            label: t("myTask.checkin.tabs.asset"),
            children: (
              <AssetDetailTab
                assetMaintenance={
                  schedulePreventiveTaskAssignUser?.schedulePreventive
                    ?.assetMaintenance
                }
              />
            ),
          },
          {
            key: "task",
            label: t("myTask.checkin.tabs.task"),
            children: <TaskDetails data={schedulePreventiveTaskAssignUser} />,
          },
          {
            key: "address",
            label: t("myTask.checkin.tabs.address"),
            children: (
              <AddressDetails data={schedulePreventiveTaskAssignUser} />
            ),
          },
        ]}
      />

      <Form labelWrap form={form} layout="vertical" onFinish={handleFinish}>
        <Row gutter={16} className="ml-3 mr-3 mb-3">
          <Col span={24} className="mb-4" style={{ textAlign: "end" }}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAdd}
              className="mb-2"
            >
              {t("myTask.checkin.buttons.add_check_in_out")}
            </Button>
            <Table
              columns={columns}
              dataSource={taskItemCheckInCheckOuts}
              className="custom-table wp-100"
              pagination={false}
            ></Table>
          </Col>
        </Row>
        {schedulePreventiveTaskItems?.map((taskItem, taskItemIdx) => (
          <div
            key={taskItemIdx}
            style={{
              border: "1px solid #d9d9d9",
              padding: 16,
              marginBottom: "10px",
              borderRadius: "8px",
            }}
            className="ml-3 mr-3 mb-4"
          >
            <div style={{ fontWeight: 500 }}>
              <span style={{ fontWeight: "600" }}>
                {t("myTask.checkin.fields.task_prefix")} {taskItemIdx + 1} :
              </span>{" "}
              {taskItem?.taskItemDescription}
            </div>
            <Row gutter={16}>
              <Col span={8}>
                {((taskItem?.schedulePreventiveTask?.taskType ===
                  ServiceTaskType.inspection &&
                  (taskItem?.answerTypeInspection ===
                    answerTypeInspection.numbericValue ||
                    taskItem?.answerTypeInspection ===
                      answerTypeInspection.value)) ||
                  taskItem?.schedulePreventiveTask?.taskType ===
                    ServiceTaskType.monitoring) && (
                  <Form.Item
                    label={t("myTask.checkin.fields.value")}
                    name={["taskItems", taskItemIdx, "value"]}
                    rules={[
                      {
                        required: true,
                        message: t("myTask.checkin.validation.value_required"),
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                )}
                {taskItem?.answerTypeInspection ===
                  answerTypeInspection.yesNoNa && (
                  <Form.Item
                    label={t("myTask.checkin.fields.value")}
                    name={["taskItems", taskItemIdx, "status"]}
                    rules={[
                      {
                        required: true,
                        message: t("myTask.checkin.validation.value_required"),
                      },
                    ]}
                  >
                    <Radio.Group>
                      <Radio value="yes">Yes</Radio>
                      <Radio value="no">No</Radio>
                      <Radio value="na">N/A</Radio>
                    </Radio.Group>
                  </Form.Item>
                )}
                {taskItem?.schedulePreventiveTask?.taskType ===
                  ServiceTaskType.calibration && (
                  <>
                    <Form.Item
                      label={t("myTask.checkin.fields.value")}
                      name=""
                      initialValue={taskItem.value1}
                      rules={[
                        {
                          required: true,
                          message: t(
                            "myTask.checkin.validation.value_required",
                          ),
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      label={t("myTask.checkin.fields.work_level")}
                      name={["taskItems", taskItemIdx, "status"]}
                      rules={[
                        {
                          required: true,
                          message: t(
                            "myTask.checkin.validation.value_required",
                          ),
                        },
                      ]}
                    >
                      <Radio.Group>
                        <Radio value="done">Đã xong</Radio>
                        <Radio value="not-done">Không hoàn thành</Radio>
                      </Radio.Group>
                    </Form.Item>
                  </>
                )}
              </Col>
              <Col span={4}>
                <Form.Item
                  label={t("myTask.checkin.fields.problem_switch")}
                  name={["taskItems", taskItemIdx, "isProblem"]}
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item
                  label={t("myTask.checkin.fields.attachment")}
                  name={["taskItems", taskItemIdx, "file"]}
                  valuePropName="fileList"
                  getValueFromEvent={(e) => e && e.fileList}
                >
                  <Upload
                    name="file"
                    listType="text"
                    maxCount={1}
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                    showUploadList={{
                      showPreviewIcon: true,
                      showRemoveIcon: true,
                    }}
                    beforeUpload={(file) => {
                      const isLt5M = file.size / 1024 / 1024 < 5;
                      if (!isLt5M) {
                        message.error(
                          t("myTask.checkin.messages.upload_size_error"),
                        );
                      }
                      return isLt5M ? false : Upload.LIST_IGNORE;
                    }}
                  >
                    <Button icon={<UploadOutlined />}>
                      {t("myTask.checkin.buttons.upload_file")}
                    </Button>
                  </Upload>
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  label={t("myTask.checkin.fields.comment")}
                  name={["taskItems", taskItemIdx, "comment"]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  shouldUpdate={(prev, curr) =>
                    prev?.taskItems?.[taskItemIdx]?.isProblem !==
                    curr?.taskItems?.[taskItemIdx]?.isProblem
                  }
                  noStyle
                >
                  {({ getFieldValue }) =>
                    getFieldValue(["taskItems", taskItemIdx, "isProblem"]) ? (
                      <Form.Item
                        label={
                          <span style={{ color: "red" }}>
                            {t("myTask.checkin.fields.problem_description")}
                          </span>
                        }
                        name={["taskItems", taskItemIdx, "problemComment"]}
                        rules={[
                          {
                            required: true,
                            message: t(
                              "myTask.checkin.validation.problem_required",
                            ),
                          },
                        ]}
                      >
                        <Input.TextArea
                          placeholder={t(
                            "myTask.checkin.fields.problem_description_placeholder",
                          )}
                        />
                      </Form.Item>
                    ) : null
                  }
                </Form.Item>
              </Col>
            </Row>
          </div>
        ))}
        <Card
          style={{
            marginBottom: 24,
            borderRadius: 8,
            boxShadow: "0 2px 8px #f0f1f2",
          }}
          bodyStyle={{ padding: 24, background: "#fff" }}
        >
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item
                label={t("myTask.checkin.fields.downtime_hour")}
                name="downtimeHr"
                initialValue={0}
              >
                <Input type="number" min={0} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label={t("myTask.checkin.fields.downtime_minute")}
                name="downtimeMin"
                initialValue={0}
              >
                <Input type="number" min={0} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t("myTask.checkin.fields.comment")}
                name="comment"
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </Card>
        <Row justify="end" gutter={16} className="mb-3 ml-3 mr-3">
          <Col>
            <Button onClick={() => navigate(-1)}>
              <LeftOutlined />
              {t("myTask.checkin.buttons.back")}
            </Button>
          </Col>
          <Col>
            <Button type="primary" htmlType="submit">
              <SaveOutlined />
              {t("myTask.checkin.buttons.save")}
            </Button>
          </Col>
        </Row>
      </Form>
    </Card>
  );
}
