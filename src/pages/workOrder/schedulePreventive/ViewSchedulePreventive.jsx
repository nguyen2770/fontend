import React, { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Button,
  Table,
  Space,
  Tag,
  Tooltip,
  Form,
  Input,
  Radio,
  Collapse,
  Tabs,
  Divider,
  Timeline,
} from "antd";
import {
  FileOutlined,
  UserOutlined,
  CalendarOutlined,
  ArrowLeftOutlined,
  CheckCircleFilled,
  EyeOutlined,
  CheckCircleTwoTone,
} from "@ant-design/icons";
import { data, useNavigate, useParams } from "react-router-dom";
import * as _unitOfWork from "../../../api";
import { parseDateHH } from "../../../helper/date-helper";
import { parseToLabel } from "../../../helper/parse-helper";
import {
  answerTypeInspection,
  assetType,
  frequencyAllOptions,
  historySchedulePreventiveStatus,
  priorityType,
  schedulePreventiveStatus,
  schedulePreventiveTaskAssignUserStatus,
  ServiceTaskType,
  schedulePreventiveTaskRequestSparePartStatus,
} from "../../../utils/constant";
import { useTranslation } from "react-i18next";
import ViewRequestSparePartDetails from "./ViewRequestSparePartDetails";
import { staticPath } from "../../../router/routerConfig";
import AssetModelDocument from "../../manager/assetSetup/assetModel/assetModelDocument";
import TabsSchedulePreventiveDocuments from "./TabsSchedulePreventiveDocuments";
import "./index.scss";
const { Text } = Typography;
const { Panel } = Collapse;

