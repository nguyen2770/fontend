import React from 'react';
import { Spin } from 'antd';
const Loading = () => {
    return (
        <div className='text-center py-5'>
            <Spin size='large' />
        </div>
    );
};

export default Loading;