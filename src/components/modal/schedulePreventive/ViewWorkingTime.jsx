import React from 'react';
import { Button, Card, Modal } from 'antd';
import { formatWorkingTime } from '../../../helper/date-helper';

export default function ViewWorkingTime({ open, workingTime, onCancel }) {
    return (
        <Modal
            open={open}
            closable={false}
            className="custom-modal"
            footer={false}
            width={"40%"}
        >
            <Card title="Down Time">
                <span
                    style={{
                        display: "block",
                        fontSize: "2rem",
                        color: "#1976d2",
                        fontWeight: 700,
                        margin: "24px 0",
                        textAlign: "center",
                        letterSpacing: 1,
                    }}
                >
                    {formatWorkingTime(workingTime)}
                </span>
                <div style={{ textAlign: "end" }}>
                    <Button onClick={onCancel}>Hủy</Button>
                </div>
            </Card>
        </Modal>
    );
}