import { useEffect, useState } from 'react';
import * as accountClient from './Kambaz/Account/client';

export default function EnvDebug() {
  const [backendStatus, setBackendStatus] = useState<string>('Checking...');
  const [kambazStatus, setKambazStatus] = useState<string>('Checking...');
  const [clientStatus, setClientStatus] = useState<string>('Checking...');
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

    const checkKambaz = async () => {
      try {
        if (!remoteServer) {
          setKambazStatus('❌ VITE_REMOTE_SERVER not set');
          return;
        }
        
        const response = await fetch(`${remoteServer}/api/users/signin`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ username: 'test', password: 'test' }),
        });
        
        if (response.status === 401) {
          setKambazStatus('✅ Kambaz API reachable (401 expected for invalid creds)');
        } else if (response.ok) {
          setKambazStatus('✅ Kambaz API working');
        } else {
          setKambazStatus(`❌ Kambaz API error: ${response.status}`);
        }
      } catch (error) {
        setKambazStatus(`❌ Kambaz connection failed: ${error}`);
      }
    };

    const checkAccountClient = async () => {
      try {
        await accountClient.signin({ username: 'test', password: 'test' });
        setClientStatus('✅ Account client working');
      } catch (error: any) {
        if (error.response?.status === 401) {
          setClientStatus('✅ Account client reachable (401 expected)');
        } else {
          setClientStatus(`❌ Account client error: ${error.message}`);
        }
      }
    };

    checkBackend();
    checkKambaz();
    checkAccountClient();
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
      maxWidth: '350px'
    }}>
      <div><strong>Debug Info:</strong></div>
      <div>VITE_REMOTE_SERVER: {remoteServer || 'undefined'}</div>
      <div>Backend Status: {backendStatus}</div>
      <div>Kambaz API: {kambazStatus}</div>
      <div>Account Client: {clientStatus}</div>
      <div style={{marginTop: '10px', fontSize: '10px', color: '#666'}}>
        Test credentials: iron_man / stark123
      </div>
    </div>
  );
} 