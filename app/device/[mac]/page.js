// 'use client';

// import { useState, useEffect, useCallback } from 'react';
// import * as React from 'react';
// import Link from 'next/link';
// import { useRouter, useSearchParams } from 'next/navigation';
// import withAuth from '../../../lib/withAuth';
// import { useDevices } from '../../../hooks/useDevices';

// function DevicePortsPage({ params }) {
//   // Get the mac from params directly
//   const { mac } = params;
//   const searchParams = useSearchParams();
//   const deviceName = searchParams.get('name') || `Device ${mac}`;
//   const router = useRouter();

//   const { fetchPortsForDevice, addPort, loading, error, clearError } = useDevices();
//   const [ports, setPorts] = useState([]);
//   const [newPortName, setNewPortName] = useState('');
//   const [newPortPin, setNewPortPin] = useState(0);
//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   const fetchCurrentPorts = useCallback(async () => {
//     const result = await fetchPortsForDevice(mac);
//     if (result.success) {
//       setPorts(result.ports || []);
//     }
//   }, [mac, fetchPortsForDevice]);

//   useEffect(() => {
//     fetchCurrentPorts();
//   }, [fetchCurrentPorts]);

//   const handleAddPort = async (e) => {
//     e.preventDefault();
    
//     console.log('handleAddPort called with:', { mac, newPortPin, newPortName });
    
//     if (!newPortName.trim()) {
//       const errorMsg = 'Please enter a port name';
//       console.error(errorMsg);
//       alert(errorMsg);
//       return;
//     }

//     try {
//       console.log('Calling addPort...');
//       // Send (pin - 1) to backend while keeping frontend display as is
//       const backendPin = newPortPin > 0 ? newPortPin - 1 : 0;
//       console.log('Sending to backend - pin:', backendPin, '(frontend pin:', newPortPin, ')');
      
//       const result = await addPort(mac, backendPin, newPortName.trim());
//       console.log('addPort result:', result);
      
//       if (result.success) {
//         setNewPortName('');
//         setNewPortPin(0); // Reset to 0 to match the initial state
//         // Refresh the ports list
//         await fetchCurrentPorts();
//         console.log('Port added successfully, ports refreshed');
//       } else {
//         const errorMsg = result.error || 'Failed to add port';
//         console.error('Failed to add port:', errorMsg, result.details);
//         alert(`Error: ${errorMsg}`);
//       }
//     } catch (error) {
//       const errorMsg = error.message || 'An unexpected error occurred';
//       console.error('Error in handleAddPort:', error);
//       alert(`Error: ${errorMsg}`);
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     router.push('/login');
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <header className="bg-white shadow-sm">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between h-16">
//             <div className="flex">
//               <Link href="/" className="flex-shrink-0 flex items-center">
//                 <div className="h-8 w-8 rounded-md bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center text-white font-bold">
//                   SR
//                 </div>
//                 <span className="ml-2 text-xl font-bold text-gray-900">SmartRemote</span>
//               </Link>
//               <nav className="hidden sm:ml-6 sm:flex sm:space-x-8">
//                 <Link 
//                   href="/dashboard" 
//                   className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
//                 >
//                   Dashboard
//                 </Link>
//                 {/* <Link 
//                   href="/settings" 
//                   className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
//                 >
//                   Settings
//                 </Link> */}
//               </nav>
//             </div>
//             <div className="hidden sm:ml-6 sm:flex sm:items-center">
//               <button
//                 onClick={handleLogout}
//                 className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
//               >
//                 Logout
//               </button>
//             </div>
//             <div className="-mr-2 flex items-center sm:hidden">
//               <button
//                 onClick={() => setIsMenuOpen(!isMenuOpen)}
//                 className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
//                 aria-expanded="false"
//               >
//                 <span className="sr-only">Open main menu</span>
//                 <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//                 </svg>
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Mobile menu */}
//         {isMenuOpen && (
//           <div className="sm:hidden">
//             <div className="pt-2 pb-3 space-y-1">
//               <Link 
//                 href="/dashboard" 
//                 className="border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
//               >
//                 Dashboard
//               </Link>
//               <Link 
//                 href="/settings" 
//                 className="border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
//               >
//                 Settings
//               </Link>
//               <button
//                 onClick={handleLogout}
//                 className="w-full text-left border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
//               >
//                 Logout
//               </button>
//             </div>
//           </div>
//         )}
//       </header>

