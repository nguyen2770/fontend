import { Tabs } from 'antd';
import { useTranslation } from 'react-i18next';
import SpareCategory from "../../sparePartManager/spareCategory";
import SpareSubCategory from "../../sparePartManager/spareSubCategory"
import { useEffect } from 'react';
import useHeader from '../../../contexts/headerContext';
import "../../report/assetMaintenance/index.scss";
const SparePartsClassification = () => {
    const { t } = useTranslation();
    const { setHeaderTitle } = useHeader();

    useEffect(() => {
        setHeaderTitle(t("menu.spare_parts_classification.title_spare_parts_classification"));
    }, [t, setHeaderTitle]);

    const items = [
        {
            key: "1",
            label: t("menu.spare_parts_classification.spare_category"),
            children: <SpareCategory />
        },
        {
            key: "2",
            label: t("menu.spare_parts_classification.sub_category"),
            children: <SpareSubCategory />
        },

    ];
    return (
        <div style={{ background: "white" }}>
            <Tabs
                defaultActiveKey={"1"}
                items={items}
                className="tab-all tabs-chart-column wp-100 report-filter-row"
            />
        </div>
    );
};

export default SparePartsClassification;