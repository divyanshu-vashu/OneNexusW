// // hooks/useDevices.js
// import { useState, useCallback, useEffect } from 'react';
// import {
//   getDevices as getDevicesApi,
//   addDevice as addDeviceApi,
//   updateDevice as updateDeviceApi,
//   getPortsForDevice as getPortsForDeviceApi,
//   addPortToDevice as addPortToDeviceApi,
//   getPinStatus as getPinStatusApi,
//   togglePinStatus as togglePinStatusApi,
//   getSchedules as getSchedulesApi,
//   createSchedule as createScheduleApi,
//   deleteSchedule as deleteScheduleApi,
// } from '@/lib/deviceApi';

// // Helper to ensure MAC address is always in the clean, uppercase, colon-less format for API calls.
// const normalizeMacAddress = (macAddress) => {
//   if (!macAddress) return '';
//   return macAddress.replace(/:/g, '').toUpperCase();
// };

// export function useDevices() {
//   const [devices, setDevices] = useState([]);
//   const [schedules, setSchedules] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const clearError = useCallback(() => setError(null), []);

//   const fetchDevices = useCallback(async () => {
//     try {
//       setLoading(true);
//       clearError();
//       console.log('Fetching devices...');
//       const response = await getDevicesApi();
//       console.log('Devices API response:', response);
//       setDevices(response.data?.data || []);
//       return { success: true };
//     } catch (err) {
//       const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch devices';
//       console.error('Error fetching devices:', {
//         error: err,
//         response: err.response,
//         message: errorMessage
//       });
//       setError(errorMessage);
//       return { success: false, error: errorMessage };
//     } finally {
//       setLoading(false);
//     }
//   }, [clearError]);

//   const addDevice = useCallback(async (macAddress, name) => {
//     try {
//       setLoading(true);
//       clearError();
      
//       // Input validation
//       if (!macAddress || !name) {
//         const errorMsg = 'Both MAC address and device name are required';
//         setError(errorMsg);
//         return { success: false, error: errorMsg };
//       }
      
//       const normalizedMac = normalizeMacAddress(macAddress);
//       console.log('Adding device with:', { normalizedMac, name });
      
//       try {
//         const response = await addDeviceApi(normalizedMac, name);
//         console.log('Add device response:', response.data);
        
//         if (!response.data?.data) {
//           throw new Error('Invalid response format from server');
//         }
        
//         // Update local state with the new device
//         setDevices(prevDevices => [...prevDevices, response.data.data]);
        
//         return { success: true, data: response.data.data };
//       } catch (apiError) {
//         // The error has already been processed by the interceptor
//         // Just re-throw it to be handled by the outer catch
//         throw apiError;
//       }
      
//     } catch (err) {
//       // The error message has already been set by the interceptor
//       // Just ensure it's displayed to the user
//       setError(err.message);
      
//       return { 
//         success: false, 
//         error: err.message,
//         validationErrors: err.validationErrors
//       };
//     } finally {
//       setLoading(false);
//     }
//   }, [clearError]);

//   const updateDevice = useCallback(async (macAddress, name) => {
//     // ... (This function is good, no changes needed)
//   }, [clearError, fetchDevices]);

//   const fetchPortsForDevice = useCallback(async (macAddress) => {
//     // ... (This function is good, but let's ensure normalization)
//     try {
//       setLoading(true);
//       clearError();
//       const normalizedMac = normalizeMacAddress(macAddress);
//       const response = await getPortsForDeviceApi(normalizedMac);
//       return { success: true, ports: response.data?.data || [] };
//     } catch (err) {
//       // ... error handling
//     } finally {
//       setLoading(false);
//     }
//   }, [clearError]);

//   const addPort = useCallback(async (macAddress, pin, name) => {
//     // ... (This function seems okay, but let's ensure normalization)
//     try {
//       setLoading(true);
//       clearError();
//       const normalizedMac = normalizeMacAddress(macAddress);
//       const response = await addPortToDeviceApi(normalizedMac, name, pin);
//       // ...
//     } catch (err) {
//       // ...
//     } finally {
//       setLoading(false);
//     }
//   }, [clearError]);

//   // --- THIS IS THE FIX ---
//   // We remove the duplicate 'fetchPinStatus' and keep only 'getPinState' for consistency.
//   const getPinState = useCallback(async (macAddress, pin) => {
//     try {
//       clearError();
//       const normalizedMac = normalizeMacAddress(macAddress);
//       // Call the API function which is named getPinStatusApi
//       const response = await getPinStatusApi(normalizedMac, pin);
//       // Return the entire data object which might contain more than just status
//       return { success: true, data: response.data?.data };
//     } catch (err) {
//       const errorMsg = err.response?.data?.message || err.message || `Failed to get state for pin ${pin}`;
//       setError(errorMsg);
//       console.error('Error getting pin state:', err);
//       return { success: false, error: errorMsg };
//     }
//   }, [clearError]);
//   // --- END OF FIX ---

//   const togglePinState = useCallback(async (macAddress, pin) => {
//     try {
//       setLoading(true);
//       clearError();
//       const normalizedMac = normalizeMacAddress(macAddress);
//       // Call the toggle endpoint
//       const response = await togglePinStatusApi(normalizedMac, pin, 'toggle');
//       // The API should return the new state in the response
//       const newState = response.data?.status;
//       return { success: true, newState };
//     } catch (err) {
//       const errorMsg = err.response?.data?.message || err.message || 'Failed to toggle pin state';
//       setError(errorMsg);
//       console.error('Error toggling pin state:', err);
//       return { success: false, error: errorMsg };
//     } finally {
//       setLoading(false);
//     }
//   }, [clearError]);