//       {/* Main content */}
//       <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
//         <div className="px-4 py-6 sm:px-0">
//           {/* Device header */}
//           <div className="md:flex md:items-center md:justify-between mb-8">
//             <div className="flex-1 min-w-0">
//               <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
//                 {deviceName}
//               </h2>
//               <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
//                 <div className="mt-2 flex items-center text-sm text-gray-500">
//                   <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
//                     <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                   </svg>
//                   {mac}
//                 </div>
//               </div>
//             </div>
//             <div className="mt-4 flex md:mt-0 md:ml-4">
//               <Link
//                 href="/dashboard"
//                 className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//               >
//                 <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
//                   <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
//                 </svg>
//                 Back to Devices
//               </Link>
//             </div>
//           </div>

//           {/* Add Port Form */}
//           <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
//             <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
//               <h3 className="text-lg leading-6 font-medium text-gray-900">
//                 Add New Port
//               </h3>
//               <p className="mt-1 max-w-2xl text-sm text-gray-500">
//                 Add a new switch/port to this device
//               </p>
//             </div>
//             <div className="px-4 py-5 sm:p-6">
//               <form onSubmit={handleAddPort} className="space-y-6">
//                 <div className="grid grid-cols-6 gap-6">
//                   <div className="col-span-6 sm:col-span-4">
//                     <label htmlFor="port-name" className="block text-sm font-medium text-gray-700">
//                       Port Name
//                     </label>
//                     <input
//                       type="text"
//                       name="port-name"
//                       id="port-name"
//                       value={newPortName}
//                       onChange={(e) => setNewPortName(e.target.value)}
//                       className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                       placeholder="e.g., Living Room Light"
//                     />
//                   </div>

//                   <div className="col-span-6 sm:col-span-2">
//                     <label htmlFor="port-pin" className="block text-sm font-medium text-gray-700">
//                       Pin Number
//                     </label>
//                     <select
//                       id="port-pin"
//                       name="port-pin"
//                       value={newPortPin}
//                       onChange={(e) => setNewPortPin(parseInt(e.target.value))}
//                       className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
//                     >
//                       {[1, 2, 3, 4, 5, 6, 7, 8].map((pin) => (
//                         <option key={pin} value={pin}>
//                           {pin}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>

//                 <div className="flex justify-end">
//                   <button
//                     type="submit"
//                     disabled={loading}
//                     className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     {loading ? 'Adding...' : 'Add Port'}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>

