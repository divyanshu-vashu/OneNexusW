// hooks/useDevices.js
import { useState, useEffect, useCallback } from 'react';
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

// Helper function to normalize MAC address to backend format (uppercase, no colons)
const normalizeMacAddress = (macAddress) => {
  if (!macAddress) return '';
  return macAddress.includes(':') 
    ? macAddress.replace(/:/g, '').toUpperCase() 
    : macAddress.toUpperCase();
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
      const devicesList = response.data?.data || []; // Updated to use response.data.data
      setDevices(devicesList);
      return { success: true, devices: devicesList };
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to fetch devices';
      setError(errorMsg);
      console.error('Error fetching devices:', err);
      // Don't rethrow here if you want the component to render with an error state
      return { success: false, error: errorMsg, devices: [] };
    } finally {
      setLoading(false);
    }
  }, [clearError]);

  // Add a new device
  const addDevice = useCallback(async (macAddress, name) => {
    try {
      setLoading(true);
      clearError();
      const response = await addDeviceApi(macAddress, name);
      await fetchDevices(); // Refresh devices list after adding
      return { success: true, device: response.data?.device };
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to add device';
      setError(errorMsg);
      console.error('Error adding device:', err);
      // Rethrow for component to catch specific errors if needed
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, [clearError, fetchDevices]);

  // Update a device
  const updateDevice = useCallback(async (macAddress, name) => {
    try {
      setLoading(true);
      clearError();
      const response = await updateDeviceApi(macAddress, name);
      await fetchDevices(); // Refresh devices list after updating
      return { success: true, device: response.data?.device };
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to update device';
      setError(errorMsg);
      console.error('Error updating device:', err);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, [clearError, fetchDevices]);

  // Fetch ports for a device (used in app/device/[mac]/page.js)
  const fetchPortsForDevice = useCallback(async (macAddress) => {
    try {
      setLoading(true);
      clearError();
      
      // Normalize MAC address for comparison
      const normalizedMac = normalizeMacAddress(macAddress);
      
      // First, try to find the device in the local state
      const device = devices.find(d => 
        normalizeMacAddress(d.macAddress) === normalizedMac || 
        d.macSymbolId === normalizedMac
      );
      
      // If device is found locally and has switches data, use it
      if (device?.switches) {
        // Map the switches to match the expected port structure
        const ports = device.switches.map(switchItem => ({
          pin: switchItem.pin,
          name: switchItem.name,
          state: switchItem.status ? '1' : '0',
          _id: switchItem._id
        }));
        return { success: true, ports };
      }
      
      // If not found locally, make an API call
      const response = await getPortsForDeviceApi(normalizedMac);
      return { 
        success: true, 
        ports: response.data?.data || []
      };
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || `Failed to fetch ports for ${macAddress}`;
      setError(errorMsg);
      console.error('Error fetching device ports:', err);
      return { success: false, error: errorMsg, ports: [] };
    } finally {
      setLoading(false);
    }
  }, [clearError, devices]); // Add devices to dependency array

  // Add port to device (used in app/device/[mac]/page.js)
  const addPort = useCallback(async (macAddress, pin, name) => {
    try {
      setLoading(true);
      clearError();
      
      // Log the input values
      console.log('addPort called with:', { macAddress, pin, name });
      
      // Normalize MAC address to backend format
      const normalizedMac = normalizeMacAddress(macAddress);
      console.log('Normalized MAC:', normalizedMac);
      
      // Call with correct parameter order: macAddress, name, pin
      console.log('Calling addPortToDeviceApi...');
      const response = await addPortToDeviceApi(normalizedMac, name, pin);
      
      console.log('addPort response:', {
        status: response.status,
        data: response.data,
        headers: response.headers
      });
      
      if (!response.data?.success) {
        const errorMsg = response.data?.message || 'Failed to add port: Unknown error';
        console.error('API returned unsuccessful response:', errorMsg);
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }
      
      // Refresh the ports list after successful addition
      await fetchPortsForDevice(normalizedMac);
      
      return { 
        success: true, 
        port: response.data?.data,
        message: response.data?.message || 'Port added successfully'
      };
      
    } catch (err) {
      const errorData = {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
        config: {
          url: err.config?.url,
          method: err.config?.method,
          headers: err.config?.headers
        }
      };
      
      console.error('Error in addPort:', errorData);
      
      const errorMsg = err.response?.data?.message || 
                      err.message || 
                      'Failed to add port to device';
      
      setError(errorMsg);
      return { 
        success: false, 
        error: errorMsg,
        details: errorData
      };
    } finally {
      setLoading(false);
    }
  }, [clearError, fetchPortsForDevice]);

  // Get pin state (used in app/device/[mac]/[pin]/page.js)
  const getPinState = useCallback(async (macAddress, pin) => {
    try {
      // Not setting loading=true globally here as it might be called frequently for status checks
      clearError();
      // Normalize MAC address to backend format
      const normalizedMac = normalizeMacAddress(macAddress);
      const response = await getPinStatusApi(normalizedMac, pin);
      return { success: true, state: response.data?.status }; // Assuming API returns { status: '0' or '1' }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || `Failed to get state for pin ${pin}`;
      setError(errorMsg);
      console.error('Error getting pin state:', err);
      return { success: false, error: errorMsg, state: 'unknown' };
    }
  }, [clearError]);

  // Toggle pin state (used in app/device/[mac]/[pin]/page.js)
  const togglePinState = useCallback(async (macAddress, pin, currentState) => {
    try {
      setLoading(true);
      clearError();
      const newState = currentState === '1' ? '0' : '1';
      // Normalize MAC address to backend format
      const normalizedMac = normalizeMacAddress(macAddress);
      const response = await togglePinStatusApi(normalizedMac, pin, newState);
      return { success: true, newState: response.data?.state }; // Assuming API returns { state: '0' or '1' }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to toggle pin state';
      setError(errorMsg);
      console.error('Error toggling pin state:', err);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, [clearError]);

  // Fetch schedules (might be filtered in component by mac/pin)
  const fetchSchedules = useCallback(async () => {
    try {
      setLoading(true);
      clearError();
      const response = await getSchedulesApi();
      const schedulesList = response.data?.schedules || []; // Assuming API returns { schedules: [...] }
      setSchedules(schedulesList);
      return { success: true, schedules: schedulesList };
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to fetch schedules';
      setError(errorMsg);
      console.error('Error fetching schedules:', err);
      return { success: false, error: errorMsg, schedules: [] };
    } finally {
      setLoading(false);
    }
  }, [clearError]);

  // Create schedule
  const createSchedule = useCallback(async (scheduleData) => {
    try {
      setLoading(true);
      clearError();
      const response = await createScheduleApi(scheduleData);
      await fetchSchedules(); // Refresh schedules list after creation
      return { success: true, schedule: response.data?.schedule };
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to create schedule';
      setError(errorMsg);
      console.error('Error creating schedule:', err);
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
      await fetchSchedules(); // Refresh schedules list after deletion
      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to delete schedule';
      setError(errorMsg);
      console.error('Error deleting schedule:', err);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, [clearError, fetchSchedules]);

  // Initial data fetch for devices and schedules
  useEffect(() => {
    fetchDevices();
    fetchSchedules(); // Fetch global schedules here, then filter in components
  }, [fetchDevices, fetchSchedules]);

  // Return all the functions and state that components will consume
  return {
    // State
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