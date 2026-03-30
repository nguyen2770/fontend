import { ExclamationCircleFilled } from "@ant-design/icons";
import { Modal } from "antd";
import i18next from "i18next";

const { confirm } = Modal;

const Confirm = (content, callback) => {
  confirm({
    title: i18next.t("modal.confirm.title"),
    icon: <ExclamationCircleFilled />,
    content,
    okText: i18next.t("modal.confirm.ok"),
    cancelText: i18next.t("modal.confirm.cancel"),
    onOk() {
      callback && callback();
    },
  });
};

export default Confirm;