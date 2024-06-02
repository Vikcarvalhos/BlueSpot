// Register.jsx
import React, { useState, useContext } from 'react'; // Import useContext
import axios from 'axios';
import { UserContext } from '../../context/UserContext'; // Import UserContext

function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');

    // Get setAuthToken and setUserId from UserContext
    const { setAuthToken, setUserId } = useContext(UserContext);

    const handleRegister = async () => {
        try {
            const existingUsersResponse = await axios.get('http://localhost:3001/users');
            const userExists = existingUsersResponse.data.some(user => user.username === username);

            if (userExists) {
                alert('Um usuário com este nome de usuário já existe.');
                return;
            }

            // Generate a unique ID for the user
            const id = Date.now();

            const response = await axios.post('http://localhost:3001/users', { id, username, password, name, phone, email });
            console.log(response.data);
            alert('Registro realizado com sucesso!');

            // Log the user in
            const loginResponse = await axios.post('http://localhost:3001/users/login', { username, password });
            const token = loginResponse.data.token;

            // Save the token and user ID to UserContext
            setAuthToken(token);
            setUserId(id);
        } catch (error) {
            console.error(error);
            alert('Ocorreu um erro durante o registro.');
        }
    }

    return (
        <div>
            <input type='text' value={name} onChange={e => setName(e.target.value)} placeholder='Nome' />
            <input type='text' value={username} onChange={e => setUsername(e.target.value)} placeholder='Username' />
            <input type='password' value={password} onChange={e => setPassword(e.target.value)} placeholder='Password' />
            <input type='text' value={phone} onChange={e => setPhone(e.target.value)} placeholder='Telefone' />
            <input type='email' value={email} onChange={e => setEmail(e.target.value)} placeholder='Email' />
            <button onClick={handleRegister}>Register</button>
        </div>
    )
}

export default Register;