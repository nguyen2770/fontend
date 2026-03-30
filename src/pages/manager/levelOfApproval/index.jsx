import React, { useEffect } from 'react';
import useHeader from '../../../contexts/headerContext';

export default function LevelOfApproval() {
    const { setHeaderTitle } = useHeader();
    useEffect(() => {
        setHeaderTitle("Level Of Approval")
    }, [])
    
    return (
        <div>

        </div>
    );
};

