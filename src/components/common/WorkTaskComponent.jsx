import {
  CaretDownOutlined,
  CaretUpOutlined,
  DeleteOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  Dropdown,
  Row,
  Collapse,
  Tooltip,
  notification,
} from "antd";
import React, { useEffect, useState } from "react";
import WorkTask from "./WorkTask";
import { array_move } from "../../helper/array-helper";
import * as _unitOfWork from "../../api";
import { useTranslation } from "react-i18next";

const itemTasksBase = [
  { key: "inspection", labelKey: "workTask.taskTypes.inspection" },
  { key: "monitoring", labelKey: "workTask.taskTypes.monitoring" },
  // { key: "calibration", labelKey: "workTask.taskTypes.calibration" },
];

export default function ServiceTaskComponent({ workTasks, setWorkTasks, view }) {
  const { t } = useTranslation();
  const [uoms, setUoms] = useState([]);

  const itemTasks = itemTasksBase.map(it => ({ key: it.key, label: t(it.labelKey) }));

  useEffect(() => {
    fetchGetAllUom();
  }, []);
  const fetchGetAllUom = async () => {
    let res = await _unitOfWork.uom.getAllUom();
    if (res && res.code === 1) {
      setUoms(res.data);
    }
  };

  const onClickDeleteTask = (_idx) => {
    const _workTasks = [...workTasks];
    _workTasks.splice(_idx, 1);
    setWorkTasks(_workTasks);
  };
  const onNextTask = (_currentIdx) => {
    if (_currentIdx === workTasks.length - 1) {
      notification.warning({
        message: t("workTask.notifications.last_position_title"),
        description: t("workTask.notifications.last_position_desc"),
      });
      return;
    }
    const _workTasks = [...workTasks];
    let newworkTasks = array_move(_workTasks, _currentIdx, _currentIdx + 1);
    setWorkTasks(newworkTasks);
  };
  const onClickAddNewTask = (_info) => {
    let itemTaskFind = itemTasks.find((i) => i.key === _info.key);
    setWorkTasks([
      ...workTasks,
      {
        taskType: _info.key,
        ...itemTaskFind,
        taskItems: [{}],
      },
    ]);
  };
  const onPrewTask = (_currentIdx) => {
    if (_currentIdx === 0) {
      notification.warning({
        message: t("workTask.notifications.first_position_title"),
        description: t("workTask.notifications.first_position_desc"),
      });
      return;
    }
    const _workTasks = [...workTasks];
    let newworkTasks = array_move(_workTasks, _currentIdx, _currentIdx - 1);
    setWorkTasks(newworkTasks);
  };
  const onAddTaskItem = (taskIdx) => {
    const _workTasks = [...workTasks];
    if (!_workTasks[taskIdx].taskItems) {
      _workTasks[taskIdx].taskItems = [{}];
    } else {
      _workTasks[taskIdx].taskItems.push({});
    }
    setWorkTasks(_workTasks);
  };
  const onRemoveTaskItem = (taskIdx, itemIdx) => {
    const _workTasks = [...workTasks];
    _workTasks[taskIdx].taskItems.splice(itemIdx, 1);
    setWorkTasks(_workTasks);
  };
  const onChangeValue = (key, value, taskIdx) => {
    const _workTasks = [...workTasks];
    _workTasks[taskIdx][key] = value;
    setWorkTasks(_workTasks);
  };
  const onChangeValueItem = (key, value, taskIdx, itemIdx) => {
    const _workTasks = [...workTasks];
    _workTasks[taskIdx].taskItems[itemIdx][key] = value;
    setWorkTasks(_workTasks);
  };
  const generateTaskLabel = (_taskType) => {
    let taskTypeOption = itemTasks.find((i) => i.key === _taskType);
    if (taskTypeOption) return taskTypeOption.label;
    return "";
  };
  return (
    <>
      <Row>
        <Col className="text-right mb-2" span={24}>
          {!view ? (
            <Dropdown menu={{ items: itemTasks.map(i => ({ key: i.key, label: i.label })), onClick: onClickAddNewTask }}>
              <Button className="text-right" type="primary">
                <PlusCircleOutlined />
                {t("workTask.buttons.add_new_task")}
              </Button>
            </Dropdown>
          ) : (
            <></>
          )}
        </Col>
      </Row>
      <Row>
        {workTasks &&
          workTasks.length > 0 &&
          workTasks.map((workTask, idx) => {
            return (
              <Col span={24} className="mb-3" key={idx}>
                <Collapse
                  style={{ width: "100%" }}
                  collapsible="header"
                  defaultActiveKey={["1"]}
                  items={[
                    {
                      key: "1",
                      showArrow: false,
                      label: (
                        <span>
                          <span
                            style={{
                              padding: "3px 10px",
                              borderRadius: "50%",
                              border: "1px solid",
                              marginRight: "10px",
                            }}
                          >
                            {idx + 1}
                          </span>
                          {workTask.label ||
                            generateTaskLabel(workTask.taskType)}
                        </span>
                      ),
                      children: (
                        <WorkTask
                          task={workTask}
                          onChangeValueItem={(key, val, itemIdx) =>
                            onChangeValueItem(key, val, idx, itemIdx)
                          }
                          onChangeValue={(key, _itemVal) =>
                            onChangeValue(key, _itemVal, idx)
                          }
                          onRemoveTaskItem={(itemIdx) =>
                            onRemoveTaskItem(idx, itemIdx)
                          }
                          onAddTaskItem={() => onAddTaskItem(idx)}
                          uoms={uoms}
                          view={view}
                        />
                      ),
                      extra: !view ? [
                        <Tooltip title={t("workTask.tooltips.move_up")} key="up">
                          <Button
                            className="mr-3"
                            onClick={() => onPrewTask(idx)}
                            shape="circle"
                            icon={<CaretUpOutlined />}
                          />
                        </Tooltip>,
                        <Tooltip title={t("workTask.tooltips.move_down")} key="down">
                          <Button
                            className="mr-3"
                            onClick={() => onNextTask(idx)}
                            shape="circle"
                            icon={<CaretDownOutlined />}
                          />
                        </Tooltip>,
                        <Tooltip title={t("workTask.tooltips.delete_task")} key="del">
                          <Button
                            type="primary"
                            danger
                            onClick={() => onClickDeleteTask(idx)}
                            shape="circle"
                            icon={<DeleteOutlined />}
                          />
                        </Tooltip>,
                      ] : [],
                    },
                  ]}
                />
              </Col>
            );
          })}
      </Row>
    </>
  );
}