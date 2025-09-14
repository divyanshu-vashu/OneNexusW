// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import withAuth from "../../lib/withAuth";
// import { useDevices } from "../../hooks/useDevices";
// import axios from 'axios';
// import Script from 'next/script';

// function DashboardPage() {
//   useEffect(() => {
//     // Add scroll progress bar functionality
//     const handleScroll = () => {
//       const scrollTop = window.scrollY;
//       const docHeight = document.body.scrollHeight - window.innerHeight;
//       const scrollPercent = (scrollTop / docHeight) * 100;
//       const bar = document.getElementById("scroll-progress");
//       if (bar) bar.style.width = scrollPercent + "%";
//     };
    
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);
//   const router = useRouter();
//   const [expandedDevice, setExpandedDevice] = useState(null);
//   const [showAddDeviceModal, setShowAddDeviceModal] = useState(false);
//   const [newDevice, setNewDevice] = useState({ name: '', macAddress: '' });
//   const [submitError, setSubmitError] = useState('');
//   const { devices, loading, error, fetchDevices, addDevice } = useDevices();

//   useEffect(() => {
//     fetchDevices();
//   }, []);

//   const toggleDevice = (deviceId) => {
//     setExpandedDevice(expandedDevice === deviceId ? null : deviceId);
//   };

//   const handleAddPort = async (e, macAddress) => {
//     e.stopPropagation();
//     router.push(`/device/${macAddress}?name=${encodeURIComponent('New Device')}`);
//   };

//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   const handleAddDevice = async (e) => {
//     e.preventDefault();
//     setSubmitError('');
    
//     try {
//       await addDevice(newDevice.macAddress, newDevice.name);
//       setShowAddDeviceModal(false);
//       setNewDevice({ name: '', macAddress: '' });
//    } catch (err) {
//       console.error('Error adding device:', err);
//       setSubmitError(err.response?.data?.message || 'Failed to add device');
//     }
//   };

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-red-500">Error: {error}</div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
//       <div id="scroll-progress" />
//       <header className="header">
//         <div className="header-container">
//           <Link href="/" className="logo">
//             <img 
//               src="/assets/images/Nlogo.png" 
//               alt="SmartRemote Logo" 
//               style={{ height: '40px' }} 
//             />
//           </Link>

//           <nav className="nav-desktop">
//             <Link href="/#features" className="nav-link">Features</Link>
//             <Link href="/#how-it-works" className="nav-link">How It Works</Link>
//             <Link href="/#specs" className="nav-link">Specifications</Link>
//             <Link href="/support" className="nav-link">Support</Link>
//           </nav>

//           <div className="nav-buttons">
//             <Link href="/login" className="header-btn btn-login">Login</Link>
//             <Link href="/register" className="header-btn btn-register">Register</Link>
//             <Link href="/shop" className="header-btn btn-buy">Buy Now</Link>
//           </div>

//           <button 
//             className="mobile-menu-btn"
//             onClick={() => setIsMenuOpen(!isMenuOpen)}
//           >
//             <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//             </svg>
//           </button>

//           <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
//             <div className="mobile-nav-links">
//               <Link href="/#features" className="nav-link">Features</Link>
//               <Link href="/#how-it-works" className="nav-link">How It Works</Link>
//               <Link href="/#specs" className="nav-link">Specifications</Link>
//               <Link href="/support" className="nav-link">Support</Link>
//             </div>
//             <div className="mobile-nav-buttons">
//               <Link href="/login" className="header-btn btn-login">Login</Link>
//               <Link href="/register" className="header-btn btn-register">Register</Link>
//               <Link href="/shop" className="header-btn btn-buy">Buy Now</Link>
//             </div>
//           </div>
//         </div>
//       </header>

