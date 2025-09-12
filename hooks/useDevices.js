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

// Helper to ensure MAC address is always in the clean, uppercase, colon-less format for API calls.
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

  const fetchDevices = useCallback(async () => {
    // ... (This function is good, no changes needed)
  }, [clearError]);

  const addDevice = useCallback(async (macAddress, name) => {
    // ... (This function is good, no changes needed)
  }, [clearError, fetchDevices]);

  const updateDevice = useCallback(async (macAddress, name) => {
    // ... (This function is good, no changes needed)
  }, [clearError, fetchDevices]);

  const fetchPortsForDevice = useCallback(async (macAddress) => {
    // ... (This function is good, but let's ensure normalization)
    try {
      setLoading(true);
      clearError();
      const normalizedMac = normalizeMacAddress(macAddress);
      const response = await getPortsForDeviceApi(normalizedMac);
      return { success: true, ports: response.data?.data || [] };
    } catch (err) {
      // ... error handling
    } finally {
      setLoading(false);
    }
  }, [clearError]);

  const addPort = useCallback(async (macAddress, pin, name) => {
    // ... (This function seems okay, but let's ensure normalization)
    try {
      setLoading(true);
      clearError();
      const normalizedMac = normalizeMacAddress(macAddress);
      const response = await addPortToDeviceApi(normalizedMac, name, pin);
      // ...
    } catch (err) {
      // ...
    } finally {
      setLoading(false);
    }
  }, [clearError]);

  // --- THIS IS THE FIX ---
  // We remove the duplicate 'fetchPinStatus' and keep only 'getPinState' for consistency.
  const getPinState = useCallback(async (macAddress, pin) => {
    try {
      clearError();
      const normalizedMac = normalizeMacAddress(macAddress);
      // Call the API function which is named getPinStatusApi
      const response = await getPinStatusApi(normalizedMac, pin);
      // Return the entire data object which might contain more than just status
      return { success: true, data: response.data?.data };
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || `Failed to get state for pin ${pin}`;
      setError(errorMsg);
      console.error('Error getting pin state:', err);
      return { success: false, error: errorMsg };
    }
  }, [clearError]);
  // --- END OF FIX ---

  const togglePinState = useCallback(async (macAddress, pin) => {
    try {
      setLoading(true);
      clearError();
      const normalizedMac = normalizeMacAddress(macAddress);
      // Call the toggle endpoint
      const response = await togglePinStatusApi(normalizedMac, pin, 'toggle');
      // The API should return the new state in the response
      const newState = response.data?.status;
      return { success: true, newState };
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to toggle pin state';
      setError(errorMsg);
      console.error('Error toggling pin state:', err);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, [clearError]);

  const fetchSchedules = useCallback(async () => {
    
  }, [clearError]);

  const createSchedule = useCallback(async (scheduleData) => {

  }, [clearError, fetchSchedules]);

  const deleteSchedule = useCallback(async (scheduleId) => {
    
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

    // --- MAKE SURE THE EXPORTED NAME MATCHES THE FUNCTION NAME ---
    // Pin operations
    getPinState,
    togglePinState,
    // --- END OF FIX ---

    // Schedule operations
    fetchSchedules,
    createSchedule,
    deleteSchedule,

    // Utility
    clearError,
  };
}