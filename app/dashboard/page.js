"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import withAuth from "../../lib/withAuth";
import { useDevices } from "../../hooks/useDevices";

function DashboardPage() {
  const router = useRouter();
  const [expandedDevice, setExpandedDevice] = useState(null);
  const { devices, loading, error, fetchDevices, addPort } = useDevices();

  useEffect(() => {
    fetchDevices();
  }, []);

  const toggleDevice = (deviceId) => {
    setExpandedDevice(expandedDevice === deviceId ? null : deviceId);
  };

  const handleAddPort = async (e, macAddress) => {
    e.stopPropagation();
    router.push(`/device/${macAddress}?name=${encodeURIComponent('New Device')}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Devices</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {devices.map((device) => (
            <div 
              key={device._id} 
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              <div 
                className="p-6 cursor-pointer flex justify-between items-center"
                onClick={() => toggleDevice(device._id)}
              >
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    {device.name}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {device.macAddress}
                  </p>
                </div>
                <svg
                  className={`w-5 h-5 text-gray-500 transform transition-transform ${
                    expandedDevice === device._id ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>

              <div className="border-t border-gray-200 p-4">
                {expandedDevice === device._id && (
                  <div className="mb-4">
                    {device.switches && device.switches.length > 0 ? (
                      <ul className="space-y-3">
                        {device.switches.map((port) => (
                          <li key={port._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium text-gray-800">{port.name}</p>
                              <p className="text-sm text-gray-500">Pin {port.pin}</p>
                            </div>
                            <span className={`px-3 py-1 text-sm rounded-full ${
                              port.status 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {port.status ? 'ON' : 'OFF'}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div 
                        className="flex items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                        onClick={(e) => handleAddPort(e, device.macSymbolId || device.macAddress)}
                      >
                        <div className="text-center">
                          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
                            <svg
                              className="h-6 w-6 text-blue-600"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                              />
                            </svg>
                          </div>
                          <h3 className="mt-2 text-sm font-medium text-gray-900">
                            No ports
                          </h3>
                          <p className="mt-1 text-sm text-gray-500">
                            Click to add a new port
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => toggleDevice(device._id)}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    {expandedDevice === device._id ? 'Hide ports' : 'Show ports'}
                  </button>
                  <Link
                    href={`/device/${device.macSymbolId || device.macAddress}`}
                    className="text-sm font-medium text-blue-600 hover:text-blue-500"
                  >
                    Manage Device →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default withAuth(DashboardPage);