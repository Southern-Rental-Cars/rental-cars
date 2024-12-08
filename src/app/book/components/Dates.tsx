'use client';

import React, { useState, useEffect } from 'react';

interface SelectDatesBoxProps {
  onDateChange: (start: string, end: string) => void;
  defaultStartDateTime: string;
  defaultEndDateTime: string;
}

const SelectDatesBox: React.FC<SelectDatesBoxProps> = ({
  onDateChange,
  defaultStartDateTime,
  defaultEndDateTime,
}) => {
  const [startDateTime, setStartDateTime] = useState(defaultStartDateTime);
  const [endDateTime, setEndDateTime] = useState(defaultEndDateTime);
  const [minDateTime, setMinDateTime] = useState<string | null>(null);

  // Helper to format the current date and time for "datetime-local"
  const getFormattedDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // Set the minimum date-time when the component mounts
  useEffect(() => {
    setMinDateTime(getFormattedDateTime());
  }, []);

  // Handle the search action
  const handleSearch = () => {
    if (!startDateTime || !endDateTime) {
      alert('Please select both start and end dates.');
      return;
    }

    if (new Date(endDateTime) <= new Date(startDateTime)) {
      alert('End date must be after the start date.');
      return;
    }

    onDateChange(startDateTime, endDateTime);
  };

  if (!minDateTime) {
    return <div>Loading...</div>; // Fallback for minDateTime initialization
  }

  return (
    <div className="bg-white p-6 border border-gray-200 rounded-lg max-w-4xl mx-auto mt-8 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-end justify-between space-y-4 md:space-y-0 md:space-x-4">
        {/* Start Date-Time */}
        <div className="flex flex-col w-full md:w-1/2">
          <label htmlFor="start-datetime" className="text-gray-700 text-sm font-medium mb-2">
            Start Date & Time:
          </label>
          <input
            id="start-datetime"
            type="datetime-local"
            value={startDateTime.slice(0, 16)}
            onChange={(e) => setStartDateTime(e.target.value)}
            min={minDateTime}
            className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-150 ease-in-out"
            aria-label="Select start date and time"
          />
        </div>

        {/* End Date-Time */}
        <div className="flex flex-col w-full md:w-1/2">
          <label htmlFor="end-datetime" className="text-gray-700 text-sm font-medium mb-2">
            End Date & Time:
          </label>
          <input
            id="end-datetime"
            type="datetime-local"
            value={endDateTime.slice(0, 16)}
            onChange={(e) => setEndDateTime(e.target.value)}
            min={startDateTime} // Ensure end date is after start date
            className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-150 ease-in-out"
            aria-label="Select end date and time"
          />
        </div>

        {/* Search Button */}
        <button
          onClick={handleSearch}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md px-6 py-2 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
          aria-label="Search available vehicles"
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default SelectDatesBox;
