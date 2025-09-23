// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import withAuth from "../../lib/withAuth";
// import { useDevices } from "../../hooks/useDevices";
// import axios from "axios";

// function DashboardPage() {
//   const router = useRouter();
//   const [expandedDevice, setExpandedDevice] = useState(null);
//   const [showAddDeviceModal, setShowAddDeviceModal] = useState(false);
//   const [newDevice, setNewDevice] = useState({ name: "", macAddress: "" });
//   const [submitError, setSubmitError] = useState("");
//   const { devices, loading, error, fetchDevices, addDevice } = useDevices();

//   // Header / Home-like state extracted from your homepage
//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   useEffect(() => {
//     fetchDevices();
//   }, []);

//   const toggleDevice = (deviceId) => {
//     setExpandedDevice(expandedDevice === deviceId ? null : deviceId);
//   };

//   const handleAddPort = async (e, macAddress) => {
//     e.stopPropagation();
//     router.push(`/device/${macAddress}?name=${encodeURIComponent("New Device")}`);
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   const handleAddDevice = async (e) => {
//     e.preventDefault();
//     setSubmitError("");

//     try {
//       const result = await addDevice(newDevice.macAddress, newDevice.name);

//       if (result.success) {
//         setShowAddDeviceModal(false);
//         setNewDevice({ name: "", macAddress: "" });
//       } else {
//         console.error("Failed to add device:", result.error);
//       }
//     } catch (err) {
//       console.error("Unexpected error adding device:", err);
//       setSubmitError(err.message || "An unexpected error occurred");
//     }
//   };

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-red-500">Error: {error}</div>
//       </div>
//     );
//   }

//   // Sign-out handler used in the header
//   const handleSignOut = async () => {
//     try {
//       await axios.post("/api/auth/signout");
//     } catch (err) {
//       console.error("Sign out failed", err);
//     } finally {
//       router.push("/login");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Inline header styles copied from your home page (only header / nav related rules) */}
//       <style>{`
//         /* Header / nav styles (copied from your home page CSS) */
//         #scroll-progress {
//           position: fixed;
//           top: 0;
//           left: 0;
//           height: 4px;
//           background: linear-gradient(to right, #3b82f6, #06b6d4);
//           width: 0;
//           z-index: 50;
//           transition: width 0.1s ease;
//         }
//         .header {
//           position: fixed;
//           top: 0;
//           left: 0;
//           right: 0;
//           background: rgba(255, 255, 255, 0.95);
//           backdrop-filter: blur(10px);
//           border-bottom: 1px solid rgba(229, 231, 235, 0.5);
//           z-index: 40;
//           padding: 0.75rem 1.5rem;
//           transition: all 0.3s ease;
//           width: 100vw;
//           overflow: hidden;
//         }
//         .header-container {
//           max-width: 100%;
//           width: 100%;
//           margin: 0 auto;
//           display: flex;
//           align-items: center;
//           justify-content: space-between;
//           padding: 0 1rem;
//           box-sizing: border-box;
//         }
//         .logo {
//           display: flex;
//           align-items: center;
//           gap: 0.75rem;
//           text-decoration: none;
//           color: #1f2937;
//           font-weight: 800;
//           font-size: 1.5rem;
//           transition: color 0.3s ease;
//         }
//         .logo:hover { color: #2563eb; }
//         .logo-icon {
//           width: 2.5rem;
//           height: 2.5rem;
//           background: linear-gradient(to right, #3b82f6, #06b6d4);
//           border-radius: 0.5rem;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           color: white;
//           font-weight: 700;
//         }
//         .nav-desktop { display: none; align-items: center; gap: 2rem; }
//         @media (min-width: 1024px) { .nav-desktop { display: flex; } }
//         .nav-link {
//           color: #374151;
//           text-decoration: none;
//           font-weight: 500;
//           padding: 0.5rem 1rem;
//           border-radius: 0.5rem;
//           transition: all 0.3s ease;
//         }
//         .nav-link:hover { color: #2563eb; background-color: #f3f4f6; }
//         .nav-buttons { display: none; align-items: center; gap: 1rem; }
//         @media (min-width: 1024px) { .nav-buttons { display: flex; } }
//         .header-btn {
//           padding: 0.5rem 1rem;
//           border-radius: 0.5rem;
//           font-weight: 600;
//           text-decoration: none;
//           transition: all 0.3s ease;
//           border: none;
//           cursor: pointer;
//         }
//         .btn-login { color: #374151; background: transparent; }
//         .btn-login:hover { background-color: #f3f4f6; }
//         .btn-register { color: white; background-color: #2563eb; }
//         .btn-register:hover { background-color: #1d4ed8; }
//         .btn-buy { color: white; background: linear-gradient(to right, #16a34a, #059669); }
//         .btn-buy:hover { background: linear-gradient(to right, #15803d, #047857); }
//         .mobile-menu-btn {
//           display: block;
//           background: none;
//           border: none;
//           padding: 0.5rem;
//           cursor: pointer;
//         }
//         @media (min-width: 1024px) { .mobile-menu-btn { display: none; } }
//         .mobile-menu {
//           position: absolute;
//           top: 100%;
//           left: 0;
//           right: 0;
//           background: white;
//           border-bottom: 1px solid rgba(229, 231, 235, 0.5);
//           box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
//           display: none;
//           padding: 1rem;
//         }
//         .mobile-menu.open { display: block; }
//         .mobile-nav-links { display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1rem; }
//         .mobile-nav-buttons { display: flex; flex-direction: column; gap: 0.5rem; }
//       `}</style>

//       {/* Scroll progress (header expects this element) */}
//       <div id="scroll-progress" />

//       {/* === Header copied from your home page but with requested items commented out and Logout added === */}
//       <header className="header">
//         <div className="header-container">
//           <Link href="/" className="logo">
//             <img src="/assets/images/Nlogo.png" alt="SmartRemote Logo" style={{ height: "40px" }} />
//           </Link>

//           <nav className="nav-desktop">
//             {/* Features, How It Works, Specifications and Support are commented out as requested */}
//             {/*
//             <Link href="#features" className="nav-link">Features</Link>
//             <Link href="#how-it-works" className="nav-link">How It Works</Link>
//             <Link href="#specs" className="nav-link">Specifications</Link>
//             <Link href="/support" className="nav-link">Support</Link>
//             */}
//           </nav>

//           <div className="nav-buttons">
//             {/* Login, Register and Buy Now commented out. Replaced with Logout button */}
//             {/*
//             <Link href="/login" className="header-btn btn-login">Login</Link>
//             <Link href="/register" className="header-btn btn-register">Register</Link>
//             <Link href="/shop" className="header-btn btn-buy">Buy Now</Link>
//             */}
//             <button
//               onClick={handleSignOut}
//               className="header-btn btn-register"
//               title="Logout"
//             >
//               Logout
//             </button>
//           </div>

//           <button
//             className="mobile-menu-btn"
//             onClick={() => setIsMenuOpen(!isMenuOpen)}
//             aria-label="Toggle menu"
//           >
//             <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//             </svg>
//           </button>

//           <div className={`mobile-menu ${isMenuOpen ? "open" : ""}`}>
//             <div className="mobile-nav-links">
//               {/* mobile nav links commented out as requested */}
//               {/*
//               <Link href="#features" className="nav-link">Features</Link>
//               <Link href="#how-it-works" className="nav-link">How It Works</Link>
//               <Link href="#specs" className="nav-link">Specifications</Link>
//               <Link href="/support" className="nav-link">Support</Link>
//               */}
//             </div>
//             <div className="mobile-nav-buttons">
//               {/* mobile buttons: Login/Register/Buy removed; only Logout remains */}
//               <button onClick={handleSignOut} className="header-btn btn-register">Logout</button>
//             </div>
//           </div>
//         </div>
//       </header>
//       {/* === End header === */}

//       {/* Page content container (moved down visually because header is fixed) */}
//       <div className="max-w-7xl mx-auto p-6" style={{ paddingTop: "5.25rem" }}>
//         <h1 className="text-3xl font-bold text-gray-900 mb-8">My Devices</h1>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {/* Add Device Card */}
//           <div
//             className="bg-white rounded-xl shadow-md overflow-hidden border-2 border-dashed border-gray-300 hover:border-blue-500 transition-colors cursor-pointer flex items-center justify-center min-h-[180px]"
//             onClick={() => setShowAddDeviceModal(true)}
//           >
//             <div className="text-center p-6">
//               <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
//               </svg>
//               <h3 className="mt-2 text-sm font-medium text-gray-900">Add New Device</h3>
//               <p className="mt-1 text-sm text-gray-500">Click to register a new device</p>
//             </div>
//           </div>

//           {/* Existing Devices */}
//           {devices.map((device) => (
//             <div key={device._id} className="bg-white rounded-xl shadow-md overflow-hidden">
//               <div
//                 className="p-6 cursor-pointer flex justify-between items-center"
//                 onClick={() => toggleDevice(device._id)}
//               >
//                 <div>
//                   <h2 className="text-xl font-semibold text-gray-800">{device.name}</h2>
//                   <p className="text-sm text-gray-500 mt-1">{device.macAddress}</p>
//                 </div>
//                 <svg
//                   className={`w-5 h-5 text-gray-500 transform transition-transform ${
//                     expandedDevice === device._id ? "rotate-180" : ""
//                   }`}
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                 </svg>
//               </div>

//               <div className="border-t border-gray-200 p-4">
//                 {expandedDevice === device._id && (
//                   <div className="mb-4">
//                     {device.switches && device.switches.length > 0 ? (
//                       <ul className="space-y-3">
//                         {device.switches.map((port) => (
//                           <li key={port._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
//                             <div>
//                               <p className="font-medium text-gray-800">{port.name}</p>
//                               <p className="text-sm text-gray-500">Pin {port.pin}</p>
//                             </div>
//                             <span
//                               className={`px-3 py-1 text-sm rounded-full ${
//                                 port.status ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
//                               }`}
//                             >
//                               {port.status ? "ON" : "OFF"}
//                             </span>
//                           </li>
//                         ))}
//                       </ul>
//                     ) : (
//                       <div
//                         className="flex items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
//                         onClick={(e) => handleAddPort(e, device.macSymbolId || device.macAddress)}
//                       >
//                         <div className="text-center">
//                           <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
//                             <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//                             </svg>
//                           </div>
//                           <h3 className="mt-2 text-sm font-medium text-gray-900">No ports</h3>
//                           <p className="mt-1 text-sm text-gray-500">Click to add a new port</p>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 )}

//                 <div className="flex justify-between items-center">
//                   <button onClick={() => toggleDevice(device._id)} className="text-sm text-gray-500 hover:text-gray-700">
//                     {expandedDevice === device._id ? "Hide ports" : "Show ports"}
//                   </button>
//                   <Link
//                     href={`/device/${device.macSymbolId || device.macAddress}`}
//                     className="text-sm font-medium text-blue-600 hover:text-blue-500"
//                   >
//                     Manage Device →
//                   </Link>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Add Device Modal */}
//         {showAddDeviceModal && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//             <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
//               <div className="p-6">
//                 <div className="flex justify-between items-center mb-4">
//                   <h2 className="text-xl font-semibold text-gray-900">Add New Device</h2>
//                   <button
//                     onClick={() => {
//                       setShowAddDeviceModal(false);
//                       setNewDevice({ name: "", macAddress: "" });
//                       setSubmitError("");
//                     }}
//                     className="text-gray-400 hover:text-gray-500"
//                   >
//                     <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                     </svg>
//                   </button>
//                 </div>

//                 <form onSubmit={handleAddDevice}>
//                   <div className="space-y-4">
//                     <div>
//                       <label htmlFor="deviceName" className="block text-sm font-medium text-gray-700">
//                         Device Name
//                       </label>
//                       <input
//                         type="text"
//                         id="deviceName"
//                         required
//                         value={newDevice.name}
//                         onChange={(e) => setNewDevice({ ...newDevice, name: e.target.value })}
//                         className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
//                         placeholder="e.g., Living Room Light"
//                       />
//                     </div>

//                     <div>
//                       <label htmlFor="macAddress" className="block text-sm font-medium text-gray-700">
//                         MAC Address
//                       </label>
//                       <input
//                         type="text"
//                         id="macAddress"
//                         required
//                         value={newDevice.macAddress}
//                         onChange={(e) => {
//                           const value = e.target.value.toUpperCase();
//                           const cleanValue = value.replace(/[^0-9A-F:]/g, "");
//                           setNewDevice({ ...newDevice, macAddress: cleanValue });
//                         }}
//                         onBlur={(e) => {
//                           const value = e.target.value.replace(/[^0-9A-F]/g, "");
//                           if (value.length === 12) {
//                             const formatted = value.match(/.{1,2}/g).join(":");
//                             setNewDevice({ ...newDevice, macAddress: formatted });
//                           }
//                         }}
//                         className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
//                         placeholder="00:1A:2B:3C:4D:58"
//                         pattern="^([0-9A-Fa-f]{2}[:]){5}([0-9A-Fa-f]{2})$"
//                         title="Please enter a valid MAC address (e.g., 00:1A:2B:3C:4D:58)"
//                       />
//                     </div>

//                     {submitError && <div className="text-red-500 text-sm mt-2">{submitError}</div>}

//                     <div className="flex justify-end space-x-3 pt-4">
//                       <button
//                         type="button"
//                         onClick={() => {
//                           setShowAddDeviceModal(false);
//                           setNewDevice({ name: "", macAddress: "" });
//                           setSubmitError("");
//                         }}
//                         className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                         disabled={loading}
//                       >
//                         Cancel
//                       </button>
//                       <button
//                         type="submit"
//                         className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
//                         disabled={loading || !newDevice.name || !newDevice.macAddress}
//                       >
//                         {loading ? "Adding..." : "Add Device"}
//                       </button>
//                     </div>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default withAuth(DashboardPage);

"use client";
import Image from 'next/image';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import withAuth from "../../lib/withAuth";
import { useDevices } from "../../hooks/useDevices";
import axios from "axios";

function DashboardPage() {
  const router = useRouter();
  const [expandedDevice, setExpandedDevice] = useState(null);
  const [showAddDeviceModal, setShowAddDeviceModal] = useState(false);
  const [newDevice, setNewDevice] = useState({ name: "", macAddress: "" });
  const [submitError, setSubmitError] = useState("");
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

  // Now accepts macAddress and optional deviceName so we can forward the name in the query param
  const handleAddPort = async (e, macAddress, deviceName = "") => {
    e.stopPropagation();
    const nameParam = deviceName ? `?name=${encodeURIComponent(deviceName)}` : "";
    router.push(`/device/${macAddress}${nameParam}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-transparent border-blue-500"></div>
      </div>
    );
  }

  const handleAddDevice = async (e) => {
    e.preventDefault();
    setSubmitError("");

    try {
      const result = await addDevice(newDevice.macAddress, newDevice.name);

      if (result.success) {
        setShowAddDeviceModal(false);
        setNewDevice({ name: "", macAddress: "" });
        if (fetchDevices) await fetchDevices();
      } else {
        console.error("Failed to add device:", result.error);
      }
    } catch (err) {
      console.error("Unexpected error adding device:", err);
      setSubmitError(err.message || "An unexpected error occurred");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  // Sign-out handler (single logout button)
  const handleSignOut = async () => {
    try {
      await axios.post("/api/auth/signout");
    } catch (err) {
      console.error("Sign out failed", err);
    } finally {
      router.push("/login");
    }
  };

  // Delete device handler
  const handleDeleteDevice = async (e, deviceId) => {
    e.stopPropagation();
    const confirmed = confirm("Delete this device? This action cannot be undone.");
    if (!confirmed) return;

    try {
      await axios.delete(`/api/devices/${deviceId}`);
      if (fetchDevices) await fetchDevices();
    } catch (err) {
      console.error("Failed to delete device:", err);
      alert("Failed to delete device. See console for details.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <style>{`
        /* header & progress */
        #scroll-progress {
          position: fixed;
          top: 0;
          left: 0;
          height: 4px;
          background: linear-gradient(90deg, #3b82f6, #06b6d4);
          width: 0;
          z-index: 60;
          transition: width 0.12s linear;
        }
        .header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background: rgba(255,255,255,0.88);
          backdrop-filter: blur(8px);
          border-bottom: 1px solid rgba(229,231,235,0.6);
          z-index: 50;
          padding: 0.6rem 1rem;
        }
        .header-container {
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:1rem;
          max-width:1200px;
          margin:0 auto;
        }
        .logo img { height:40px; display:block; }

        /* card styles */
        .device-card {
          position: relative;
          overflow: hidden;
          border-radius: 1rem;
          transition: transform 220ms cubic-bezier(.2,.9,.2,1), box-shadow 220ms ease, border-color 220ms ease;
          background: linear-gradient(180deg, rgba(255,255,255,0.75), rgba(255,255,255,0.6));
          border: 1px solid rgba(226,232,240,0.6);
          box-shadow: 0 6px 18px rgba(15,23,42,0.06);
        }
        .device-card:hover {
          transform: translateY(-8px) scale(1.01);
          box-shadow: 0 18px 40px rgba(15,23,42,0.12);
          border-color: rgba(99,102,241,0.22);
        }
        .device-top {
          display:flex;
          align-items:center;
          gap:1rem;
          padding:1.25rem;
          background: linear-gradient(90deg, rgba(59,130,246,0.05), rgba(6,182,212,0.03));
        }
        .device-avatar {
          width:56px;
          height:56px;
          border-radius:12px;
          background: linear-gradient(135deg, #3b82f6, #06b6d4);
          display:flex;
          align-items:center;
          justify-content:center;
          color:white;
          font-weight:700;
          font-size:18px;
          flex-shrink:0;
        }
        .device-title { font-size:1.125rem; font-weight:700; color:#0f172a; margin:0; letter-spacing:-0.2px; }
        .device-sub { font-size:0.875rem; color:#6b7280; margin-top:3px; }
        .device-body { padding:1rem 1.25rem 1.25rem 1.25rem; }
        .port-item {
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:1rem;
          padding:0.75rem;
          background: linear-gradient(180deg, rgba(248,250,252,1), rgba(248,250,252,0.95));
          border-radius:0.75rem;
          border:1px solid rgba(229,231,235,0.7);
        }
        .port-item + .port-item { margin-top:0.75rem; }
        .no-ports {
          padding:1.25rem;
          border:2px dashed rgba(203,213,225,0.6);
          border-radius:0.75rem;
          text-align:center;
          color:#475569;
          transition: background 180ms ease;
        }
        .no-ports:hover { background: rgba(243,244,246,0.9); cursor:pointer; }
        .status-pill {
          padding:0.25rem 0.6rem;
          border-radius:999px;
          font-size:0.75rem;
          font-weight:600;
        }
        .status-on { background: rgba(16,185,129,0.12); color: #065f46; }
        .status-off { background: rgba(107,114,128,0.08); color: #374151; }

        .add-card {
          min-height:180px;
          display:flex;
          align-items:center;
          justify-content:center;
          border-radius:1rem;
          border:2px dashed rgba(209,213,219,0.7);
          background: linear-gradient(180deg, rgba(255,255,255,0.8), rgba(250,250,250,0.85));
          transition: transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease;
        }
        .add-card:hover {
          transform: translateY(-6px);
          border-color: rgba(59,130,246,0.45);
          box-shadow: 0 8px 30px rgba(59,130,246,0.06);
          cursor:pointer;
        }

        .modal-backdrop { background: rgba(2,6,23,0.6); }
        .modal-card { border-radius: 0.75rem; box-shadow: 0 18px 40px rgba(2,6,23,0.35); overflow:hidden; }
        .input-field { width:100%; padding:0.6rem 0.75rem; border-radius:0.5rem; border:1px solid rgba(226,232,240,0.8); }
        .btn-primary {
          background: linear-gradient(90deg,#2563eb,#06b6d4);
          color: white;
          padding: 0.6rem 1rem;
          border-radius:0.6rem;
          font-weight:700;
          box-shadow: 0 10px 20px rgba(37,99,235,0.12);
        }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 20px 30px rgba(37,99,235,0.14); }

        /* delete button */
        .delete-btn {
          background: transparent;
          border: none;
          padding: 6px;
          border-radius: 8px;
          display: inline-flex;
          align-items:center;
          justify-content:center;
          cursor: pointer;
          transition: background 120ms ease;
        }
        .delete-btn:hover { background: rgba(239,68,68,0.08); }

        /* keep logout visible on all sizes */
        .logout-btn {
          display: inline-flex;
          align-items:center;
          gap:0.5rem;
          padding: 0.45rem 0.85rem;
          border-radius: 0.6rem;
          background: linear-gradient(90deg,#ef4444,#ef4444);
          color: white;
          font-weight:700;
          border:none;
          cursor:pointer;
          box-shadow: 0 6px 18px rgba(239,68,68,0.12);
        }
        @media (max-width: 420px) {
          .logout-btn { padding: 0.35rem 0.6rem; font-size: 0.9rem; }
        }
      `}</style>

      <div id="scroll-progress" />

      {/* Header — only the logo and a single Logout button (no menu/hamburger) */}
      <header className="header">
        <div className="header-container">
          <Link href="/" className="logo" aria-label="Home">
            <img src="/assets/images/Nlogo.png" alt="SmartRemote Logo" />
          </Link>

          {/* Single Logout button visible on all screen sizes */}
          <div>
            <button onClick={handleSignOut} className="logout-btn" title="Logout">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <path d="M16 17l5-5-5-5"></path>
                <path d="M21 12H9"></path>
              </svg>
              <span style={{ lineHeight: 1 }}>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Content (pushed down because header is fixed) */}
      <div className="max-w-7xl mx-auto p-6" style={{ paddingTop: "5.25rem" }}>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">My Devices</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Add Device Card */}
          <div
            className="add-card"
            onClick={() => setShowAddDeviceModal(true)}
            role="button"
            aria-label="Add new device"
          >
            <div className="text-center p-6">
              <div style={{ width: 64, height: 64, borderRadius: 14, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg,#e0f2fe,#d1fae5)" }}>
                <svg className="h-8 w-8 text-blue-600" viewBox="0 0 24 24" fill="none">
                  <path d="M12 4v16m8-8H4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="mt-4 text-base font-semibold text-gray-900">Add New Device</h3>
              <p className="mt-2 text-sm text-gray-500">Register a device to manage it here</p>
            </div>
          </div>

          {/* Device cards */}
          {devices.map((device) => {
            const macKey = device.macSymbolId || device.macAddress;
            const nameParam = device.name ? `?name=${encodeURIComponent(device.name)}` : "";
            return (
              <div key={device._id} className="device-card">
                <div className="device-top" onClick={() => toggleDevice(device._id)} style={{ cursor: "pointer" }}>
                  <div className="device-avatar" aria-hidden>
                    {device.name && device.name.length > 0
                      ? device.name.slice(0, 2).toUpperCase()
                      : (device.macAddress ? device.macAddress.slice(-2) : "DV")}
                  </div>

                  <div style={{ flex: 1 }}>
                    <h2 className="device-title">{device.name || "Unnamed Device"}</h2>

                    {/* Show MAC only when name is not present */}
                    {!device.name && device.macAddress && (
                      <p className="device-sub" title={device.macAddress}>
                        {device.macAddress}
                      </p>
                    )}

                    {device.name && <p className="device-sub">Registered device</p>}
                  </div>

                  <div style={{ display: "flex", gap: 8, alignItems: "center", marginLeft: "auto" }}>
                    {/* Toggle button */}
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleDevice(device._id); }}
                      className="text-sm"
                      aria-label="Toggle ports"
                      style={{ background: "transparent", border: "none", cursor: "pointer" }}
                    >
                      <svg
                        className={`w-5 h-5 text-gray-500 transform ${expandedDevice === device._id ? "rotate-180" : ""}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        style={{ transition: "transform 200ms ease" }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Delete button */}
                    <button
                      onClick={(e) => handleDeleteDevice(e, device._id)}
                      className="delete-btn"
                      title="Delete device"
                      aria-label="Delete device"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>
                        <path d="M10 11v6"></path>
                        <path d="M14 11v6"></path>
                        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path>
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="device-body">
                  {expandedDevice === device._id && (
                    <div className="mb-4">
                      {device.switches && device.switches.length > 0 ? (
                        <ul className="space-y-3">
                          {device.switches.map((port) => (
                            <li key={port._id} className="port-item">
                              <div>
                                <p style={{ margin: 0, fontWeight: 700, color: "#0f172a" }}>{port.name}</p>
                                <p style={{ marginTop: 4, color: "#6b7280", fontSize: 13 }}>Pin {port.pin}</p>
                              </div>
                              <span className={`status-pill ${port.status ? "status-on" : "status-off"}`}>
                                {port.status ? "ON" : "OFF"}
                              </span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div
                          className="no-ports"
                          onClick={(e) => handleAddPort(e, macKey, device.name)}
                          role="button"
                        >
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
                            <div style={{ width: 44, height: 44, borderRadius: 10, background: "linear-gradient(135deg,#eff6ff,#ecfeff)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 6v6m0 0v6m0-6h6m-6 0H6" stroke="#06b6d4" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                              </svg>
                            </div>
                            <div>
                              <h4 style={{ margin: 0, fontWeight: 700, color: "#0f172a" }}>No ports</h4>
                              <p style={{ marginTop: 6, color: "#475569", fontSize: 13 }}>Click to add a new port</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => toggleDevice(device._id)}
                      className="text-sm text-gray-600 hover:text-gray-800"
                    >
                      {expandedDevice === device._id ? "Hide ports" : "Show ports"}
                    </button>

                    {/* Manage Device link now includes the device name in the query param so device page shows name */}
                    <Link
                      href={`/device/${macKey}${nameParam}`}
                      className="text-sm font-semibold"
                      style={{ color: "#2563eb" }}
                    >
                      Manage Device →
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Device Modal */}
        {showAddDeviceModal && (
          <div className="fixed inset-0 flex items-center justify-center modal-backdrop z-50">
            <div className="bg-white w-full max-w-md modal-card">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">Add New Device</h2>
                  <button
                    onClick={() => {
                      setShowAddDeviceModal(false);
                      setNewDevice({ name: "", macAddress: "" });
                      setSubmitError("");
                    }}
                    className="text-gray-400 hover:text-gray-500"
                    aria-label="Close"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleAddDevice}>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="deviceName" className="block text-sm font-medium text-gray-700">Device Name</label>
                      <input
                        type="text"
                        id="deviceName"
                        required
                        value={newDevice.name}
                        onChange={(e) => setNewDevice({ ...newDevice, name: e.target.value })}
                        className="input-field"
                        placeholder="e.g., Living Room Light"
                      />
                    </div>

                    <div>
                      <label htmlFor="macAddress" className="block text-sm font-medium text-gray-700">MAC Address</label>
                      <input
                        type="text"
                        id="macAddress"
                        required
                        value={newDevice.macAddress}
                        onChange={(e) => {
                          const value = e.target.value.toUpperCase();
                          const cleanValue = value.replace(/[^0-9A-F:]/g, "");
                          setNewDevice({ ...newDevice, macAddress: cleanValue });
                        }}
                        onBlur={(e) => {
                          const value = e.target.value.replace(/[^0-9A-F]/g, "");
                          if (value.length === 12) {
                            const formatted = value.match(/.{1,2}/g).join(":");
                            setNewDevice({ ...newDevice, macAddress: formatted });
                          }
                        }}
                        className="input-field"
                        placeholder="00:1A:2B:3C:4D:58"
                        pattern="^([0-9A-Fa-f]{2}[:]){5}([0-9A-Fa-f]{2})$"
                        title="Please enter a valid MAC address (e.g., 00:1A:2B:3C:4D:58)"
                      />
                    </div>

                    {submitError && <div className="text-red-500 text-sm mt-2">{submitError}</div>}

                    <div className="flex justify-end space-x-3 pt-4">
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddDeviceModal(false);
                          setNewDevice({ name: "", macAddress: "" });
                          setSubmitError("");
                        }}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn-primary"
                        disabled={loading || !newDevice.name || !newDevice.macAddress}
                      >
                        {loading ? "Adding..." : "Add Device"}
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
  );
}

export default withAuth(DashboardPage);
