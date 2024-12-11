import React, { useState, useEffect } from 'react';
import getDeviceId from '../../utils/deviceId';

const DeviceBinding = () => {
  const [deviceId, setDeviceId] = useState(null);
  const [isBinding, setIsBinding] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchDeviceId = async () => {
      const id = await getDeviceId();
      setDeviceId(id);
    };
    fetchDeviceId();
  }, []);

  const handleBindDevice = async () => {
    setIsBinding(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/auth/bind-device', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ deviceId }),
      });

      const data = await response.json();
      
      if (data.success) {
        setSuccess('Device successfully bound to your account!');
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('An error occurred while binding the device');
    } finally {
      setIsBinding(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Device Binding</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          {success}
        </div>
      )}

      <div className="mb-4">
        <p className="text-gray-600">Device ID:</p>
        <code className="block p-2 bg-gray-100 rounded">
          {deviceId || 'Loading...'}
        </code>
      </div>

      <button
        onClick={handleBindDevice}
        disabled={isBinding || !deviceId}
        className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {isBinding ? 'Binding...' : 'Bind This Device'}
      </button>

      <p className="mt-4 text-sm text-gray-500">
        Binding your device helps secure your account and enables faster login on this device.
      </p>
    </div>
  );
};

export default DeviceBinding; 