//       <div className="pt-24 p-6">
//         <div className="max-w-7xl mx-auto">
//           <h1 className="text-3xl font-bold text-gray-900 mb-8">My Devices</h1>
        
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {/* Add Device Card */}
//             <div 
//               className="bg-white rounded-xl shadow-md overflow-hidden border-2 border-dashed border-gray-300 hover:border-blue-500 transition-colors cursor-pointer flex items-center justify-center min-h-[180px]"
//               onClick={() => setShowAddDeviceModal(true)}
//             >
//               <div className="text-center p-6">
//                 <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
//                 </svg>
//                 <h3 className="mt-2 text-sm font-medium text-gray-900">Add New Device</h3>
//                 <p className="mt-1 text-sm text-gray-500">Click to register a new device</p>
//               </div>
//             </div>
//             {/* Existing Devices */}
//             {devices.map((device) => (
//               <div 
//                 key={device._id} 
//                 className="bg-white rounded-xl shadow-md overflow-hidden"
//               >
//                 <div 
//                   className="p-6 cursor-pointer flex justify-between items-center"
//                   onClick={() => toggleDevice(device._id)}
//                 >
//                   <div>
//                     <h2 className="text-xl font-semibold text-gray-800">
//                       {device.name}
//                     </h2>
//                     <p className="text-sm text-gray-500 mt-1">
//                       {device.macAddress}
//                     </p>
//                   </div>
//                   <svg
//                     className={`w-5 h-5 text-gray-500 transform transition-transform ${
//                       expandedDevice === device._id ? "rotate-180" : ""
//                     }`}
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M19 9l-7 7-7-7"
//                     />
//                   </svg>
//                 </div>

//                 <div className="border-t border-gray-200 p-4">
//                   {expandedDevice === device._id && (
//                     <div className="mb-4">
//                       {device.switches && device.switches.length > 0 ? (
//                         <ul className="space-y-3">
//                           {device.switches.map((port) => (
//                             <li key={port._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
//                               <div>
//                                 <p className="font-medium text-gray-800">{port.name}</p>
//                                 <p className="text-sm text-gray-500">Pin {port.pin}</p>
//                               </div>
//                               <span className={`px-3 py-1 text-sm rounded-full ${
//                                 port.status 
//                                   ? 'bg-green-100 text-green-800' 
//                                   : 'bg-gray-100 text-gray-800'
//                               }`}>
//                                 {port.status ? 'ON' : 'OFF'}
//                               </span>
//                             </li>
//                           ))}
//                         </ul>
//                       ) : (
//                         <div 
//                           className="flex items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
//                           onClick={(e) => handleAddPort(e, device.macSymbolId || device.macAddress)}
//                         >
//                           <div className="text-center">
//                             <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
//                               <svg
//                                 className="h-6 w-6 text-blue-600"
//                                 fill="none"
//                                 viewBox="0 0 24 24"
//                                 stroke="currentColor"
//                               >
//                                 <path
//                                   strokeLinecap="round"
//                                   strokeLinejoin="round"
//                                   strokeWidth={2}
//                                   d="M12 6v6m0 0v6m0-6h6m-6 0H6"
//                                 />
//                               </svg>
//                             </div>
//                             <h3 className="mt-2 text-sm font-medium text-gray-900">
//                               No ports
//                             </h3>
//                             <p className="mt-1 text-sm text-gray-500">
//                               Click to add a new port
//                             </p>
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   )}
                  
//                   <div className="flex justify-between items-center">
//                     <button
//                       onClick={() => toggleDevice(device._id)}
//                       className="text-sm text-gray-500 hover:text-gray-700"
//                     >
//                       {expandedDevice === device._id ? 'Hide ports' : 'Show ports'}
//                     </button>
//                     <Link
//                       href={`/device/${device.macSymbolId || device.macAddress}`}
//                       className="text-sm font-medium text-blue-600 hover:text-blue-500"
//                     >
//                       Manage Device →
//                     </Link>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Add Device Modal */}
//           {showAddDeviceModal && (
//             <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//               <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
//                 <div className="p-6">
//                   <div className="flex justify-between items-center mb-4">
//                     <h2 className="text-xl font-semibold text-gray-900">Add New Device</h2>
//                     <button 
//                       onClick={() => {
//                         setShowAddDeviceModal(false);
//                         setNewDevice({ name: '', macAddress: '' });
//                         setSubmitError('');
//                       }}
//                       className="text-gray-400 hover:text-gray-500"
//                     >
//                       <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                       </svg>
//                     </button>
//                   </div>
                  
