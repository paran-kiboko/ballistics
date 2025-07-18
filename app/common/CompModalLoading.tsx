import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';

const CompModalLoading = () => {
    const dispatch = useDispatch();
    const isLoading = useSelector((state: RootState) => state.main.isLoading);
    return (
        <>
            {isLoading && <div className="fixed inset-0 bg-white bg-opacity-[0.1] flex justify-center items-center z-5000" style={{ zIndex: 10000 }}>
                <span className="loader">
                    <div className="eye left"></div>
                    <div className="eye right"></div>
                </span>
            </div>}
        </>
    );
};

export default CompModalLoading;