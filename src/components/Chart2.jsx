import React, { useState } from 'react';
import Chart from 'react-apexcharts';

function Chart2() {
    const [dateRange, setDateRange] = useState({ start: '1', end: '30' });
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [hoveredIndex, setHoveredIndex] = useState(null);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    // Updated options for the bar chart
    const chartOptions = {
        chart: {
            type: 'bar',
            toolbar: {
                show: false,
            },
            events: {
                dataPointMouseEnter: (event, chartContext, { dataPointIndex }) => {
                    setHoveredIndex(dataPointIndex);
                },
                dataPointMouseLeave: () => {
                    setHoveredIndex(null);
                },
            },
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '50%',
                endingShape: 'rounded',
            },
        },
        xaxis: {
            categories: ['Temperature', 'Rain', 'Wind Speed', 'Humidity'], // The x-axis labels
        },
        // Different colors for each bar
        colors: ['#FF4560', '#00E396', '#7C8FFB', '#775DD0'], 
        responsive: [
            {
                breakpoint: 480,
                options: {
                    chart: {
                        width: 200,
                    },
                    legend: {
                        position: 'bottom',
                    },
                },
            },
        ],
        legend: {
            position: 'top',
            horizontalAlign: 'left',
        },
        dataLabels: {
            enabled: true,
            formatter: (val, { seriesIndex }) => {
                // Format the data labels with units
                const units = ['°C', 'mm', 'km/h', '%']; // Corresponding units for each category
                return `${val} ${units[seriesIndex]}`;
            },
            style: {
                fontSize: '12px', // Customize the font size if needed
            },
        },
    };

    const chartSeries = [
        {
            name: 'Weather Update',
            data: [44, 55, 41, 67], // The data for each category
        },
    ];

    // Information for each category
    const infoMessages = [
        'Temperature: Ideal for outdoor activities. Keep hydrated.',
        'Rain: Recent rainfall could affect outdoor plans. Check for flooding in low areas.',
        'Wind Speed: Strong winds may lead to high waves or dangerous conditions.',
        'Humidity: High humidity can make temperatures feel warmer. Stay cool and hydrated.',
    ];

    return (
        <div className="w-full bg-white rounded-lg shadow dark:bg-gray-800 p-4 md:p-6 relative">
            <div className="flex justify-between items-start w-full">
                <div className="flex-col items-center">
                    <div className="flex items-center mb-1">
                        <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white me-1">Weather Update</h5>
                    </div>
                </div>
                <button onClick={toggleDropdown} type="button" className="inline-flex items-center text-blue-700 dark:text-blue-600 font-medium hover:underline">
                    {dateRange.start || '31 Nov'} - {dateRange.end || '31 Dec'}
                    <svg className="w-3 h-3 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                    </svg>
                </button>
                {dropdownOpen && (
                    <div className="z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-80 lg:w-96 absolute right-0">
                        <div className="p-3">
                            <div className="flex items-center">
                                <div className="relative">
                                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                        <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        value={dateRange.start}
                                        onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="Start date"
                                    />
                                </div>
                                <span className="mx-2 text-gray-500 dark:text-gray-400">to</span>
                                <div className="relative">
                                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                        <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        value={dateRange.end}
                                        onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="End date"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            {/* Bar chart rendering */}
            <Chart options={chartOptions} series={chartSeries} type="bar" height={350} />
            {/* Info Popover */}
            {hoveredIndex !== null && (
                <div
                    className="absolute bg-white p-2 rounded shadow-md"
                    style={{
                        top: '100px', // Adjust as necessary
                        left: '50%', // Center the popover horizontally
                        transform: 'translateX(-50%)',
                        zIndex: 1000,
                    }}
                >
                    {infoMessages[hoveredIndex]}
                </div>
            )}
        </div>
    );
}

export default Chart2;
