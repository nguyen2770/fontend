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
  PlusCircleOutlined,
  CloseCircleFilled,
  CheckCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import * as _unitOfWork from "../../../api";
import { useNavigate, useParams } from "react-router-dom";
import CalibrationWorkDetail from "./CalibrationWorkDetail";
import ShowSuccess from "../../../components/modal/result/successNotification";
import ShowError from "../../../components/modal/result/errorNotification";
import { useTranslation } from "react-i18next";
import AssetDetailTab from "../myTask/AssetDetails";
import AttachmentModel from "../../../components/modal/attachmentModel/AttachmentModel";
import TimeInput from "../../../components/common/TimeInput";
import { baseURL } from "../../../api/config";
import { socket } from "../../../socket"
import OneQAModal from "../../../components/modal/OneQAModal";
import { loadLanguages } from "i18next";

export default function CalibratedComfirm() {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const params = useParams();
  const [calibrationAssignUser, setCalibrationAssignUser] = useState([]);
  const [taskItemCheckInCheckOuts, setTaskItemCheckInCheckOuts] = useState([
    { key: 1, checkInDate: "", checkOutDate: "" },
  ]);
  const [fileList, setFileList] = useState([]);
  const navigate = useNavigate();
  const [breakdowns, setBreakdowns] = useState("");
  const [isOpenOneQAModal, setIsOpenOneQAModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();


  useEffect(() => { fetchScheduleDetails(); }, []);

  useEffect(() => {


    const workOrderId = calibrationAssignUser?.calibrationWork?.id;

    if (workOrderId) {

      const joinRoom = () => {
        socket.emit("join", workOrderId);
      };

      if (socket.connected) {
        joinRoom();
      } else {
        socket.once("connect", joinRoom);
      }

      // Socket event handler
      const handleOneQACompleted = (data) => {
        setIsOpenOneQAModal(false)
        setLoading(false)
        fetchScheduleDetails();
        form.setFieldsValue({
          isProblem: data.status === "fail" ? true : false
        });

      };

      socket.on("oneqa:completed", handleOneQACompleted);

      // Handle connection errors
      socket.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
      });

      // Cleanup
      return () => {
        console.log("Cleaning up socket listeners for room:", "123");
        socket.off("oneqa:completed", handleOneQACompleted);
        socket.off("connect_error");
      };
    }
  }, [calibrationAssignUser]);

  // useEffect(() => {
  //   if (loading) {
  //     messageApi.open({
  //       key: "oneqa-loading",
  //       type: "loading",
  //       content: "Đang đợi kết quả OneQA...",
  //       duration: 0, // KHÔNG tự tắt
  //     });
  //   } else {
  //     messageApi.destroy("oneqa-loading");
  //   }
  // }, [loading]);


  const calculateDowntime = () => {
    let minCheckIn = null;
    let maxCheckOut = null;
    taskItemCheckInCheckOuts.forEach((item) => {
      if (item.checkInDate && item.checkInTime) {
        const checkIn = dayjs(
          `${item.checkInDate} ${item.checkInTime}`,
          "YYYY-MM-DD HH:mm"
        );
        if (!minCheckIn || checkIn.isBefore(minCheckIn)) {
          minCheckIn = checkIn;
        }
      }
      if (item.checkOutDate && item.checkOutTime) {
        const checkOut = dayjs(
          `${item.checkOutDate} ${item.checkOutTime}`,
          "YYYY-MM-DD HH:mm"
        );
        if (!maxCheckOut || checkOut.isAfter(maxCheckOut)) {
          maxCheckOut = checkOut;
        }
      }
    });
    // Nếu thiếu dữ liệu thì không tính
    if (!minCheckIn || !maxCheckOut || maxCheckOut.isBefore(minCheckIn)) {
      form.setFieldsValue({
        downtimeHr: 0,
        downtimeMin: 0,
      });
      return;
    }
    const totalMinutes = maxCheckOut.diff(minCheckIn, "minute");
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    form.setFieldsValue({
      downtimeHr: hours,
      downtimeMin: minutes,
    });
  };

  const fetchScheduleDetails = async () => {
    let res =
      await _unitOfWork.calibrationWork.getCalibrationWorkAssignUserById(
        params.id
      );
    if (res && res.code === 1) {
      setCalibrationAssignUser(res?.calibrationWorkAssignUser);
      setBreakdowns(res?.breakdowns);
      setTaskItemCheckInCheckOuts(
        res?.checkInOutList?.length
          ? res?.checkInOutList?.map((item, index) => ({
            key: index + 1,
            checkInDate: item.checkInDateTime
              ? dayjs(item.checkInDateTime).format("YYYY-MM-DD")
              : "",
            checkInTime: item.checkInDateTime
              ? dayjs(item.checkInDateTime).format("HH:mm")
              : "",
            checkOutDate: item.checkOutDateTime
              ? dayjs(item.checkOutDateTime).format("YYYY-MM-DD")
              : "",
            checkOutTime: item.checkOutDateTime
              ? dayjs(item.checkOutDateTime).format("HH:mm")
              : "",
          }))
          : [
            {
              key: 1,
              checkInDate: "",
              checkInTime: "",
              checkOutDate: "",
              checkOutTime: "",
            },
          ]
      );
      setFileList(
        res?.listDocuments?.map((doc) => ({
          ...doc,
          id: doc?.id,
          name: doc?.resource?.fileName + doc?.resource?.extension,
          extension: doc?.resource?.extension,
          src: _unitOfWork.resource.getImage(doc?.resource?.id),
          supportDocumentId: doc?.resource?.id,
        }))
      );
      calculateDowntime();
    }
  };

  const oneQA = async () => {
    if (calibrationAssignUser?.calibrationWork?.id) {
      setIsOpenOneQAModal(true)
    }
  }

  const onSave = async () => {
    const values = form.getFieldsValue();
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
        } else {
          newSupportDocuments.push({
            resource: file?.supportDocumentId,
          });
        }
      }
    }
    for (let i = 0; i < taskItemCheckInCheckOuts.length; i++) {
      const item = taskItemCheckInCheckOuts[i];
      if (
        !item.checkOutTime ||
        !item.checkOutDate ||
        !item.checkInTime ||
        !item.checkInDate
      ) {
        message.error(
          t("myTask.checkin.validation.checkin_required_row", { row: i + 1 })
        );
        return;
      }
      const checkInDateTime = dayjs(
        `${item.checkInDate} ${item.checkInTime}`,
        "YYYY-MM-DD HH:mm"
      );
      const checkOutDateTime = dayjs(
        `${item.checkOutDate} ${item.checkOutTime}`,
        "YYYY-MM-DD HH:mm"
      );
      if (
        checkOutDateTime.isBefore(checkInDateTime) ||
        checkOutDateTime.isSame(checkInDateTime)
      ) {
        message.error(
          t("myTask.checkin.validation.checkout_must_after_checkin", {
            row: i + 1,
          })
        );
        return;
      }
    }

    const checkInOutList = taskItemCheckInCheckOuts.map((item) => ({
      checkInDateTime:
        item.checkInDate && item.checkInTime
          ? dayjs(
            `${item.checkInDate} ${item.checkInTime}`,
            "YYYY-MM-DD HH:mm"
          ).toISOString()
          : null,
      checkOutDateTime:
        item.checkOutDate && item.checkOutTime
          ? dayjs(
            `${item.checkOutDate} ${item.checkOutTime}`,
            "YYYY-MM-DD HH:mm"
          ).toISOString()
          : null,
    }));

    const payload = {
      ...values,
      checkInOutList,
      calibrationWorkAssignUser: params.id,
      newSupportDocuments,
    };
    const res = await _unitOfWork.calibrationWork.updateCalibratedComfirm(
      payload
    );
    if (res && res.code === 1) {
      navigate(-1);
      ShowSuccess(
        "topRight",
        t("common.notifications"),
        t("common.messages.success.successfully")
      );
    } else {
      ShowError(
        "topRight",
        t("common.notifications"),
        t("common.messages.errors.failed")
      );
    }
  };

  const handleFinish = async () => {
    const values = form.getFieldsValue();
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
        } else {
          newSupportDocuments.push({
            resource: file?.supportDocumentId,
          });
        }
      }
    }
    for (let i = 0; i < taskItemCheckInCheckOuts.length; i++) {
      const item = taskItemCheckInCheckOuts[i];
      if (
        !item.checkOutTime ||
        !item.checkOutDate ||
        !item.checkInTime ||
        !item.checkInDate
      ) {
        message.error(
          t("myTask.checkin.validation.checkin_required_row", { row: i + 1 })
        );
        return;
      }
      const checkInDateTime = dayjs(
        `${item.checkInDate} ${item.checkInTime}`,
        "YYYY-MM-DD HH:mm"
      );
      const checkOutDateTime = dayjs(
        `${item.checkOutDate} ${item.checkOutTime}`,
        "YYYY-MM-DD HH:mm"
      );
      if (
        checkOutDateTime.isBefore(checkInDateTime) ||
        checkOutDateTime.isSame(checkInDateTime)
      ) {
        message.error(
          t("myTask.checkin.validation.checkout_must_after_checkin", {
            row: i + 1,
          })
        );
        return;
      }
    }

    const checkInOutList = taskItemCheckInCheckOuts.map((item) => ({
      checkInDateTime:
        item.checkInDate && item.checkInTime
          ? dayjs(
            `${item.checkInDate} ${item.checkInTime}`,
            "YYYY-MM-DD HH:mm"
          ).toISOString()
          : null,
      checkOutDateTime:
        item.checkOutDate && item.checkOutTime
          ? dayjs(
            `${item.checkOutDate} ${item.checkOutTime}`,
            "YYYY-MM-DD HH:mm"
          ).toISOString()
          : null,
    }));

    const payload = {
      ...values,
      checkInOutList,
      calibrationWorkAssignUser: params.id,
      newSupportDocuments,
    };
    const res = await _unitOfWork.calibrationWork.calibratedComfirm(payload);
    if (res && res.code === 1) {
      navigate(-1);
      ShowSuccess(
        "topRight",
        t("common.notifications"),
        t("common.messages.success.successfully")
      );
    } else {
      ShowError(
        "topRight",
        t("common.notifications"),
        t("common.messages.errors.failed")
      );
    }
  };

  const handleChange = (field, value, idx) => {
    const newItems = [...taskItemCheckInCheckOuts];
    newItems[idx][field] = value;
    setTaskItemCheckInCheckOuts(newItems);
    calculateDowntime();
  };
  const handleAdd = () => {
    setTaskItemCheckInCheckOuts([
      ...taskItemCheckInCheckOuts,
      { key: Date.now(), checkInDate: "", checkOutDate: "" },
    ]);
    calculateDowntime();
  };

  const handleDelete = (idx) => {
    setTaskItemCheckInCheckOuts(
      taskItemCheckInCheckOuts.filter((_, i) => i !== idx)
    );
    calculateDowntime();
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
      title: t("myTask.checkin.table.check_in_date"),
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
            {/* <TimePicker
              style={{ width: "100%" }}
              value={
                record.checkInTime ? dayjs(record.checkInTime, "HH:mm") : null
              }
              format="HH:mm"
              onChange={(time) => {
                const timeStr = time ? time.format("HH:mm") : "";
                handleChange("checkInTime", timeStr, idx);
              }}
              placeholder="Check In Time"
            /> */}

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
              placeholder="Check In Time"
            />
          </Col>
        </Row>
      ),
    },
    {
      title: t("myTask.checkin.table.check_out_date"),
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
              placeholder="Check Out Time"
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
      {contextHolder}
      <Tabs
        defaultActiveKey="calibrationWork"
        style={{
          marginBottom: 24,
          background: "#fff",
          borderRadius: 8,
          padding: "0 16px",
        }}
        items={[
          {
            key: "calibrationWork",
            label: t("menu.maintenance_request.view_calibration_task"),
            children: (
              <CalibrationWorkDetail
                data={calibrationAssignUser}
                breakdowns={breakdowns}
              />
            ),
          },
          {
            key: "asset",
            label: t("myTask.checkin.tabs.asset"),
            children: (
              <AssetDetailTab
                assetMaintenance={
                  calibrationAssignUser?.calibrationWork?.assetMaintenance
                }
              />
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
          <Col span={24}>
            <AttachmentModel
              value={fileList}
              onChange={setFileList}
              notSize={true}
            />
          </Col>
        </Row>

        <Card
          style={{
            marginBottom: 24,
            borderRadius: 8,
            boxShadow: "0 2px 8px #f0f1f2",
            padding: 10,
          }}
          bodyStyle={{ padding: 30, background: "#fff" }}
        >
          <Row gutter={[16, 16]}>
            <Col span={4}>
              <Form.Item
                label={t("myTask.checkin.fields.problem_switch")}
                name="isProblem"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>

            <Col span={20}>
              <Form.Item
                shouldUpdate={(prev, curr) => prev.isProblem !== curr.isProblem}
                noStyle
              >
                {({ getFieldValue }) =>
                  getFieldValue("isProblem") ? (
                    // ✅ Nếu có sự cố (isProblem = true)
                    <Form.Item
                      label={
                        <span style={{ color: "red" }}>
                          {t("myTask.checkin.fields.problem_description")}
                        </span>
                      }
                      name="problemComment"
                      rules={[
                        {
                          required: true,
                          message: t(
                            "myTask.checkin.validation.problem_required"
                          ),
                        },
                      ]}
                    >
                      <Input.TextArea
                        placeholder={t(
                          "myTask.checkin.fields.problem_description_placeholder"
                        )}
                      />
                    </Form.Item>
                  ) : (
                    <Row gutter={16}>
                      <Col span={5}>
                        <Form.Item
                          label={t("myTask.checkin.fields.downtime_hour")}
                          name="downtimeHr"
                          initialValue={0}
                        >
                          <Input type="number" min={0} disabled />
                        </Form.Item>
                      </Col>
                      <Col span={5}>
                        <Form.Item
                          label={t("myTask.checkin.fields.downtime_minute")}
                          name="downtimeMin"
                          initialValue={0}
                        >
                          <Input type="number" min={0} disabled />
                        </Form.Item>
                      </Col>
                      <Col span={14}>
                        <Form.Item
                          label={t("myTask.checkin.fields.comment")}
                          name="comment"
                        >
                          <Input.TextArea
                            placeholder={t("Nhập nội dung comment")}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  )
                }
              </Form.Item>
            </Col>
          </Row>
        </Card>
        <Row justify="end" gutter={16} className="mb-3 ml-3 mr-3">
          <Col>
            <Button onClick={() => navigate(-1)}>
              <CloseCircleFilled /> {t("myTask.checkin.buttons.back")}
            </Button>
          </Col>
          <Col>
            <Button type="primary" onClick={() => onSave()}>
              <PlusCircleOutlined /> {t("myTask.checkin.buttons.save")}
            </Button>
          </Col>
          <Col>
            <Button style={{
              backgroundColor: '#048104', // Dark green
              borderColor: '#048104',
            }} type="primary" onClick={() => oneQA()}>
              <CheckCircleOutlined /> {t("OneQA")}
            </Button>
          </Col>
          <Col>
            <Button type="primary" htmlType="submit">
              <CheckCircleOutlined /> {t("common_buttons.completed")}
            </Button>
          </Col>
        </Row>
      </Form>
      <OneQAModal
        open={isOpenOneQAModal}
        handleCancel={() => setIsOpenOneQAModal(false)}
        workOrderId={calibrationAssignUser?.calibrationWork?.id}
        setLoading={setLoading}
        assetMaintenance={calibrationAssignUser?.calibrationWork?.assetMaintenance}
      />
    </Card>
  );
}
