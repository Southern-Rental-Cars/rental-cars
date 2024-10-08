'use client';

import React, { useState } from 'react';

interface SelectDatesProps {
  onDateChange: (start: string, end: string) => void;
  defaultStartDateTime: string;
  defaultEndDateTime: string;
}

const SelectDates: React.FC<SelectDatesProps> = ({onDateChange, defaultStartDateTime, defaultEndDateTime}) => {
  const [dates, setDates] = useState({
    startDateTime: defaultStartDateTime,
    endDateTime: defaultEndDateTime,
  });

  // Handle search button click
  const handleSearch = () => {
    const { startDateTime, endDateTime } = dates;
    if (!startDateTime || !endDateTime) {
      alert('Please fill in both start and end dates.');
      return;
    }
    // Call the parent-provided handler with the selected dates
    onDateChange(startDateTime, endDateTime);
  };

  return (
    <div className="flex flex-col md:flex-row items-end justify-between p-6 bg-white rounded-lg max-w-4xl mx-auto">
      {/* From Date-Time */}
      <div className="flex flex-col w-full md:w-1/2 mr-0 md:mr-4">
        <label className="text-gray-600 text-sm mb-2">From:</label>
        <input
          type="datetime-local"
          value={dates.startDateTime.slice(0, 16)}
          onChange={(e) =>setDates((prev) => ({ ...prev, startDateTime: e.target.value }))}
          className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-yellow-500 outline-none"
        />
      </div>
      {/* To Date-Time */}
      <div className="flex flex-col w-full md:w-1/2 mt-4 md:mt-0">
        <label className="text-gray-600 text-sm mb-2">To:</label>
        <input
          type="datetime-local"
          value={dates.endDateTime.slice(0, 16)}
          onChange={(e) => setDates((prev) => ({ ...prev, endDateTime: e.target.value }))}
          className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-yellow-500 outline-none"
        />
      </div>
      {/* Search Button */}
      <div className="flex w-full md:w-auto mt-6 md:mt-0 md:ml-4">
        <button onClick={handleSearch} className="w-full bg-yellow-500 hover:bg-yellow-600 transition text-black font-semibold rounded-lg p-3">
          Search
        </button>
      </div>
    </div>
  );
};

export default SelectDates;
