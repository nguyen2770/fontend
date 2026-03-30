import { Tabs } from 'antd';
import { useTranslation } from 'react-i18next';
import Category from '../../manager/assetSetup/category';
import SubCategory from '../../manager/assetSetup/subCategory';
import Asset from '../../manager/assetSetup/asset';
import useHeader from '../../../contexts/headerContext';
import { useEffect } from 'react';
import "../../report/assetMaintenance/index.scss";
const EquipmentClassification = () => {
    const { t } = useTranslation();
    const { setHeaderTitle } = useHeader();
    useEffect(() => {
        setHeaderTitle(t("menu.settings.title_equipment_classification"));
    }, [t, setHeaderTitle]);
    const items = [
        {
            key: "1",
            label: t("menu.asset_setup.category"),
            children: <Category />
        },
        {
            key: "2",
            label: t("menu.asset_setup.sub_category"),
            children: <SubCategory />
        },
        {
            key: "3",
            label: t("menu.asset_setup.asset_info"),
            children: <Asset />
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

export default EquipmentClassification;