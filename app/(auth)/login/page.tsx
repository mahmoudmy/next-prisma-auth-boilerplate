"use client"
import { authClient } from "@/lib/auth-client"; //import the auth client
import { useState } from 'react';
 
export default function Login() {
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
 
  const signUp = async () => {
    const { data, error } = await authClient.signIn.username({ 
        password, 
        username
     }, { 
        onRequest: (ctx) => { 
         //show loading
        }, 
        onSuccess: (ctx) => { 
          //redirect to the dashboard
        }, 
        onError: (ctx) => { 
          alert(ctx.error.message); 
        }, 
      }); 
  };
 
  return (
    <div>
      <input type="username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={signUp}>ورود</button>
    </div>
  );
}