//           {/* Ports List */}
//           <div className="bg-white shadow overflow-hidden sm:rounded-lg">
//             <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
//               <h3 className="text-lg leading-6 font-medium text-gray-900">
//                 Ports / Switches
//               </h3>
//               <p className="mt-1 max-w-2xl text-sm text-gray-500">
//                 Manage the ports for this device
//               </p>
//             </div>
//             <div className="bg-white overflow-hidden">
//               {loading && ports.length === 0 ? (
//                 <div className="text-center py-12">
//                   <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
//                   <p className="mt-2 text-sm text-gray-500">Loading ports...</p>
//                 </div>
//               ) : ports.length === 0 ? (
//                 <div className="text-center py-12">
//                   <svg
//                     className="mx-auto h-12 w-12 text-gray-400"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={1}
//                       d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//                     />
//                   </svg>
//                   <h3 className="mt-2 text-sm font-medium text-gray-900">No ports</h3>
//                   <p className="mt-1 text-sm text-gray-500">
//                     Get started by adding a new port.
//                   </p>
//                 </div>
//               ) : (
//                 <ul className="divide-y divide-gray-200">
//                   {ports.map((port) => (
//                     <li key={port.pin}>
//                       <Link
//                         href={`/device/${mac}/${port.pin}?name=${encodeURIComponent(deviceName)}&portName=${encodeURIComponent(port.name)}`}
//                         className="block hover:bg-gray-50"
//                       >
//                         <div className="px-4 py-4 sm:px-6">
//                           <div className="flex items-center justify-between">
//                             <p className="text-sm font-medium text-blue-600 truncate">
//                               {port.name}
//                             </p>
//                             <div className="ml-2 flex-shrink-0 flex">
//                               <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
//                                 Pin {port.pin}
//                               </p>
//                             </div>
//                           </div>
//                           <div className="mt-2 sm:flex sm:justify-between">
//                             <div className="sm:flex">
//                               <p className="flex items-center text-sm text-gray-500">
//                                 <svg
//                                   className={`flex-shrink-0 mr-1.5 h-5 w-5 ${port.status ? 'text-green-500' : 'text-gray-400'}`}
//                                   xmlns="http://www.w3.org/2000/svg"
//                                   viewBox="0 0 20 20"
//                                   fill="currentColor"
//                                 >
//                                   <path
//                                     fillRule="evenodd"
//                                     d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
//                                     clipRule="evenodd"
//                                   />
//                                 </svg>
//                                 {port.status ? 'ON' : 'OFF'}
//                               </p>
//                             </div>
//                             <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
//                               <svg
//                                 className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
//                                 xmlns="http://www.w3.org/2000/svg"
//                                 viewBox="0 0 20 20"
//                                 fill="currentColor"
//                               >
//                                 <path
//                                   fillRule="evenodd"
//                                   d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
//                                   clipRule="evenodd"
//                                 />
//                               </svg>
//                               <p>
//                                 Last updated:{' '}
//                                 <time dateTime={port.updatedAt}>
//                                   {new Date(port.updatedAt).toLocaleString()}
//                                 </time>
//                               </p>
//                             </div>
//                           </div>
//                         </div>
//                       </Link>
//                     </li>
//                   ))}
//                 </ul>
//               )}
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }

// export default withAuth(DevicePortsPage);


'use client';

import { useState, useEffect, useCallback } from 'react';
import * as React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import withAuth from '../../../lib/withAuth';
import { useDevices } from '../../../hooks/useDevices';

