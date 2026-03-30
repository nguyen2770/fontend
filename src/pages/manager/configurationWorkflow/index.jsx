import React, { useState, useEffect } from "react";
import { EditOutlined } from "@ant-design/icons";
import { Row, Col, Table, Card, Button, Space, Tooltip, Form } from "antd";
import * as _unitOfWork from "../../../api";
import { useCustomNav } from "../../../helper/navigate-helper";
import UpdateWorkflow from "./UpdateWorkflow";
import useHeader from "../../../contexts/headerContext";
import useAuth from "../../../contexts/authContext";
import { checkPermission } from "../../../helper/permission-helper";
import { permissionCodeConstant } from "../../../utils/permissionConstant";
import { useTranslation } from "react-i18next";

export default function ConfigurationWorkflow(props) {
  const navigate = useCustomNav();
  const [searchForm] = Form.useForm();
  const [workflows, setWorkflows] = useState([]);
  const [roles, setRoles] = useState([]);
  const [isOpenUpdateWorkflow, setIsOpenUpdateWorkflow] = useState(false);
  const [workflow, setWorkflow] = useState(null);
  const { setHeaderTitle } = useHeader();
  const { permissions } = useAuth();
  const { t } = useTranslation();

  useEffect(() => {
    fetchAllWorkflows();
    fetchAllRoles();
    setHeaderTitle(t("configuration_process.title"));
  }, []);

  const fetchAllWorkflows = async () => {
    let res = await _unitOfWork.workflow.getAllWorkflows();
    if (res && res.code === 1) {
      setWorkflows(res.data);
    }
  };
  const fetchAllRoles = async () => {
    let res = await _unitOfWork.role.getAllRoles();
    if (res && res.code === 1) {
      setRoles(res.data);
    }
  };
  const onClickUpdate = (record) => {
    setWorkflow(record);
    setIsOpenUpdateWorkflow(true);
  };

  const columns = [
    {
      title: t("configuration_process.table.index"),
      dataIndex: "id",
      key: "id",
      width: 60,
      align: "center",
      render: (_, record, _idx) => {
        return <span>{_idx + 1}</span>;
      },
    },
    {
      title: t("configuration_process.table.process_name"),
      dataIndex: "name",
      key: "name",
      width: 180,
      align: "center",
    },
    {
      title: t("configuration_process.table.code"),
      dataIndex: "code",
      key: "code",
      width: 130,
      align: "center",
    },
    {
      title: t("configuration_process.table.description"),
      dataIndex: "description",
      key: "description",
      width: 250,
      align: "center",
    },
    {
      title: t("configuration_process.table.for_example"),
      dataIndex: "example",
      key: "example",
      width: 250,
      align: "center",
    },
    {
      title: t("configuration_process.table.actions"),
      key: "action",
      width: 90,
      align: "center",
      render: (text, record) => (
        <Space size="middle">
          {checkPermission(
            permissions,
            permissionCodeConstant.configuration_workflow_update,
          ) && (
            <Tooltip title={t("configuration_process.table.edit")}>
              <Button
                type="primary"
                icon={<EditOutlined />}
                size="small"
                onClick={() => onClickUpdate(record)}
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  const onClickSearch = () => {};
  const onCallbackUpdate = () => {
    setIsOpenUpdateWorkflow(false);
    setWorkflow(null);
    fetchAllWorkflows();
  };
  return (
    <div style={{ marginTop: 10 }}>
      <Form
        labelWrap
        className="search-form"
        form={searchForm}
        layout="vertical"
        onFinish={onClickSearch}
      >
        <Row className="mb-1">
          <Col span={12}>
            {/* <Button type="primary" className="mr-2" htmlType="submit" onClick={onClickSearch} >
                <SearchOutlined />
                Tìm kiếm
              </Button>
              <Button className=" mr-2" onClick={onClickResetSearch}>
                <RedoOutlined />
                Làm mới
              </Button> */}
          </Col>
        </Row>
      </Form>
      <Table
        rowKey="id"
        columns={columns}
        key={"id"}
        dataSource={workflows}
        bordered
      ></Table>
      <UpdateWorkflow
        handleCancel={() => {
          setIsOpenUpdateWorkflow(false);
          setWorkflow(null);
        }}
        open={isOpenUpdateWorkflow}
        workflow={workflow}
        roles={roles}
        handleOk={onCallbackUpdate}
      />
    </div>
  );
}
