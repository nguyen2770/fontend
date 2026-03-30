import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import useHeader from '../../../contexts/headerContext';

const EquipmenWarehouse = () => {
    const { t } = useTranslation();
        const { setHeaderTitle } = useHeader();
    
        useEffect(() => {
            setHeaderTitle(t("menu.warehouse_management.title_equipmen_warehouse"));
        }, [t]);
    return (
        <div>
            
        </div>
    );
};

export default EquipmenWarehouse;