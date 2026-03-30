import React, { useEffect, useState } from "react";
import { Button, Card, Checkbox, Col, Modal, Row } from "antd";
import * as _unitOfWork from "../../../api";
import { useTranslation } from "react-i18next";

const MappingBranchModal = ({ open, onClose, user, branchs = [] }) => {
  const { t } = useTranslation();
  const [branchCheckeds, setBranchCheckeds] = useState([]);
  const onCancel = () => {
    setBranchCheckeds([]);
    onClose();
  };

  useEffect(() => {
    if (user) {
      fetchUserBranchs();
    }
  }, [user]);

  const onChangeBranch = (_val, branch) => {
    let newChecked = [...branchCheckeds];
    if (_val) {
      newChecked.push(branch.id);
    } else {
      let _idx = newChecked.findIndex((b) => b === branch.id);
      newChecked.splice(_idx, 1);
    }
    setBranchCheckeds(newChecked);
  };
  const checkedBranch = (_branch) =>
    branchCheckeds.find((b) => b === _branch.id) ? true : false;

  const fetchUserBranchs = async () => {
    let res = await _unitOfWork.user.getUserBranchs(user.id);
    if (res && res.code === 1) {
      setBranchCheckeds(res.data.map((item) => item.branch?.id));
    }
  };
  const onUpdateBranch = async () => {
    const userBranchs = branchCheckeds.map((_branchId) => ({
      user: user.id,
      branch: _branchId
    }));
    const payload = {
      userBranchs: userBranchs
    };
    let res = await _unitOfWork.user.updateUserBranchs(user.id, payload);
    if (res && res.code === 1) {
      onCancel();
    }
  };
  return (
    <Modal
      open={open}
      onCancel={onCancel}
      className="custom-modal"
      footer={null}
      width={"50%"}
    >
      <Card title={t("users.mappingBranch.title")}>
        {branchs.map((branch) => (
          <Row className="mb-2" key={branch.id}>
            <Checkbox
              checked={checkedBranch(branch)}
              onChange={(e) => onChangeBranch(e.target.checked, branch)}
            >
              {branch.name}
            </Checkbox>
          </Row>
        ))}
        <Row>
          <div className="modal-footer">
            <Button onClick={onCancel}>{t("users.mappingBranch.buttons.cancel")}</Button>
            <Button type="primary" onClick={onUpdateBranch}>
              {t("users.mappingBranch.buttons.save")}
            </Button>
          </div>
        </Row>
      </Card>
    </Modal>
  );
};

export default MappingBranchModal;