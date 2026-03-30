import React, { useState, useEffect } from "react";
import { Row, Col } from "antd";
import * as _unitOfWork from "../../../../api";
import AttachmentModalView from "../../../../components/modal/attachmentModel/AttachmentModalView";
import { useTranslation } from "react-i18next";

export default function TabAttachmentCalibrationWork({ calibrationWork }) {
    const { t } = useTranslation();
    const [breakdownAttachments, setBreakdownAttachments] = useState([]);
    const [fileList, setFileList] = useState([]);

    useEffect(() => {
        fetchGetAllBreakdownAttachment();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchGetAllBreakdownAttachment = async () => {
        let res = await _unitOfWork.breakdown.getAllBreakdownAttachment({ breakdown: calibrationWork.id || calibrationWork._id });
        if (res && res.code === 1) {
            const resources = res.data.map((data) => data?.resource);
            setBreakdownAttachments(res.data);
            const fileList = resources.map((doc) => ({
                ...doc,
                id: doc?.id,
                name: doc?.fileName,
                src: _unitOfWork.resource.getImage(doc?.id),
                supportDocumentId: doc?.id,
            }));
            setFileList(fileList);
        }
    };

    return (
        <div>
            <Row gutter={24}>
                {fileList.length > 0 ? fileList.map((file, index) => (
                    <Col span={12} key={index} >
                        <AttachmentModalView file={file} breakdownAttachments={breakdownAttachments} />
                    </Col>
                )) : <div className="text-center w-100 pt-2">{t("breakdown.viewTabs.attachment.no_data")}</div>}
            </Row>
        </div>
    );
};