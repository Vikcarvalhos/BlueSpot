// UserContext.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export const UserContext = React.createContext();

export function UserProvider({ children }) {
    const [userId, setUserId] = useState(() => {
        return localStorage.getItem('userId');
    });

    const [loggedInUser, setLoggedInUser] = useState(null);

    useEffect(() => {
        if (userId) {
            localStorage.setItem('userId', userId);

            // Use o ID do usuário para buscar o usuário
            axios.get(`http://localhost:3001/users/${userId}`)
                .then(response => {
                    setLoggedInUser(response.data);
                    // Armazenar as informações do usuário no localStorage
                    localStorage.setItem('user', JSON.stringify(response.data));
                })
                .catch(error => {
                    console.error('Erro ao buscar o usuário:', error);
                });
        } else {
            localStorage.removeItem('userId');
            localStorage.removeItem('user');
            setLoggedInUser(null);
        }
    }, [userId]);

    return (
        <UserContext.Provider value={{ userId, setUserId, loggedInUser, setLoggedInUser }}>
            {children}
        </UserContext.Provider>
    );
}