import React, { useEffect } from 'react';
import useHeader from '../../../contexts/headerContext';

const SystemSetting = () => {
    const { setHeaderTitle } = useHeader();
    useEffect(() => {
        setHeaderTitle("Cài đặt hệ thống")
    }, [])
    return (
        <div>

        </div>
    );
};

export default SystemSetting;