import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import useHeader from '../../../contexts/headerContext';

const WarehouseReceipt = () => {
      const { t } = useTranslation();
        const { setHeaderTitle } = useHeader();
    
        useEffect(() => {
            setHeaderTitle(t("menu.warehouse_management.title_warehouse_receipt"));
        }, [t]);
    return (
        <div>
            
        </div>
    );
};

export default WarehouseReceipt;