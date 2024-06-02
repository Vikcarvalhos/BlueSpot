// Login.jsx
import React, { useState, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../../context/UserContext';

function Login() {
    const { authToken, setAuthToken } = useContext(UserContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        if (authToken) {
            alert('Um usuário já está logado. Faça logout antes de tentar fazer login com outra conta.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:3001/users/login', { username, password });
            if (response.data && response.data.token) {
                setAuthToken(response.data.token);
                alert('Login realizado com sucesso!');
            } else {
                alert('Nome de usuário ou senha inválidos.');
            }
        } catch (error) {
            console.error('Error message:', error.message);
            console.error('Error response:', error.response);
            alert('Ocorreu um erro durante o login.');
        }
    }

    return (
        <div>
            <input type='text' value={username} onChange={e => setUsername(e.target.value)} placeholder='Username' />
            <input type='password' value={password} onChange={e => setPassword(e.target.value)} placeholder='Password' />
            <button onClick={handleLogin}>Login</button>
        </div>
    )
}

export default Login;