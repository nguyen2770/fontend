import { notification } from 'antd';
import {CheckCircleOutlined} from '@ant-design/icons';
const ShowSuccess = (placement, message, description) => {
  notification.info({
    icon:<CheckCircleOutlined  style={{color:"green"}}/>,
    message: message || 'Title',
    description: description || 'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
    placement,
  });
};

export default ShowSuccess;