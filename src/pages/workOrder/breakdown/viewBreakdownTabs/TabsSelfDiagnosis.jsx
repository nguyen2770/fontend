import React, { useEffect, useState } from 'react';
import { Col, Row } from 'antd';
import * as _unitOfWork from "../../../../api";
import { answerTypeSeftDiagnosia } from '../../../../utils/constant';
import { useTranslation } from 'react-i18next';

const TabsSelfDiagnosis = ({ breakdown }) => {
    const { t } = useTranslation();
    const [selfDiagnosis, setSelfDiagnosies] = useState([]);

    useEffect(() => {
        fetchGetAllSolutionByAssetModelId();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchGetAllSolutionByAssetModelId = async () => {
        const res = await _unitOfWork.assetModelSeftDiagnosia.getAllAssetModelSeftDiagnosia({
            assetModel: breakdown?.assetMaintenance?.assetModel?.id ||
                breakdown?.assetMaintenance?.assetModel?._id,
            assetModelFailureType: breakdown?.breakdownDefect?.id,
        });

        if (res && res.code === 1) {
            setSelfDiagnosies(res.data);
        }
    };

    const renderAnswerTypeLabel = (type) => {
        return answerTypeSeftDiagnosia.options.find(o => o.value === type)?.label || "--";
    };

    return (
        <div>
            {selfDiagnosis.length === 0 ? (
                <div className="text-center w-100 pt-2">{t("breakdown.viewTabs.selfDiagnosis.no_data")}</div>
            ) : selfDiagnosis.map((item, idx) => (
                <div
                    key={item._id}
                    style={{
                        background: '#fff',
                        borderRadius: 8,
                        marginBottom: 18,
                        padding: '16px 20px',
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                    }}
                >
                    <div style={{ color: '#888', fontWeight: 500, fontSize: 15, marginBottom: 4 }}>
                        {t("breakdown.viewTabs.selfDiagnosis.failure_type")}
                    </div>
                    <div style={{ fontSize: 17, marginBottom: 12 }}>
                        {item?.assetModelFailureType?.name}
                    </div>

                    <div style={{ color: '#888', fontWeight: 500, fontSize: 15, marginBottom: 4 }}>
                        {t("breakdown.viewTabs.selfDiagnosis.answer_type")}
                    </div>
                    <div style={{ fontSize: 17, marginBottom: 12 }}>
                        {t(renderAnswerTypeLabel(item?.answerType))}
                    </div>

                    <div style={{ color: '#888', fontWeight: 500, fontSize: 15, marginBottom: 4 }}>
                        {t("breakdown.viewTabs.selfDiagnosis.question")}
                    </div>
                    <div style={{ fontSize: 17, marginBottom: 12 }}>
                        {item?.question}
                    </div>

                    <div style={{ color: '#888', fontWeight: 500, fontSize: 15, marginBottom: 4 }}>
                        {t("breakdown.viewTabs.selfDiagnosis.answer")}
                    </div>
                    <div style={{ fontSize: 17, marginBottom: 8 }}>
                        {item?.values?.length > 0 ? (
                            item?.answerType === answerTypeSeftDiagnosia.option ? (
                                item.values.map((v, idx) => (
                                    <Row
                                        key={v.id || idx}
                                        style={{
                                            background: '#f4f8f5',
                                            borderRadius: 8,
                                            padding: '10px 14px',
                                            marginBottom: 10,
                                            border: '1px solid #e0e0e0',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <Col span={24}>
                                            <span style={{ fontWeight: 600, marginRight: 8 }}>
                                                {t("breakdown.viewTabs.selfDiagnosis.answer_item", { index: idx + 1 })}:
                                            </span>
                                            <span style={{ color: '#23457b' }}>
                                                {v.value1}
                                            </span>
                                        </Col>
                                    </Row>
                                ))
                            ) : item?.answerType === answerTypeSeftDiagnosia.range ? (
                                item.values.map((v, idx) => (
                                    <Row
                                        key={v.id || idx}
                                        style={{
                                            background: '#f5f7fa',
                                            borderRadius: 8,
                                            padding: '10px 14px',
                                            marginBottom: 10,
                                            border: '1px solid #e0e0e0',
                                            alignItems: 'center'
                                        }}
                                        gutter={12}
                                    >
                                        <Col span={24} style={{ fontWeight: 600, marginBottom: 6 }}>
                                            {t("breakdown.viewTabs.selfDiagnosis.answer_item", { index: idx + 1 })}:
                                        </Col>
                                        <Col span={12}>
                                            <span style={{ color: '#888' }}>{t("breakdown.viewTabs.selfDiagnosis.value1")}</span>{' '}
                                            <span style={{ color: '#23457b' }}>{v.value1}</span>
                                        </Col>
                                        <Col span={12}>
                                            <span style={{ color: '#888' }}>{t("breakdown.viewTabs.selfDiagnosis.value2")}</span>{' '}
                                            <span style={{ color: '#23457b' }}>{v.value2}</span>
                                        </Col>
                                    </Row>
                                ))
                            ) : (
                                <span style={{ color: '#bbb' }}>--</span>
                            )
                        ) : (
                            <span style={{ color: '#bbb' }}>--</span>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default TabsSelfDiagnosis;