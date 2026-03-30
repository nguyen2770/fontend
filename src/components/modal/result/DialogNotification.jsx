import React from 'react';
import { Modal, Button, Typography, Space } from 'antd';
import {
    CloseCircleOutlined,
    CheckCircleOutlined,
    ExclamationCircleOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const { Text } = Typography;

export default function DialogModal({
    open,
    handleOk,
    type = 'error',
    message,
}) {
    const { t } = useTranslation();

    const config = {
        error: {
            icon: <CloseCircleOutlined style={{ color: '#ff4d4f', fontSize: '24px' }} />,
            title: t('Lỗi nhập liệu'),
            color: '#fff1f0',
            borderColor: '#ffccc7',
        },
        success: {
            icon: <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '24px' }} />,
            title: t('Thành công'),
            color: '#f6ffed',
            borderColor: '#b7eb8f',
        },
        warning: {
            icon: <ExclamationCircleOutlined style={{ color: '#faad14', fontSize: '24px' }} />,
            title: t('Cảnh báo'),
            color: '#fffbe6',
            borderColor: '#ffe58f',
        }
    };

    const currentConfig = config[type] || config.error;
    const renderMessage = () => {
        if (Array.isArray(message)) {
            return (
                <ul style={{
                    margin: 0,
                    paddingLeft: '20px',
                    maxHeight: '200px',
                    overflowY: 'auto',
                    listStyleType: 'disc'
                }}>
                    {message.map((item, index) => (
                        <li key={index} style={{ marginBottom: '4px' }}>
                            <Text strong={type === 'error'}>{item}</Text>
                        </li>
                    ))}
                </ul>
            );
        }
        return <Text strong>{message}</Text>;
    };

    return (
        <Modal
            open={open}
            onOk={handleOk}
            onCancel={handleOk}
            footer={[
                <Button key="submit" type="primary" onClick={handleOk} style={{ borderRadius: '6px' }}>
                    {t('Đóng')}
                </Button>,
            ]}
            title={
                <Space>
                    {currentConfig.icon}
                    <span>{currentConfig.title}</span>
                </Space>
            }
            centered
        >
            <div
                style={{
                    marginTop: '16px',
                    padding: '16px',
                    backgroundColor: currentConfig.color,
                    border: `1px solid ${currentConfig.borderColor}`,
                    borderRadius: '8px',
                }}
            >
                {renderMessage()}

                {type === 'error' && (
                    <div style={{ marginTop: '12px', fontSize: '13px', color: '#595959' }}>
                        <p style={{ marginBottom: 0 }}>• {t('Vui lòng kiểm tra lại file Excel của bạn.')}</p>
                        <p style={{ marginBottom: 0 }}>• {t('Đảm bảo các cột bắt buộc không bị trống.')}</p>
                    </div>
                )}
            </div>
        </Modal>
    );
}