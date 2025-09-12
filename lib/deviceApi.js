import apiClient from './apiClient';

// Device operations
export async function getDevices() {
  return apiClient.get('/api/v1/devices');
}

export async function addDevice(macAddress, name) {
  return apiClient.post('/api/v1/devices', { macAddress, name });
}

export async function updateDevice(macAddress, name) {
  return apiClient.put(`/api/v1/devices/${macAddress}`, { name });
}

// Port Management
export async function getPortsForDevice(macAddress) {
  return apiClient.get(`/api/v1/devices/${macAddress}/ports`);
}

export async function addPortToDevice(macAddress, name, pin) {
  try {
    // Ensure pin is a number
    const pinNumber = Number(pin);
    if (isNaN(pinNumber)) {
      console.error('Invalid pin:', pin);
      throw new Error('Pin must be a number');
    }

    console.log('Adding port with:', { macAddress, name, pin: pinNumber });
    
    const response = await apiClient.post(
      `/api/v1/devices/${macAddress}/ports`, 
      { name, pin: pinNumber }
    );
    
    console.log('Add port response:', response.data);
    return response;
  } catch (error) {
    console.error('Error in addPortToDevice:', {
      error: error.message,
      response: error.response?.data,
      status: error.response?.status,
      headers: error.response?.headers
    });
    throw error; // Re-throw to allow error handling in the component
  }
}

// Pin Operations
export async function getPinStatus(macAddress, pin) {
  return apiClient.get(`/api/v1/devices/${macAddress}/${pin}/curStatus`);
}

export async function togglePinStatus(macAddress, pin, state = 'toggle') {
  // state can be '0', '1', or 'toggle'
  return apiClient.put(`/api/v1/devices/${macAddress}/${pin}/${state}`, null, {
    headers: {
      'x-esp-api-key': macAddress
    }
  });
}

// Schedule operations
export async function getSchedules() {
  return apiClient.get('/api/v1/schedules');
}

export async function createSchedule(scheduleData) {
  // scheduleData should include name, macSymbolId, switchPin, scheduleTimes
  return apiClient.post('/api/v1/schedules', scheduleData);
}

export async function deleteSchedule(scheduleId) {
  return apiClient.delete(`/api/v1/schedules/${scheduleId}`);
}