function DevicePortsPage({ params }) {
  // Get the mac from params directly
  const { mac } = params;
  const searchParams = useSearchParams();
  const deviceName = searchParams.get('name') || `Device ${mac}`;
  const router = useRouter();

  const { fetchPortsForDevice, addPort, loading, error } = useDevices();
  const [ports, setPorts] = useState([]);
  const [newPortName, setNewPortName] = useState('');
  const [newPortPin, setNewPortPin] = useState(1); // Default to pin 1
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const fetchCurrentPorts = useCallback(async () => {
    const result = await fetchPortsForDevice(mac);
    if (result.success) {
      setPorts(result.ports || []);
    }
  }, [mac, fetchPortsForDevice]);

  useEffect(() => {
    fetchCurrentPorts();
  }, [fetchCurrentPorts]);

  const handleAddPort = async (e) => {
    e.preventDefault();
    if (!newPortName.trim()) {
      alert('Please enter a port name');
      return;
    }

    try {
      const result = await addPort(mac, newPortPin, newPortName.trim());
      if (result.success) {
        setNewPortName('');
        setNewPortPin(1); // Reset to default
        await fetchCurrentPorts(); // Refresh the ports list
      } else {
        alert(`Error: ${result.error || 'Failed to add port'}`);
      }
    } catch (err) {
      alert(`Error: ${err.message || 'An unexpected error occurred'}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/'); // Redirect to home page after logout
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ===== HEADER ===== */}
      <header className="header bg-white shadow-md fixed w-full z-10">
        <div className="header-container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <Link href="/" className="logo">
            <img 
              src="/assets/images/Nlogo.png" 
              alt="SmartRemote Logo" 
              style={{ height: '40px' }} 
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/dashboard" className="nav-link text-gray-600 hover:text-blue-600">Dashboard</Link>
            <Link href="/#features" className="nav-link text-gray-600 hover:text-blue-600">Features</Link>
            <Link href="/#how-it-works" className="nav-link text-gray-600 hover:text-blue-600">How It Works</Link>
            <Link href="/support" className="nav-link text-gray-600 hover:text-blue-600">Support</Link>
          </nav>

          <div className="hidden md:flex items-center">
            <button
              onClick={handleLogout}
              className="header-btn btn-logout px-4 py-2 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700"
            >
              Logout
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              className="mobile-menu-btn"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`mobile-menu md:hidden ${isMenuOpen ? 'block' : 'hidden'}`} id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/dashboard" className="nav-link block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Dashboard</Link>
            <Link href="/#features" className="nav-link block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Features</Link>
            <Link href="/#how-it-works" className="nav-link block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">How It Works</Link>
            <Link href="/support" className="nav-link block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Support</Link>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="px-2 space-y-1">
              <button
                onClick={handleLogout}
                className="w-full text-left header-btn btn-logout block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 pt-24">
        <div className="px-4 py-6 sm:px-0">
          {/* Device header */}
          <div className="md:flex md:items-center md:justify-between mb-8">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                {deviceName}
              </h2>
              <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {mac}
                </div>
              </div>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4">
              <Link
                href="/dashboard"
                className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Back to Devices
              </Link>
            </div>
          </div>

          {/* Add Port Form */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Add New Port
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Add a new switch/port to this device
              </p>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <form onSubmit={handleAddPort} className="space-y-6">
                <div className="grid grid-cols-6 gap-6">
                  <div className="col-span-6 sm:col-span-4">
                    <label htmlFor="port-name" className="block text-sm font-medium text-gray-700">
                      Port Name
                    </label>
                    <input
                      type="text"
                      name="port-name"
                      id="port-name"
                      value={newPortName}
                      onChange={(e) => setNewPortName(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="e.g., Living Room Light"
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-2">
                    <label htmlFor="port-pin" className="block text-sm font-medium text-gray-700">
                      Pin Number
                    </label>
                    <select
                      id="port-pin"
                      name="port-pin"
                      value={newPortPin}
                      onChange={(e) => setNewPortPin(parseInt(e.target.value))}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((pin) => (
                        <option key={pin} value={pin}>
                          {pin}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Adding...' : 'Add Port'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Ports List */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Ports / Switches
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Manage the ports for this device
              </p>
            </div>
            <div className="bg-white overflow-hidden">
              {loading && ports.length === 0 ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="mt-2 text-sm text-gray-500">Loading ports...</p>
                </div>
              ) : ports.length === 0 ? (
                <div className="text-center py-12">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No ports</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Get started by adding a new port.
                  </p>
                </div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {ports.map((port) => (
                    <li key={port.pin}>
                      <Link
                        href={`/device/${mac}/${port.pin}?name=${encodeURIComponent(deviceName)}&portName=${encodeURIComponent(port.name)}`}
                        className="block hover:bg-gray-50"
                      >
                        <div className="px-4 py-4 sm:px-6">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-blue-600 truncate">
                              {port.name}
                            </p>
                            <div className="ml-2 flex-shrink-0 flex">
                              <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                Pin {port.pin}
                              </p>
                            </div>
                          </div>
                          <div className="mt-2 sm:flex sm:justify-between">
                            <div className="sm:flex">
                              <p className="flex items-center text-sm text-gray-500">
                                <svg
                                  className={`flex-shrink-0 mr-1.5 h-5 w-5 ${port.status ? 'text-green-500' : 'text-gray-400'}`}
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                {port.status ? 'ON' : 'OFF'}
                              </p>
                            </div>
                            <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                              <svg
                                className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              <p>
                                Last updated:{' '}
                                <time dateTime={port.updatedAt}>
                                  {new Date(port.updatedAt).toLocaleString()}
                                </time>
                              </p>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default withAuth(DevicePortsPage);