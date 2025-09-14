'use client';

import { useState, useEffect, useCallback } from 'react';
import * as React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import withAuth from '../../../../lib/withAuth';
import { useDevices } from '../../../../hooks/useDevices';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format, parse } from 'date-fns';

// Helper function to format time for API
const formatTimeForAPI = (date) => {
  return date ? date.toISOString() : null;
};

// Helper function to parse time string to Date object
const parseTimeString = (timeStr) => {
  if (!timeStr) return null;
  const [hours, minutes] = timeStr.split(':');
  const date = new Date();
  date.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
  return date;
};

function IndividualSwitchControlPage({ params }) {
  const resolvedParams = React.use(params);
  const { mac, pin } = resolvedParams;
  const searchParams = useSearchParams();
  const deviceName = searchParams.get('name') || `Device ${mac}`;
  const portName = searchParams.get('portName') || `Switch ${pin}`;
  const router = useRouter();

  const { 
    getPinState: fetchPinStatus, // Alias getPinState to fetchPinStatus for backward compatibility
    togglePinState: togglePinStatus, // Alias togglePinState to togglePinStatus for backward compatibility
    fetchSchedules, 
    createSchedule, 
    deleteSchedule, 
    loading, 
    error, 
  } = useDevices();
  
  const [isOn, setIsOn] = useState(false);
  const [schedules, setSchedules] = useState([]);
  const [formSchedule, setFormSchedule] = useState({
    name: '',
    onTime: null,
    offTime: null
  });
  
  // Function to format date to ISO string without timezone conversion
  const toUTCISOString = (date) => {
    if (!date) return null;
    // Get the local time components
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    // Format as ISO string with Z (UTC) but keep the original time values
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.000Z`;
  };
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Helper function to adjust pin for backend (convert from 1-based to 0-based)
  const getBackendPin = (pin) => {
    const pinNum = parseInt(pin, 10);
    return pinNum > 0 ? pinNum - 1 : 0;
  };

  // Fetch initial pin status
  const fetchCurrentPinStatus = useCallback(async () => {
    try {
      const backendPin = getBackendPin(pin);
      console.log(`Fetching status for pin: ${pin} (backend pin: ${backendPin})`);
      const result = await fetchPinStatus(mac, backendPin);
      if (result.success) {
        // The status might be in result.data.status or directly in result.data
        const status = result.data?.status ?? result.data;
        console.log('Current pin status:', status);
        setIsOn(status === '1' || status === true || status === 1);
      } else {
        console.error('Failed to fetch pin status:', result.error);
      }
    } catch (error) {
      console.error('Error fetching pin status:', error);
    }
  }, [mac, pin, fetchPinStatus]);

  // Fetch schedules for this pin
  const fetchPinSchedules = useCallback(async () => {
    const backendPin = getBackendPin(pin);
    console.log(`Fetching schedules for pin: ${pin} (backend pin: ${backendPin})`);
    const result = await fetchSchedules(mac, backendPin);
    if (result.success) {
      setSchedules(result.schedules || []);
    }
  }, [mac, pin, fetchSchedules]);

  useEffect(() => {
    fetchCurrentPinStatus();
    fetchPinSchedules();
  }, [fetchCurrentPinStatus, fetchPinSchedules]);

  const handleToggleSwitch = async () => {
    if (loading) return; // Prevent multiple clicks while loading
    
    try {
      const backendPin = getBackendPin(pin);
      console.log(`Toggling pin: ${pin} (backend pin: ${backendPin})`);
      
      // Optimistically update the UI
      setIsOn(prev => !prev);
      
      const result = await togglePinStatus(mac, backendPin, 'toggle');
      
      if (!result.success) {
        // Revert the UI if the API call fails
        setIsOn(prev => !prev);
        console.error('Failed to toggle pin:', result.error);
        alert(`Failed to toggle switch: ${result.error}`);
      } else {
        // Refresh the status to ensure it's in sync with the server
        await fetchCurrentPinStatus();
      }
    } catch (error) {
      // Revert the UI on error
      setIsOn(prev => !prev);
      console.error('Error toggling pin:', error);
      alert('An error occurred while toggling the switch');
    }
  };

  const handleCreateSchedule = async () => {
    if (!formSchedule.name.trim() || (!formSchedule.onTime && !formSchedule.offTime)) {
      alert("Please provide a schedule name and at least one time (on or off).");
      return;
    }

    const backendPin = getBackendPin(pin);
    
    // Format dates for API (preserving local time as UTC)
    const scheduleData = {
      name: formSchedule.name.trim(),
      macSymbolId: mac,
      switchPin: backendPin.toString(),
      scheduleTimes: {
        onTime: formSchedule.onTime ? toUTCISOString(formSchedule.onTime) : null,
        offTime: formSchedule.offTime ? toUTCISOString(formSchedule.offTime) : null
      }
    };
    
    console.log('Submitting schedule data:', JSON.stringify(scheduleData, null, 2));

    console.log('Submitting schedule data:', JSON.stringify(scheduleData, null, 2));
    const result = await createSchedule(mac, backendPin, scheduleData);
    if (result.success) {
      setFormSchedule({ name: '', onTime: '', offTime: '' });
      fetchPinSchedules();
    }
  };

  const handleDeleteSchedule = async (scheduleId) => {
    if (window.confirm('Are you sure you want to delete this schedule?')) {
      const backendPin = getBackendPin(pin);
      console.log(`Deleting schedule ${scheduleId} for pin: ${pin} (backend pin: ${backendPin})`);
      const result = await deleteSchedule(mac, backendPin, scheduleId);
      if (result.success) {
        fetchPinSchedules();
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex-shrink-0 flex items-center">
                <div className="h-8 w-8 rounded-md bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center text-white font-bold">
                  SR
                </div>
                <span className="ml-2 text-xl font-bold text-gray-900">SmartRemote</span>
              </Link>
              <nav className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link 
                  href="/dashboard" 
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Dashboard
                </Link>
              </nav>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none"
              >
                Logout
              </button>
            </div>
            <div className="flex items-center sm:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="sm:hidden">
            <div className="pt-2 pb-3 space-y-1">
              <Link
                href="/dashboard"
                className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="mb-6 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            <svg
              className="h-5 w-5 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Back to {deviceName}
          </button>

          {/* Device Info Card */}
          <div className="bg-white overflow-hidden shadow rounded-lg mb-8">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{portName}</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Device: {deviceName} (MAC: {mac})
                  </p>
                </div>
                <div className="flex items-center">
                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    isOn ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {isOn ? 'ON' : 'OFF'}
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={handleToggleSwitch}
                  disabled={loading}
                  className={`w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white transition-colors duration-200 ${
                    loading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : isOn 
                        ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' 
                        : 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2`}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {isOn ? 'Turning OFF...' : 'Turning ON...'}
                    </>
                  ) : isOn ? (
                    'Turn OFF'
                  ) : (
                    'Turn ON'
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Schedule Form */}
          <div className="bg-white overflow-hidden shadow rounded-lg mb-8">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Create Schedule</h3>
              
              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="schedule-name" className="block text-sm font-medium text-gray-700">
                    Schedule Name
                  </label>
                  <input
                    type="text"
                    id="schedule-name"
                    value={formSchedule.name}
                    onChange={(e) => setFormSchedule({...formSchedule, name: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="e.g., Morning Lights"
                  />
                </div>


                <div className="sm:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Turn On Date & Time (optional)
                  </label>
                  <DatePicker
                    selected={formSchedule.onTime}
                    onChange={(date) => setFormSchedule({...formSchedule, onTime: date})}
                    showTimeSelect
                    timeIntervals={15}
                    timeCaption="Time"
                    dateFormat="MMMM d, yyyy h:mm aa"
                    placeholderText="Select date and time"
                    className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    minDate={new Date()}
                    calendarClassName="font-sans"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Turn Off Date & Time (optional)
                  </label>
                  <DatePicker
                    selected={formSchedule.offTime}
                    onChange={(date) => setFormSchedule({...formSchedule, offTime: date})}
                    showTimeSelect
                    timeIntervals={15}
                    timeCaption="Time"
                    dateFormat="MMMM d, yyyy h:mm aa"
                    placeholderText="Select date and time"
                    className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    minDate={new Date()}
                    calendarClassName="font-sans"
                  />
                </div>

                <div className="sm:col-span-2 flex items-end">
                  <button
                    type="button"
                    onClick={handleCreateSchedule}
                    disabled={loading}
                    className="w-full bg-blue-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {loading ? 'Adding...' : 'Add Schedule'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Schedules List */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Scheduled Tasks</h3>
              
              {schedules.length === 0 ? (
                <p className="text-sm text-gray-500">No schedules found. Create one above.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Day
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Time
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Action
                        </th>
                        <th scope="col" className="relative px-6 py-3">
                          <span className="sr-only">Delete</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {schedules.map((schedule) => (
                        <tr key={schedule.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {schedule.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {schedule.day}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(schedule.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              schedule.action === 'Turn On' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {schedule.action}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleDeleteSchedule(schedule.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default withAuth(IndividualSwitchControlPage);