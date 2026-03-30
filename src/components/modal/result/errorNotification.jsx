import { notification } from 'antd';
import { WarningOutlined } from "@ant-design/icons";

const ShowError = (placement, message, description) => {
  notification.error({
    icon: <WarningOutlined style={{ color: 'orange' }} />,
    message: message,
    description: description,
    placement,
  });
};

export default ShowError;
