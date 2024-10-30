'use client';
import React, { useState, useEffect } from 'react';

interface SelectDatesBoxProps {
  onDateChange: (start: string, end: string) => void;
  defaultStartDateTime: string;
  defaultEndDateTime: string;
}

const SelectDatesBox: React.FC<SelectDatesBoxProps> = ({ onDateChange, defaultStartDateTime, defaultEndDateTime }) => {
  const [dates, setDates] = useState({ startDateTime: defaultStartDateTime, endDateTime: defaultEndDateTime });
  const [minDateTime, setMinDateTime] = useState<string | null>(null);

  useEffect(() => {
    // Only set the minDateTime on the client after mounting
    const calculateMinDateTime = () => {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    };
    setMinDateTime(calculateMinDateTime());
  }, []); // Runs only once after mount

  // Handle search button click
  const handleSearch = () => {
    const { startDateTime, endDateTime } = dates;
    if (!startDateTime || !endDateTime) {
      alert('Please fill in both start and end dates.');
      return;
    }

    // Validate that end date is after start date
    if (new Date(endDateTime) <= new Date(startDateTime)) {
      alert('End date and time must be after the start date and time.');
      return;
    }

    onDateChange(startDateTime, endDateTime);
  };

  // Don't render the date inputs until minDateTime is available on the client
  if (!minDateTime) {
    return null; // Render nothing until minDateTime is set
  }

  return (
    <div className="bg-white p-6 border border-gray-200 rounded-lg max-w-4xl mx-auto mt-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between space-y-4 md:space-y-0 md:space-x-4">
        {/* Start Date-Time */}
        <div className="flex flex-col w-full md:w-1/2">
          <label className="text-gray-700 text-sm font-medium mb-2">Start:</label>
          <input
            type="datetime-local"
            value={dates.startDateTime.slice(0, 16)}
            onChange={(e) => setDates((prev) => ({ ...prev, startDateTime: e.target.value }))}
            min={minDateTime} // Set min only after minDateTime is calculated
            className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-150 ease-in-out"
          />
        </div>

        {/* End Date-Time */}
        <div className="flex flex-col w-full md:w-1/2">
          <label className="text-gray-700 text-sm font-medium mb-2">End:</label>
          <input
            type="datetime-local"
            value={dates.endDateTime.slice(0, 16)}
            onChange={(e) => setDates((prev) => ({ ...prev, endDateTime: e.target.value }))}
            min={dates.startDateTime} // The "End" date cannot be earlier than the "Start" date
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