//                   <form onSubmit={handleAddDevice}>
//                     <div className="space-y-4">
//                       <div>
//                         <label htmlFor="deviceName" className="block text-sm font-medium text-gray-700">
//                           Device Name
//                         </label>
//                         <input
//                           type="text"
//                           id="deviceName"
//                           required
//                           value={newDevice.name}
//                           onChange={(e) => setNewDevice({...newDevice, name: e.target.value})}
//                           className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
//                           placeholder="e.g., Living Room Light"
//                         />
//                       </div>
                      
//                       <div>
//                         <label htmlFor="macAddress" className="block text-sm font-medium text-gray-700">
//                           MAC Address
//                         </label>
//                         <input
//                           type="text"
//                           id="macAddress"
//                           required
//                           value={newDevice.macAddress}
//                           onChange={(e) => {
//                             // Allow only hex digits and colons, convert to uppercase
//                             const value = e.target.value.toUpperCase();
//                             // Remove any non-hex characters
//                             const cleanValue = value.replace(/[^0-9A-F:]/g, '');
//                             setNewDevice({...newDevice, macAddress: cleanValue});
//                           }}
//                           onBlur={(e) => {
//                             // Format the MAC address with colons on blur
//                             const value = e.target.value.replace(/[^0-9A-F]/g, '');
//                             if (value.length === 12) {
//                               const formatted = value.match(/.{1,2}/g).join(':');
//                               setNewDevice({...newDevice, macAddress: formatted});
//                             }
//                           }}
//                           className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
//                           placeholder="00:1A:2B:3C:4D:58"
//                           pattern="^([0-9A-Fa-f]{2}[:]){5}([0-9A-Fa-f]{2})$"
//                           title="Please enter a valid MAC address (e.g., 00:1A:2B:3C:4D:58)"
//                         />
//                       </div>
                      
//                       {submitError && (
//                         <div className="text-red-500 text-sm mt-2">
//                           {submitError}
//                         </div>
//                       )}
                      
//                       <div className="flex justify-end space-x-3 pt-4">
//                         <button
//                           type="button"
//                           onClick={() => {
//                             setShowAddDeviceModal(false);
//                             setNewDevice({ name: '', macAddress: '' });
//                             setSubmitError('');
//                           }}
//                           className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                           disabled={loading}
//                         >
//                           Cancel
//                         </button>
//                         <button
//                           type="submit"
//                           className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
//                           disabled={loading || !newDevice.name || !newDevice.macAddress}
//                         >
//                           {loading ? 'Adding...' : 'Add Device'}
//                         </button>
//                       </div>
//                     </div>
//                   </form>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default withAuth(DashboardPage);



"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import withAuth from "../../lib/withAuth";
import { useDevices } from "../../hooks/useDevices";
import axios from 'axios';
import Script from 'next/script';

