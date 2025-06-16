import { useState, useEffect } from 'react';

export default function ConnectionTest() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [serverUrl, setServerUrl] = useState('');

  useEffect(() => {
    const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER || "http://localhost:4000";
    setServerUrl(REMOTE_SERVER);
    
    const fetchUsers = async () => {
      try {
        console.log('Fetching from:', `${REMOTE_SERVER}/api/users`);
        const response = await fetch(`${REMOTE_SERVER}/api/users`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setUsers(data);
        setLoading(false);
      } catch (err: any) {
        console.error('Error fetching users:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>前端后端连接测试</h2>
      
      <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f0f0f0' }}>
        <strong>服务器地址:</strong> {serverUrl}
      </div>

      {loading && <div>Loading...</div>}
      
      {error && (
        <div style={{ color: 'red', marginBottom: '20px' }}>
          <strong>错误:</strong> {error}
        </div>
      )}

      {!loading && !error && (
        <div>
          <h3>成功连接！获取到 {users.length} 个用户:</h3>
          <ul>
            {users.slice(0, 3).map((user) => (
              <li key={user._id}>
                {user.firstName} {user.lastName} ({user.username}) - {user.role}
              </li>
            ))}
          </ul>
          {users.length > 3 && <p>...还有 {users.length - 3} 个用户</p>}
        </div>
      )}
    </div>
  );
} 