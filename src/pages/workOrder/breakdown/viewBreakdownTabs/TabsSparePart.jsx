import { Card, Row, Col, Typography } from 'antd';
import { useEffect, useState } from 'react';
import * as _unitOfWork from '../../../../api';
import { breakdownSpareRequestDetailStatus } from '../../../../utils/constant';
import { parsePriceVnd } from '../../../../helper/price-helper';
import { useTranslation } from 'react-i18next';

const { Title, Text } = Typography;

const SparePartList = ({ breakdown }) => {
    const { t } = useTranslation();
    const [spareParts, setSpareParts] = useState([]);
    useEffect(() => {
        fetchBreakdownSpareRequestByBreakdown();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchBreakdownSpareRequestByBreakdown = async () => {
        const res = await _unitOfWork.breakdownSpareRequest.getBreakdownSpareRequestByAssetModel({ breakdown: breakdown.id });
        if (res?.code === 1) {
            setSpareParts(res.data.data);
        }
    }
    return (
        <>
            {spareParts.length > 0 ? spareParts.map((sparePart, index) => {
                const totalCost = sparePart.details.reduce(
                    (total, part) => total + (part.unitCost * part.qty),
                    0
                );

                return (
                    <div key={index} style={{ marginBottom: 18 }}>
                        <Title style={{
                            background: "#F3FDFF",
                            padding: "8px 12px",
                            fontWeight: 600,
                            margin: "18px 0 8px 0",
                            borderRadius: 4,
                        }} level={5}>{sparePart.code}</Title>
                        {sparePart.details.map((part, idx) => (
                            <Card key={idx} size="small" style={{
                                marginBottom: 16,
                                paddingTop: 2,
                                padding: 16,
                                backgroundColor: '#fff',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                borderRadius: 6,
                            }}>
                                <Row gutter={[16, 8]}>
                                    <Col span={8} style={{ display: 'flex', flexDirection: 'column' }}>
                                        <Text >{t("breakdown.viewTabs.sparePart.spare_part_id")} </Text>
                                        <Text strong style={{ marginTop: 4 }}>{part.sparePart?.code || '-'}</Text>
                                    </Col>
                                    <Col span={8} style={{ display: 'flex', flexDirection: 'column' }}>
                                        <Text >{t("breakdown.viewTabs.sparePart.spare_part_name")} </Text>
                                        <Text strong style={{ marginTop: 4 }}>{part.sparePart?.sparePartsName || '-'}</Text>
                                    </Col>
                                    <Col span={8} style={{ display: 'flex', flexDirection: 'column' }}>
                                        <Text >{t("breakdown.viewTabs.sparePart.status")} </Text>
                                        <Text strong style={{ marginTop: 4 }}>
                                            {
                                                t(breakdownSpareRequestDetailStatus.Option.find(o => o.value === part.requestStatus)?.label) || '-'
                                            }
                                        </Text>
                                    </Col>
                                    <Col span={8} style={{ display: 'flex', flexDirection: 'column' }}>
                                        <Text >{t("breakdown.viewTabs.sparePart.qty")} </Text>
                                        <Text strong style={{ marginTop: 4 }}>{part.qty || 0}</Text>
                                    </Col>
                                    <Col span={8} style={{ display: 'flex', flexDirection: 'column' }}>
                                        <Text >{t("breakdown.viewTabs.sparePart.unit_cost")} </Text>
                                        <Text strong style={{ marginTop: 4 }}>{parsePriceVnd(part.unitCost || 0)}</Text>
                                    </Col>
                                    <Col span={8} style={{ display: 'flex', flexDirection: 'column' }}>
                                        <Text >{t("breakdown.viewTabs.sparePart.total_cost")} </Text>
                                        <Text strong style={{ marginTop: 4 }}>{parsePriceVnd((part.unitCost * part.qty) || 0)}</Text>
                                    </Col>
                                </Row>
                            </Card>
                        ))}
                        <div style={{ marginTop: 12, textAlign: 'right' }}>
                            <Text>{t("breakdown.viewTabs.sparePart.summary_total_cost")}  </Text> {parsePriceVnd(totalCost)}
                        </div>
                    </div>
                );
            }) : <div className="text-center w-100 pt-2" >{t("breakdown.viewTabs.sparePart.no_data")}</div>}
        </>
    );
};

export default SparePartList;