//   const fetchSchedules = useCallback(async () => {
    
//   }, [clearError]);

//   const createSchedule = useCallback(async (scheduleData) => {

//   }, [clearError, fetchSchedules]);

//   const deleteSchedule = useCallback(async (scheduleId) => {
    
//   }, [clearError, fetchSchedules]);

 
//   useEffect(() => {
//     fetchDevices();
//   }, [fetchDevices]);

//   return {

//     devices,
//     schedules,
//     loading,
//     error,

//     // Device operations
//     fetchDevices,
//     addDevice,
//     updateDevice,

//     // Port operations
//     fetchPortsForDevice,
//     addPort,

//     // --- MAKE SURE THE EXPORTED NAME MATCHES THE FUNCTION NAME ---
//     // Pin operations
//     getPinState,
//     togglePinState,
//     // --- END OF FIX ---

//     // Schedule operations
//     fetchSchedules,
//     createSchedule,
//     deleteSchedule,

//     // Utility
//     clearError,
//   };
// }


// hooks/useDevices.js
import { useState, useCallback, useEffect } from 'react';
import {
  getDevices as getDevicesApi,
  addDevice as addDeviceApi,
  updateDevice as updateDeviceApi,
  getPortsForDevice as getPortsForDeviceApi,
  addPortToDevice as addPortToDeviceApi,
  getPinStatus as getPinStatusApi,
  togglePinStatus as togglePinStatusApi,
  getSchedules as getSchedulesApi,
  createSchedule as createScheduleApi,
  deleteSchedule as deleteScheduleApi,
} from '@/lib/deviceApi';

// Normalize MAC address: remove colons, uppercase
const normalizeMacAddress = (macAddress) => {
  if (!macAddress) return '';
  return macAddress.replace(/:/g, '').toUpperCase();
};

export function useDevices() {
  const [devices, setDevices] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const clearError = useCallback(() => setError(null), []);

  // Fetch all devices
  const fetchDevices = useCallback(async () => {
    try {
      setLoading(true);
      clearError();
      const response = await getDevicesApi();
      setDevices(response.data?.data || []);
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch devices';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [clearError]);

  // Add a device
  const addDevice = useCallback(async (macAddress, name) => {
    try {
      setLoading(true);
      clearError();
      if (!macAddress || !name) {
        const errorMsg = 'Both MAC address and device name are required';
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }

      const normalizedMac = normalizeMacAddress(macAddress);
      const response = await addDeviceApi(normalizedMac, name.trim());
      if (!response.data?.data) {
        throw new Error('Invalid response from server');
      }
      setDevices(prev => [...prev, response.data.data]);
      return { success: true, data: response.data.data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [clearError]);

  // Update device
  const updateDevice = useCallback(async (macAddress, name) => {
    try {
      setLoading(true);
      clearError();
      const normalizedMac = normalizeMacAddress(macAddress);
      await updateDeviceApi(normalizedMac, name.trim());
      await fetchDevices(); // refresh list
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update device';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [clearError, fetchDevices]);

  // Fetch ports for a device
  const fetchPortsForDevice = useCallback(async (macAddress) => {
    try {
      setLoading(true);
      clearError();
      const normalizedMac = normalizeMacAddress(macAddress);
      const response = await getPortsForDeviceApi(normalizedMac);
      return { success: true, ports: response.data?.data || [] };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch ports';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [clearError]);

  // Add a port to a device
  const addPort = useCallback(async (macAddress, name, pin) => {
    try {
      setLoading(true);
      clearError();
      const normalizedMac = normalizeMacAddress(macAddress);

      const pinNumber = Number(pin);
      if (isNaN(pinNumber)) {
        throw new Error('Pin must be a number');
      }

      await addPortToDeviceApi(normalizedMac, name.trim(), pinNumber);
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to add port';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [clearError]);

  // Get pin state
  const getPinState = useCallback(async (macAddress, pin) => {
    try {
      clearError();
      const normalizedMac = normalizeMacAddress(macAddress);
      const response = await getPinStatusApi(normalizedMac, pin);
      return { success: true, data: response.data?.data };
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || `Failed to get state for pin ${pin}`;
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  }, [clearError]);

  // Toggle pin state
  const togglePinState = useCallback(async (macAddress, pin) => {
    try {
      setLoading(true);
      clearError();
      const normalizedMac = normalizeMacAddress(macAddress);
      await togglePinStatusApi(normalizedMac, pin, 'toggle');
      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to toggle pin state';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, [clearError]);

  // Fetch schedules
  const fetchSchedules = useCallback(async () => {
    try {
      setLoading(true);
      clearError();
      const response = await getSchedulesApi();
      setSchedules(response.data?.data || []);
      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to fetch schedules';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, [clearError]);

  // Create schedule
  const createSchedule = useCallback(async (scheduleData) => {
    try {
      setLoading(true);
      clearError();
      await createScheduleApi(scheduleData);
      await fetchSchedules();
      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to create schedule';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, [clearError, fetchSchedules]);

  // Delete schedule
  const deleteSchedule = useCallback(async (scheduleId) => {
    try {
      setLoading(true);
      clearError();
      await deleteScheduleApi(scheduleId);
      await fetchSchedules();
      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to delete schedule';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, [clearError, fetchSchedules]);

  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  return {
    devices,
    schedules,
    loading,
    error,

    // Device operations
    fetchDevices,
    addDevice,
    updateDevice,

    // Port operations
    fetchPortsForDevice,
    addPort,

    // Pin operations
    getPinState,
    togglePinState,

    // Schedule operations
    fetchSchedules,
    createSchedule,
    deleteSchedule,

    // Utility
    clearError,
  };
}
