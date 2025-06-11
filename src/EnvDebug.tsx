import { useEffect, useState } from 'react';

export default function EnvDebug() {
  const [backendStatus, setBackendStatus] = useState<string>('Checking...');
  const remoteServer = import.meta.env.VITE_REMOTE_SERVER;

  useEffect(() => {
    const checkBackend = async () => {
      try {
        if (!remoteServer) {
          setBackendStatus('❌ VITE_REMOTE_SERVER not set');
          return;
        }
        
        const response = await fetch(`${remoteServer}/lab5/welcome`, {
          mode: 'cors',
        });
        
        if (response.ok) {
          const text = await response.text();
          setBackendStatus(`✅ Backend connected: ${text}`);
        } else {
          setBackendStatus(`❌ Backend error: ${response.status}`);
        }
      } catch (error) {
        setBackendStatus(`❌ Connection failed: ${error}`);
      }
    };

    checkBackend();
  }, [remoteServer]);

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: '#f0f0f0',
      padding: '10px',
      border: '1px solid #ccc',
      borderRadius: '5px',
      fontSize: '12px',
      zIndex: 9999,
      maxWidth: '300px'
    }}>
      <div><strong>Debug Info:</strong></div>
      <div>VITE_REMOTE_SERVER: {remoteServer || 'undefined'}</div>
      <div>Backend Status: {backendStatus}</div>
    </div>
  );
} 