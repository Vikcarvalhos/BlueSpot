// Register.jsx
import React, { useState, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../../context/UserContext';

function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');

    const { setUserId } = useContext(UserContext);

    const handleRegister = async () => {
        try {
            const existingUsersResponse = await axios.get('http://localhost:3001/users');
            const userExists = existingUsersResponse.data.some(user => user.username === username);

            if (userExists) {
                alert('Um usuário com este nome de usuário já existe.');
                return;
            }

            const id = Date.now();

            const response = await axios.post('http://localhost:3001/users', { id, username, password, name, phone, email });
            console.log(response.data);
            alert('Registro realizado com sucesso!');

            // Set the user ID in the context and localStorage
            setUserId(id);
            localStorage.setItem('userId', id);
        } catch (error) {
            console.error(error);
            alert('Ocorreu um erro durante o registro.');
        }
    }

    return (
        <div className='register-user-content'>
        <input className='register-user-text' type='text' value={name} onChange={e => setName(e.target.value)} placeholder='Nome' />
        <input className='register-user-text' type='text' value={username} onChange={e => setUsername(e.target.value)} placeholder='Username' />
        <input className='register-user-text' type='password' value={password} onChange={e => setPassword(e.target.value)} placeholder='Password' />
        <input className='register-user-text' type='text' value={phone} onChange={e => setPhone(e.target.value)} placeholder='Telefone' />
        <input className='register-user-text' type='email' value={email} onChange={e => setEmail(e.target.value)} placeholder='Email' />
        <button className='register-user-button' onClick={handleRegister}>Register</button>
    </div>
    )
}

export default Register;