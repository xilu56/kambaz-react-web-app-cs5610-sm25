import React from 'react';

const EnvDebug: React.FC = () => {
  const remoteServer = import.meta.env.VITE_REMOTE_SERVER || "http://localhost:4000";
  
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
      zIndex: 9999
    }}>
      <strong>环境配置:</strong><br/>
      后端服务器: {remoteServer}<br/>
      环境: {import.meta.env.MODE}<br/>
      开发模式: {import.meta.env.DEV ? '是' : '否'}
    </div>
  );
};

export default EnvDebug; 