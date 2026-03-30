import React, { use, useState } from "react";
import { LeftCircleFilled, UsergroupAddOutlined } from "@ant-design/icons";
import { Button } from "antd";
import Confirm from "../../../components/modal/Confirm";
import { useNavigate } from "react-router-dom";
import CreateUserMapping from "./CreateUsermapping";
import { useLocation } from "react-router-dom";

export default function UserMapping() {
  const navigate = useNavigate();
  const [isOpenCreateUserMapping, setIsOpenCreateUsermapping] = useState(false);
  const location = useLocation();
  const defaultTab = location.state?.tab?.toString() || "1";
  const fromUrl = location.state?.from?.toString() || "404";
  const onOpenCreate = () => {
    setIsOpenCreateUsermapping(true);
  };
  return (
    <div className="content-manager">
      <div className="header-all justify-content-space-between ">
        <h4 className="title-content ">User Mapping</h4>
        <div>
          <Button
            style={{ background: "#ecedf0", marginRight: "5px" }}
            // onClick={() => navigate(fromUrl, { state: { tab: defaultTab } })}
            onClick={() => navigate(-1)}
          >
          <LeftCircleFilled/>
            Quay lại
          </Button>
          <Button
            style={{ background: "#ecedf0", marginRight: "5px" }}
            onClick={() => onOpenCreate()}
          >
            <UsergroupAddOutlined />
            Add User Mapping
          </Button>
        </div>
      </div>
      <div className="table-container "></div>
      <CreateUserMapping
        open={isOpenCreateUserMapping}
        handleCancel={() => setIsOpenCreateUsermapping(false)}
        handleOk={() => setIsOpenCreateUsermapping(false)}
      />
    </div>
  );
}
