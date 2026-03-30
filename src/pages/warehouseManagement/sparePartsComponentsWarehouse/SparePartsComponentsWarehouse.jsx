import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import useHeader from '../../../contexts/headerContext';

const SparePartsComponentsWarehouse = () => {
    const { t } = useTranslation();
    const { setHeaderTitle } = useHeader();

    useEffect(() => {
        setHeaderTitle(t("menu.warehouse_management.titke_spare_parts_components_warehouse"));
    }, [t]);
    return (
        <div>

        </div>
    );
};

export default SparePartsComponentsWarehouse;