function DashboardPage() {
  const router = useRouter();
  const [expandedDevice, setExpandedDevice] = useState(null);
  const [showAddDeviceModal, setShowAddDeviceModal] = useState(false);
  const [newDevice, setNewDevice] = useState({ name: '', macAddress: '' });
  const [submitError, setSubmitError] = useState('');
  const { devices, loading, error, fetchDevices, addDevice } = useDevices();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // Add scroll progress bar functionality
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.body.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      const bar = document.getElementById("scroll-progress");
      if (bar) bar.style.width = scrollPercent + "%";
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  const handleLogout = () => {
    // Clear the user's token from localStorage
    localStorage.removeItem('token');
    // Redirect to the home page
    router.push('/');
  };

  const toggleDevice = (deviceId) => {
    setExpandedDevice(expandedDevice === deviceId ? null : deviceId);
  };

  const handleAddPort = (e, macAddress) => {
    e.stopPropagation();
    router.push(`/device/${macAddress}?name=${encodeURIComponent('New Device')}`);
  };

  const handleAddDevice = async (e) => {
    e.preventDefault();
    setSubmitError('');
    
    try {
      await addDevice(newDevice.macAddress, newDevice.name);
      setShowAddDeviceModal(false);
      setNewDevice({ name: '', macAddress: '' });
   } catch (err) {
      console.error('Error adding device:', err);
      setSubmitError(err.response?.data?.message || 'Failed to add device');
    }
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
    <div className="min-h-screen bg-gray-50">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
      <div id="scroll-progress" />
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
            <Link href="/#features" className="nav-link text-gray-600 hover:text-blue-600">Features</Link>
            <Link href="/#how-it-works" className="nav-link text-gray-600 hover:text-blue-600">How It Works</Link>
            <Link href="/#specs" className="nav-link text-gray-600 hover:text-blue-600">Specifications</Link>
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
            <Link href="/#features" className="nav-link block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Features</Link>
            <Link href="/#how-it-works" className="nav-link block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">How It Works</Link>
            <Link href="/#specs" className="nav-link block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Specifications</Link>
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

      <div className="pt-24 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">My Devices</h1>
        
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Add Device Card */}
            <div 
              className="bg-white rounded-xl shadow-md overflow-hidden border-2 border-dashed border-gray-300 hover:border-blue-500 transition-colors cursor-pointer flex items-center justify-center min-h-[180px]"
              onClick={() => setShowAddDeviceModal(true)}
            >
              <div className="text-center p-6">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Add New Device</h3>
                <p className="mt-1 text-sm text-gray-500">Click to register a new device</p>
              </div>
            </div>
            {/* Existing Devices */}
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

                {expandedDevice === device._id && (
                  <div className="border-t border-gray-200 p-4">
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
                    
                    <div className="flex justify-between items-center mt-4">
                      <button
                        onClick={() => toggleDevice(device._id)}
                        className="text-sm text-gray-500 hover:text-gray-700"
                      >
                        Hide ports
                      </button>
                      <Link
                        href={`/device/${device.macSymbolId || device.macAddress}`}
                        className="text-sm font-medium text-blue-600 hover:text-blue-500"
                      >
                        Manage Device →
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Add Device Modal */}
          {showAddDeviceModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">Add New Device</h2>
                    <button 
                      onClick={() => {
                        setShowAddDeviceModal(false);
                        setNewDevice({ name: '', macAddress: '' });
                        setSubmitError('');
                      }}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  <form onSubmit={handleAddDevice}>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="deviceName" className="block text-sm font-medium text-gray-700">
                          Device Name
                        </label>
                        <input
                          type="text"
                          id="deviceName"
                          required
                          value={newDevice.name}
                          onChange={(e) => setNewDevice({...newDevice, name: e.target.value})}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                          placeholder="e.g., Living Room Light"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="macAddress" className="block text-sm font-medium text-gray-700">
                          MAC Address
                        </label>
                        <input
                          type="text"
                          id="macAddress"
                          required
                          value={newDevice.macAddress}
                          onChange={(e) => {
                            // Allow only hex digits and colons, convert to uppercase
                            const value = e.target.value.toUpperCase();
                            // Remove any non-hex characters
                            const cleanValue = value.replace(/[^0-9A-F:]/g, '');
                            setNewDevice({...newDevice, macAddress: cleanValue});
                          }}
                          onBlur={(e) => {
                            // Format the MAC address with colons on blur
                            const value = e.target.value.replace(/[^0-9A-F]/g, '');
                            if (value.length === 12) {
                              const formatted = value.match(/.{1,2}/g).join(':');
                              setNewDevice({...newDevice, macAddress: formatted});
                            }
                          }}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                          placeholder="00:1A:2B:3C:4D:58"
                          pattern="^([0-9A-Fa-f]{2}[:]){5}([0-9A-Fa-f]{2})$"
                          title="Please enter a valid MAC address (e.g., 00:1A:2B:3C:4D:58)"
                        />
                      </div>
                      
                      {submitError && (
                        <div className="text-red-500 text-sm mt-2">
                          {submitError}
                        </div>
                      )}
                      
                      <div className="flex justify-end space-x-3 pt-4">
                        <button
                          type="button"
                          onClick={() => {
                            setShowAddDeviceModal(false);
                            setNewDevice({ name: '', macAddress: '' });
                            setSubmitError('');
                          }}
                          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          disabled={loading}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={loading || !newDevice.name || !newDevice.macAddress}
                        >
                          {loading ? 'Adding...' : 'Add Device'}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default withAuth(DashboardPage);