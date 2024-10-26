'use client';
import React, { useState } from 'react';

interface SelectDatesBoxProps {
  onDateChange: (start: string, end: string) => void;
  defaultStartDateTime: string;
  defaultEndDateTime: string;
}

const SelectDatesBox: React.FC<SelectDatesBoxProps> = ({ onDateChange, defaultStartDateTime, defaultEndDateTime }) => {
  const [dates, setDates] = useState({ startDateTime: defaultStartDateTime, endDateTime: defaultEndDateTime });

  // Function to get today's date in the required format (YYYY-MM-DDTHH:MM)
  const getMinDateTime = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based, so add 1
    const day = String(today.getDate()).padStart(2, '0');
    const hours = String(today.getHours()).padStart(2, '0');
    const minutes = String(today.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const minDateTime = getMinDateTime();

  // Handle search button click
  const handleSearch = () => {
    const { startDateTime, endDateTime } = dates;
    if (!startDateTime || !endDateTime) {
      alert('Please fill in both start and end dates.');
      return;
    }
    onDateChange(startDateTime, endDateTime);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto mt-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between space-y-4 md:space-y-0 md:space-x-4">
        {/* From Date-Time */}
        <div className="flex flex-col w-full md:w-1/2">
          <label className="text-gray-700 text-sm font-medium mb-2">From:</label>
          <input
            type="datetime-local"
            value={dates.startDateTime.slice(0, 16)}
            onChange={(e) => setDates((prev) => ({ ...prev, startDateTime: e.target.value }))}
            min={minDateTime} // Prevent selecting dates before today
            className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-150 ease-in-out"
          />
        </div>

        {/* To Date-Time */}
        <div className="flex flex-col w-full md:w-1/2">
          <label className="text-gray-700 text-sm font-medium mb-2">To:</label>
          <input
            type="datetime-local"
            value={dates.endDateTime.slice(0, 16)}
            onChange={(e) => setDates((prev) => ({ ...prev, endDateTime: e.target.value }))}
            min={dates.startDateTime} // The "To" date cannot be earlier than the "From" date
            className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-150 ease-in-out"
          />
        </div>

        {/* Search Button */}
        <button
          onClick={handleSearch}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md px-6 py-2 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default SelectDatesBox;
