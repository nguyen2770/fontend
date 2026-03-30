import { useEffect, useState } from 'react';
import { Modal, Button, Table, Pagination, Card, Form, Input, Row, Col, Radio } from 'antd';
import * as _unitOfWork from '../../api';
import { PAGINATION } from '../../utils/constant';
import { SearchOutlined, RedoOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

export default function SparepartSelector({ onSelect, value, visible, onClose }) {
    const { t } = useTranslation();
    const [form] = Form.useForm();
    const [spareparts, setSpareparts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalRecord, setTotalRecord] = useState(0);
    const [pagination, setPagination] = useState(PAGINATION);
    const [searchParams, setSearchParams] = useState();
    const [selectedSparepart, setSelectedSparepart] = useState(null);

    useEffect(() => {
        if (visible && value && spareparts.length > 0) {
            const matched = spareparts.find(sp => sp._id === value || sp.id === value);
            if (matched) setSelectedSparepart(matched);
        }
    }, [visible, value, spareparts]);

    const onChangePagination = (value) => {
        setPage(value);
    };

    const handleSearch = (values) => {
        setSearchParams({ ...values });
        setPage(1);
    };

    const handleReset = () => {
        form.resetFields();
        setSearchParams({
            code: '',
            sparePartsName: '',
            manufacturer: ''
        });
        setPage(1);
        setSelectedSparepart(null);
    };

    const handleSelect = () => {
        if (selectedSparepart) {
            onSelect(selectedSparepart);
            onClose();
        }
    };

    const columns = [
        {
            title: t('common.modal.sparepartSelector.table.select'),
            key: 'select',
            width: 50,
            render: (_, record) => (
                <Radio
                    checked={selectedSparepart?._id === record._id}
                    onChange={() => setSelectedSparepart(record)}
                />
            )
        },
        { title: t('common.modal.sparepartSelector.table.name'), dataIndex: 'sparePartsName', key: 'sparePartsName' },
        { title: t('common.modal.sparepartSelector.table.code'), dataIndex: 'code', key: 'code' },
        {
            title: t('common.modal.sparepartSelector.table.manufacturer'),
            dataIndex: 'manufacturerName',
            key: 'manufacturer'
        },
        {
            title: t('common.modal.sparepartSelector.table.uom'),
            dataIndex: ['uomId', 'uomName'],
            key: 'uomName'
        },
        {
            title: t('common.modal.sparepartSelector.table.description'),
            dataIndex: 'description',
            key: 'description'
        }
    ];

    useEffect(() => {
        if (visible) {
            setLoading(true);
            const fetchData = async () => {
                let payload = {
                    page: page,
                    limit: PAGINATION.limit,
                    ...searchParams
                };
                let res = null;

                res = await _unitOfWork.sparePart.getListSpareParts({ ...payload });


                if (res && res.results && res.results?.results) {
                    const data = await Promise.all(
                        res.results.results.map(async (item) => {
                            let avatarUrl = null;
                            if (item.resourceId) {
                                try {
                                    const response = await _unitOfWork.resource.getImage(item.resourceId);
                                    avatarUrl = response || null;
                                } catch (error) {
                                    // silent
                                }
                            }
                            return {
                                ...item,
                                _id: item._id || item.id,
                                SubCategoryName: item.spareSubCategoryId?.spareSubCategoryName,
                                CategoryName: item.spareCategoryId?.spareCategoryName,
                                manufacturerName: item.manufacturer?.manufacturerName,
                                avatarUrl
                            };
                        })
                    );
                    setSpareparts(data);
                    setTotalRecord(res.results.totalResults);
                }
                setLoading(false);
            };
            fetchData();
        }
    }, [visible, page, searchParams]);

    return (
        <Modal
            open={visible}
            onCancel={() => onClose()}
            className="custom-modal"
            footer={null}
            width={1200}
            destroyOnClose
        >
            <Card title={t('common.modal.sparepartSelector.title')}>
                <Form
labelWrap
                    form={form}
                    layout="vertical"
                    onFinish={handleSearch}
                    initialValues={{
                        code: '',
                        sparePartsName: '',
                        manufacturer: ''
                    }}
                >
                    <Row gutter={[16, 16]} className="mb-1">
                        <Col span={4}>
                            <Form.Item
                                name="code"
                                label={t('common.modal.sparepartSelector.search.code_label')}
                            >
                                <Input
                                    placeholder={t(
                                        'common.modal.sparepartSelector.search.placeholder_code'
                                    )}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item
                                name="sparePartsName"
                                label={t('common.modal.sparepartSelector.search.name_label')}
                            >
                                <Input
                                    placeholder={t(
                                        'common.modal.sparepartSelector.search.placeholder_name'
                                    )}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row style={{ marginBottom: 2 }}>
                        <Col span={12} style={{ textAlign: 'left' }}>
                            <Button type="primary" className="mr-2" htmlType="submit">
                                <SearchOutlined />
                                {t('common.modal.sparepartSelector.buttons.search')}
                            </Button>
                            <Button onClick={handleReset} className="bt-green mr-2">
                                <RedoOutlined />
                                {t('common.modal.sparepartSelector.buttons.reset')}
                            </Button>
                        </Col>
                        <Col span={12} style={{ textAlign: 'right' }}>
                            <Button onClick={() => onClose()}>
                                {t('common.modal.sparepartSelector.buttons.cancel')}
                            </Button>
                            <Button
                                key="1"
                                type="primary"
                                onClick={handleSelect}
                                className="ml-2"
                                disabled={!selectedSparepart}
                            >
                                {t('common.modal.sparepartSelector.buttons.confirm')}
                            </Button>
                        </Col>
                    </Row>
                </Form>
                <Table
                    dataSource={spareparts}
                    columns={columns}
                    rowKey="_id"
                    pagination={false}
                    loading={loading}
                    size="middle"
                />
                <Pagination
                    className="pagination-table mt-2"
                    onChange={onChangePagination}
                    pageSize={pagination.limit}
                    total={totalRecord}
                    current={page}
                    showSizeChanger={false}
                />
            </Card>
        </Modal>
    );
}