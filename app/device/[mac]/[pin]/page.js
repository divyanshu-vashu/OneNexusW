'use client';

import { useState, useEffect, useCallback } from 'react';
import * as React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import withAuth from '../../../../lib/withAuth';
import { useDevices } from '../../../../hooks/useDevices';

function IndividualSwitchControlPage({ params }) {
  const resolvedParams = React.use(params);
  const { mac, pin } = resolvedParams;
  const searchParams = useSearchParams();
  const deviceName = searchParams.get('deviceName') || `Device ${mac}`;
  const portName = searchParams.get('portName') || `Switch ${pin}`;
  const router = useRouter();

  const { 
    fetchPinStatus, 
    togglePinStatus, 
    fetchSchedules, 
    createSchedule, 
    deleteSchedule, 
    loading, 
    error, 
    clearError 
  } = useDevices();
  
  const [isOn, setIsOn] = useState(false);
  const [schedules, setSchedules] = useState([]);
  const [formSchedule, setFormSchedule] = useState({ 
    name: '', 
    time: '', 
    action: 'Turn On', 
    day: 'Monday' 
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Helper function to adjust pin for backend (convert from 1-based to 0-based)
  const getBackendPin = (pin) => {
    const pinNum = parseInt(pin, 10);
    return pinNum > 0 ? pinNum - 1 : 0;
  };

  // Fetch initial pin status
  const fetchCurrentPinStatus = useCallback(async () => {
    const backendPin = getBackendPin(pin);
    console.log(`Fetching status for pin: ${pin} (backend pin: ${backendPin})`);
    const result = await fetchPinStatus(mac, backendPin);
    if (result.success) {
      setIsOn(result.status === '1');
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
    const backendPin = getBackendPin(pin);
    console.log(`Toggling pin: ${pin} (backend pin: ${backendPin}) to ${isOn ? 'OFF' : 'ON'}`);
    const result = await togglePinStatus(mac, backendPin, isOn ? '0' : '1');
    if (result.success) {
      setIsOn(!isOn);
    }
  };

  const handleCreateSchedule = async () => {
    if (!formSchedule.name.trim() || !formSchedule.time.trim() || !formSchedule.day.trim()) {
      alert("Please fill in all schedule fields.");
      return;
    }

    const backendPin = getBackendPin(pin);
    const newSchedule = {
      ...formSchedule,
      time: formSchedule.time,
      action: formSchedule.action === 'Turn On' ? '1' : '0',
    };

    console.log(`Creating schedule for pin: ${pin} (backend pin: ${backendPin})`, newSchedule);
    const result = await createSchedule(mac, backendPin, newSchedule);
    if (result.success) {
      setFormSchedule({ name: '', time: '', action: 'Turn On', day: 'Monday' });
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
                  className={`w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white ${
                    isOn 
                      ? 'bg-red-600 hover:bg-red-700' 
                      : 'bg-green-600 hover:bg-green-700'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    isOn ? 'focus:ring-red-500' : 'focus:ring-green-500'
                  }`}
                >
                  {loading ? (
                    'Processing...'
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
                  <label htmlFor="schedule-day" className="block text-sm font-medium text-gray-700">
                    Day
                  </label>
                  <select
                    id="schedule-day"
                    value={formSchedule.day}
                    onChange={(e) => setFormSchedule({...formSchedule, day: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Everyday'].map(day => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="schedule-time" className="block text-sm font-medium text-gray-700">
                    Time
                  </label>
                  <input
                    type="time"
                    id="schedule-time"
                    value={formSchedule.time}
                    onChange={(e) => setFormSchedule({...formSchedule, time: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="schedule-action" className="block text-sm font-medium text-gray-700">
                    Action
                  </label>
                  <select
                    id="schedule-action"
                    value={formSchedule.action}
                    onChange={(e) => setFormSchedule({...formSchedule, action: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="Turn On">Turn On</option>
                    <option value="Turn Off">Turn Off</option>
                  </select>
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