export default function ViewSchedulePreventive() {
  const { t } = useTranslation();
  const params = useParams();
  const [schedulePreventive, setSchedulePreventive] = useState(null);
  const [schedulePreventiveHistorys, setSchedulePreventiveHistorys] = useState(
    [],
  );
  const [requestSpareParts, setRequestSpareParts] = useState([]);
  const [requestSparePart, setRequestSparePart] = useState("");
  const [showRequestSparePartDetail, setShowRequestSparePartDetail] =
    useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchGetSchedulePreventive();
  }, [params.id]);

  const fetchGetSchedulePreventive = async () => {
    const res = await _unitOfWork.schedulePreventive.getSchedulePreventiveById({
      id: params.id,
    });
    if (res && res.code === 1) {
      setSchedulePreventive(res.data);
      setSchedulePreventiveHistorys(res.schedulePreventiveHistorys || []);
      setRequestSpareParts(res?.schedulePreventiveRequestSpareParts);
    }
  };
  const onShowDetail = (record) => {
    setShowRequestSparePartDetail(true);
    setRequestSparePart(record);
  };
  const files = [];
  const labelStyle = { fontWeight: 500, minWidth: 120, display: "block" };
  const valueStyle = {
    marginLeft: 0,
    display: "block",
    marginBottom: 8,
    fontWeight: 600,
  };
  const sectionStyle = {
    background: "#F3FDFF",
    padding: "8px 12px",
    fontWeight: 600,
    margin: "18px 0 8px 0",
    borderRadius: 4,
  };

  const renderScheduleInfo = () => (
    <Card style={{ marginBottom: 24 }}>
      {/* Header */}
      <div>
        <div style={sectionStyle}>
          {t("preventiveSchedule.schedule_preventive_info")}
        </div>
        <Row gutter={32} style={{ marginBottom: 20 }}>
          <Col span={8}>
            <span style={labelStyle}>
              {t("preventiveSchedule.fields.plan_code")}
            </span>
            <span style={valueStyle}>{schedulePreventive?.code}</span>
          </Col>
          <Col span={8}>
            <span style={labelStyle}>
              {t("preventiveSchedule.fields.plan_name")}
            </span>
            <span style={valueStyle}>
              {schedulePreventive?.preventive?.preventiveName}
            </span>
          </Col>
          <Col span={8}>
            <span style={labelStyle}>
              {t("preventiveSchedule.fields.start_date")}
            </span>
            <span style={valueStyle}>
              {parseDateHH(schedulePreventive?.startDate)}
            </span>
          </Col>
          <Col span={8}>
            <span style={labelStyle}>
              {t("preventiveSchedule.fields.status")}
            </span>
            <span
              style={{
                ...valueStyle,
                color: schedulePreventiveStatus.Options.find(
                  (x) => x.value === schedulePreventive?.status,
                )?.color,
              }}
            >
              {t(
                parseToLabel(
                  schedulePreventiveStatus.Options,
                  schedulePreventive?.status,
                ),
              )}
            </span>
          </Col>
          <Col span={8}>
            <span style={labelStyle}>
              {t("preventiveSchedule.fields.priority")}
            </span>
            <span style={valueStyle}>
              {t(
                parseToLabel(
                  priorityType.Option,
                  schedulePreventive?.importance,
                ),
              )}
            </span>
          </Col>
          <Col span={8}>
            <span style={labelStyle}>
              {t("preventiveSchedule.execution_time")}
            </span>
            <span style={valueStyle}>
              {schedulePreventive?.maintenanceDurationHr +
                " : " +
                schedulePreventive?.maintenanceDurationMin}
            </span>
          </Col>
          {schedulePreventive?.closingDate && (
            <Col span={8}>
              <span style={labelStyle}>
                {t("preventiveSchedule.close_date")}
              </span>
              <span style={valueStyle}>
                {parseDateHH(schedulePreventive?.closingDate)}
              </span>
            </Col>
          )}
          {schedulePreventive?.cancelDate && (
            <Col span={8}>
              <span style={labelStyle}>
                {t("preventiveSchedule.cancle_date")}
              </span>
              <span style={valueStyle}>
                {parseDateHH(schedulePreventive?.cancelDate)}
              </span>
            </Col>
          )}
        </Row>
        <div style={sectionStyle}>
          {t("breakdown.viewTabs.general.sections.asset")}
        </div>
        <Row gutter={32} style={{ marginBottom: 20 }}>
          <Col span={8}>
            <span style={labelStyle}>
              {t("breakdown.viewTabs.general.fields.manufacturer")}
            </span>
            <span style={valueStyle}>
              {schedulePreventive?.preventive?.assetMaintenance?.assetModel
                ?.manufacturer?.manufacturerName || "--"}
            </span>
          </Col>
          <Col span={8}>
            <span style={labelStyle}>
              {t("breakdown.viewTabs.general.fields.category")}
            </span>
            <span style={valueStyle}>
              {schedulePreventive?.preventive?.assetMaintenance?.assetModel
                ?.category?.categoryName || "--"}
            </span>
          </Col>
          <Col span={8}>
            <span style={labelStyle}>
              {t("breakdown.viewTabs.general.fields.type")}
            </span>
            <div style={valueStyle}>
              {schedulePreventive?.preventive?.assetMaintenance?.assetModel
                ?.assetTypeCategory?.name || "--"}
            </div>
          </Col>

          <Col span={8}>
            <span style={labelStyle}>
              {t("breakdown.viewTabs.general.fields.asset_style")}
            </span>
            <span style={valueStyle}>
              {t(
                assetType.Options.find(
                  (item) =>
                    item.value ===
                    schedulePreventive?.preventive?.assetMaintenance
                      ?.assetStyle,
                )?.label || "",
              )}
            </span>
          </Col>
          <Col span={8}>
            <span style={labelStyle}>
              {t("breakdown.viewTabs.general.fields.asset_name")}
            </span>
            <span style={valueStyle}>
              {schedulePreventive?.preventive?.assetMaintenance?.assetModel
                ?.asset?.assetName || "--"}
            </span>
          </Col>
          <Col span={8}>
            <span style={labelStyle}>
              {t("breakdown.viewTabs.general.fields.model")}
            </span>
            <span style={valueStyle}>
              {schedulePreventive?.preventive?.assetMaintenance?.assetModel
                ?.assetModelName || "--"}
            </span>
          </Col>
          <Col span={8}>
            <span style={labelStyle}>{t("assetMaintenance.asset_number")}</span>
            <span style={valueStyle}>
              {schedulePreventive?.preventive?.assetMaintenance?.assetNumber ||
                "--"}
            </span>
          </Col>
          <Col span={8}>
            <span style={labelStyle}>
              {t("breakdown.viewTabs.general.fields.serial")}
            </span>
            <span style={valueStyle}>
              {schedulePreventive?.preventive?.assetMaintenance?.serial || "--"}
            </span>
          </Col>
          <Col span={8}>
            <span style={labelStyle}>
              {t("breakdown.viewTabs.general.fields.defect")}
            </span>
            <span style={valueStyle}>
              {schedulePreventive?.preventive?.breakdownDefect?.name || "--"}
            </span>
          </Col>
        </Row>

        <div style={sectionStyle}>
          {t("breakdown.viewTabs.general.sections.customer")}
        </div>
        <Row gutter={32} style={{ marginBottom: 20 }}>
          <Col span={8}>
            <span style={labelStyle}>
              {t("breakdown.viewTabs.general.fields.customer_name")}
            </span>
            <span style={valueStyle}>
              {schedulePreventive?.preventive?.assetMaintenance?.customer
                ?.customerName || "--"}
            </span>
          </Col>
          <Col span={8}>
            <span style={labelStyle}>
              {t("breakdown.viewTabs.general.fields.customer_location")}
            </span>
            <span style={valueStyle}>
              {schedulePreventive?.preventive?.assetMaintenance?.customer
                ?.addressOne || "--"}
            </span>
          </Col>
          <Col span={8}>
            <span style={labelStyle}>
              {t("breakdown.viewTabs.general.fields.opened_by")}
            </span>
            <span style={valueStyle}>
              {schedulePreventive?.preventive?.createdBy?.fullName || "--"}
            </span>
          </Col>
          <Col span={8}>
            <span style={labelStyle}>
              {t("breakdown.viewTabs.general.fields.email")}
            </span>
            <span style={valueStyle}>
              {schedulePreventive?.preventive?.assetMaintenance?.customer
                ?.contactEmail || "--"}
            </span>
          </Col>
          <Col span={8}>
            <span style={labelStyle}>
              {t("breakdown.viewTabs.general.fields.contact_number")}
            </span>
            <span style={valueStyle}>
              {schedulePreventive?.preventive?.assetMaintenance?.customer
                ?.contactNumber || "--"}
            </span>
          </Col>
        </Row>
      </div>
    </Card>
  );

  const renderSparePartInfo = () => (
    <Card>
      <Table
        columns={[
          {
            title: t("preventiveSchedule.list.table.request_status"),
            dataIndex: "requestStatus",
            key: "requestStatus",
            align: "center",
            render: (text) =>
              t(
                parseToLabel(
                  schedulePreventiveTaskRequestSparePartStatus.Options,
                  text,
                ),
              ),
          },
          {
            title: t("preventiveSchedule.list.table.request_sender"),
            dataIndex: "createdBy",
            key: "createdBy",
            render: (text) => <>{text?.fullName}</>,
          },
          {
            title: t("preventiveSchedule.list.table.date_of_request"),
            dataIndex: "createdAt",
            key: "createdAt",
            align: "center",
            render: (text) => parseDateHH(text),
          },
          {
            title: t("preventiveSchedule.list.table.receiver"),
            dataIndex: "holder",
            key: "holder",
            render: (text) => <>{text?.fullName}</>,
          },
          {
            title: t("preventiveSchedule.list.table.date_sent_sending_confirm"),
            dataIndex: "assignUserDate",
            key: "assignUserDate",
            align: "center",
            render: (text) => parseDateHH(text),
          },
          {
            title: t("preventiveSchedule.list.table.spare_parts"),
            dataIndex: "sparePart",
            key: "sparePart",
            align: "center",
            render: (text, record) => (
              <>
                {record?.scheduleePreventiveRequestSparePartDetails
                  ?.map((item) => item?.sparePart?.sparePartsName)
                  .filter(Boolean) // loại bỏ giá trị null/undefined nếu có
                  .join(", ")}
              </>
            ),
          },
          {
            title: t("preventiveSchedule.list.table.action"),
            dataIndex: "action",
            align: "center",
            fixed: "right",
            render: (_, record) => (
              <div>
                <Button
                  type="primary"
                  icon={<EyeOutlined />}
                  size="small"
                  onClick={() => onShowDetail(record)}
                  className="ml-2"
                />
              </div>
            ),
          },
        ]}
        dataSource={requestSpareParts}
        pagination={false}
        rowKey={(r, i) => i}
        locale={{
          emptyText: (
            <span style={{ color: "red" }}>
              {t("preventiveSchedule.list.table.no_spare")}
            </span>
          ),
        }}
        bordered
      />
    </Card>
  );
  const getStatusOption = (status) =>
    schedulePreventiveTaskAssignUserStatus.Options.find(
      (x) => x.value === status,
    );

  return (
    <div style={{ padding: 24, background: "#ffffff" }}>
      <div style={{ textAlign: "end" }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
          {t("preventiveSchedule.view.back")}
        </Button>
      </div>
      <Divider />
      <Row gutter={[16, 16]}>
        <Col span={6} className="history-wrapper pl-3">
          <Timeline className="mt-2">
            {schedulePreventiveHistorys?.map((item, idx) => (
              <Timeline.Item
                key={idx}
                dot={
                  <CheckCircleTwoTone
                    twoToneColor="#52c41a"
                    style={{ fontSize: 24 }}
                  />
                }
                style={{ marginBottom: 10 }}
              >
                <Card className="history-card">
                  <Row>
                    <Col span={24}>
                      {item?.schedulePreventiveTask ? (
                        <Text strong>
                          {t(
                            "preventiveSchedule.view.labels.history_task_name",
                          )}{" "}
                          :{item?.schedulePreventiveTask?.taskName}
                        </Text>
                      ) : (
                        <Text strong>
                          {t(
                            "preventiveSchedule.view.labels.history_schedule_name",
                          )}{" "}
                          :
                          {item?.schedulePreventive?.preventive?.preventiveName}
                        </Text>
                      )}
                    </Col>

                    <Col span={24}>
                      <CalendarOutlined /> {parseDateHH(item?.createdAt)}
                    </Col>

                    <Col span={24}>
                      <Text strong>
                        {t("preventiveSchedule.view.labels.history_status")}:
                      </Text>{" "}
                      {t(
                        parseToLabel(
                          historySchedulePreventiveStatus.Options,
                          item?.status,
                        ),
                      )}
                    </Col>

                    {item?.createdBy && (
                      <Col span={24}>
                        <Text strong>
                          {t(
                            "preventiveSchedule.view.labels.history_assigned_by",
                          )}{" "}
                          :
                        </Text>{" "}
                        {item?.createdBy?.fullName}
                      </Col>
                    )}

                    {item?.assignedTo && (
                      <Col span={24}>
                        <Text strong>
                          {t(
                            "preventiveSchedule.view.labels.history_assigned_to",
                          )}{" "}
                          :
                        </Text>{" "}
                        {item?.assignedTo?.fullName}
                      </Col>
                    )}
                    {item?.comments && (
                      <Col span={24}>
                        <Text strong>{t("propertyInspection.note")} :</Text> {item?.comments}
                      </Col>
                    )}
                  </Row>
                </Card>
              </Timeline.Item>
            ))}
          </Timeline>
        </Col>
        <Col span={13}>
          <Tabs
            defaultActiveKey="1"
            items={[
              {
                key: "1",
                label: t(
                  "preventiveSchedule.detail.title_tabs_maintenance_schedule_information",
                ),
                children: renderScheduleInfo(),
              },
              {
                key: "2",
                label: t(
                  "preventiveSchedule.detail.title_tabs_spare_part_information",
                ),
                children: renderSparePartInfo(),
              },
              {
                key: "3",
                label: t(
                  "schedulePreventiveTask.equipment_technical_documentation",
                ),
                children: (
                  <AssetModelDocument
                    assetModel={
                      schedulePreventive?.preventive?.assetMaintenance
                        ?.assetModel
                    }
                    notButtonCreateDocuemnt={false}
                    notButtonUpdateDocument={false}
                    notButtonDeleteDocument={false}
                  />
                ),
              },
              {
                key: "4",
                label: t("preventiveSchedule.maintenance_work_documentation"),
                children: (
                  <TabsSchedulePreventiveDocuments
                    schedulePreventiveId={
                      schedulePreventive?._id || schedulePreventive?.id
                    }
                  />
                ),
              },
            ]}
          />
        </Col>
        <Col span={5}>
          {/* Tasks */}
          <div style={{ marginTop: 16, marginBottom: 24 }}>
            <Collapse accordion>
              {schedulePreventive?.tasks?.map((task, idx) => (
                <Panel
                  header={
                    <Space className="task-header">
                      <Row className="task-header-row">
                        <Col span={24} className="task-title">
                          <Tooltip
                            title={t("preventiveSchedule.service_task_type")}
                          >
                            <span style={{ font: "13px" }}>
                              {t(
                                parseToLabel(
                                  ServiceTaskType.Options,
                                  task?.taskType,
                                ),
                              )}
                            </span>
                          </Tooltip>
                          <Tooltip
                            title={t(
                              "preventiveSchedule.view.labels.task_name",
                            )}
                          >
                            <Text strong className="task-name">
                              {task?.taskName}
                            </Text>
                          </Tooltip>
                        </Col>
                        <Col span={24} className="task-user">
                          <span className="task-user-name">
                            {task?.schedulePreventiveTaskAssignUserIsActive
                              ?.user && <UserOutlined className="mr-1" />}
                            {
                              task?.schedulePreventiveTaskAssignUserIsActive
                                ?.user?.fullName
                            }
                          </span>
                          {task?.schedulePreventiveTaskAssignUserIsActive
                            ?.status && " - "}
                          {(() => {
                            const option =
                              schedulePreventiveTaskAssignUserStatus.Options.find(
                                (opt) =>
                                  opt.value ===
                                  task?.schedulePreventiveTaskAssignUserIsActive
                                    ?.status,
                              );

                            const barColor = option?.color || "#ff4d4f";

                            return (
                              <span
                                className="priority-number"
                                style={{ color: barColor }}
                              >
                                {t(option?.label)}
                              </span>
                            );
                          })()}
                        </Col>
                      </Row>
                    </Space>
                  }
                  key={idx}
                >
                  {task?.taskItems?.map((taskItem, taskItemIdx) => (
                    <Card className="mb-2 mt-2" key={taskItemIdx}>
                      <div>
                        {taskItemIdx + 1}. {taskItem?.taskItemDescription}
                      </div>
                      <div>
                        <Col span={8}>
                          {((task.taskType === ServiceTaskType.inspection &&
                            (taskItem?.answerTypeInspection ===
                              answerTypeInspection.numbericValue ||
                              taskItem?.answerTypeInspection ===
                                answerTypeInspection.value)) ||
                            task.taskType === ServiceTaskType.monitoring) && (
                            <Form.Item
                              label={t("preventiveSchedule.view.labels.value")}
                            >
                              {taskItem?.value}
                            </Form.Item>
                          )}
                          {task.taskType === ServiceTaskType.inspection &&
                            taskItem.answerTypeInspection ===
                              answerTypeInspection.yesNoNa && (
                              <Form.Item
                                label={t(
                                  "preventiveSchedule.view.labels.value",
                                )}
                              >
                                <Radio.Group disabled value={taskItem?.status}>
                                  <Radio value="yes">Yes</Radio>
                                  <Radio value="no">No</Radio>
                                  <Radio value="na">N/A</Radio>
                                </Radio.Group>
                              </Form.Item>
                            )}
                          {task?.taskType === ServiceTaskType.calibration && (
                            <>
                              <Form.Item
                                label={t(
                                  "preventiveSchedule.view.labels.value",
                                )}
                              >
                                {taskItem.value1}
                              </Form.Item>
                              <Form.Item
                                label={t(
                                  "preventiveSchedule.view.labels.work_level",
                                )}
                              >
                                <Radio.Group disabled value={taskItem?.status}>
                                  <Radio value="done">
                                    {t("preventiveSchedule.view.labels.done")}
                                  </Radio>
                                  <Radio value="not-done">
                                    {t(
                                      "preventiveSchedule.view.labels.not_done",
                                    )}
                                  </Radio>
                                </Radio.Group>
                              </Form.Item>
                            </>
                          )}
                        </Col>
                        {taskItem?.comment && (
                          <Col span={24}>
                            <Form.Item
                              label={t(
                                "preventiveSchedule.view.labels.comment",
                              )}
                            >
                              {taskItem?.comment}
                            </Form.Item>
                          </Col>
                        )}
                        {taskItem?.breakdown && (
                          <Col span={24}>
                            <Form.Item
                              label={t(
                                "preventiveSchedule.view.labels.breakdown",
                              )}
                            >
                              {taskItem?.breakdown?.code}
                            </Form.Item>
                          </Col>
                        )}
                      </div>
                    </Card>
                  ))}
                </Panel>
              ))}
            </Collapse>
          </div>
        </Col>
      </Row>

      <ViewRequestSparePartDetails
        open={showRequestSparePartDetail}
        onClose={() => setShowRequestSparePartDetail(false)}
        schedulePreventiveTaskRequestSparepart={requestSparePart}
      />
    </div>
  );
}
