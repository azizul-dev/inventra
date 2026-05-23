import React from 'react';

const DashboardHeader = () => {
    return (
        <div className=' max-w-7xl mx-auto md:flex justify-between items-center gap-4 p-4 space-y-4'>
            <div className=' text-center'>
                <h2 className=' font-bold text-3xl'>Good Morning</h2>
                <p className=''>Today's Business Summary</p>
            </div>
            <div>
                <h2>Date</h2>
            </div>
        </div>
    );
};

export default DashboardHeader;