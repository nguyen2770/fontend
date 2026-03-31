import { Tabs } from 'antd';
import { useTranslation } from 'react-i18next';
import Branch from '../../manager/branch';
import Department from '../../manager/customer/department';
import Floor from '../../manager/customer/floor';
import Building from "../../manager/customer/building"
import useHeader from '../../../contexts/headerContext';
import "../../report/assetMaintenance/index.scss";

import { useEffect } from 'react';
const Location = () => {
    const { t } = useTranslation();
    const { setHeaderTitle } = useHeader();

    useEffect(() => {
        setHeaderTitle(t("menu.localtion.title_localtion_manager"));
    }, [t, setHeaderTitle]);

    const items = [
        {
            key: "2",
            label: t("menu.settings.building"),
            children: <Building />
        },
        {
            key: "3",
            label: t("menu.settings.floor"),
            children: <Floor />
        },
        {
            key: "4",
            label: t("menu.settings.department"),
            children: <Department />
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

export default Location;