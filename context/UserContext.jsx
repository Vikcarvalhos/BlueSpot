import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Importe o axios

export const UserContext = React.createContext();

export function UserProvider({ children }) {
    const [authToken, setAuthToken] = useState(() => {
        return localStorage.getItem('authToken');
    });

    const [userId, setUserId] = useState(() => {
        return localStorage.getItem('userId');
    });

    const [loggedInUser, setLoggedInUser] = useState(null);

    useEffect(() => {
        if (authToken && userId) {
            localStorage.setItem('authToken', authToken);
            localStorage.setItem('userId', userId);

            // Use o ID do usuário para buscar o usuário
            axios.get(`http://localhost:3001/users/${userId}`)
                .then(response => {
                    setLoggedInUser(response.data.name);
                })
                .catch(error => {
                    console.error('Erro ao buscar o usuário:', error);
                });
        } else {
            localStorage.removeItem('authToken');
            localStorage.removeItem('userId');
            setLoggedInUser(null);
        }
    }, [authToken, userId]);

    return (
        <UserContext.Provider value={{ authToken, setAuthToken, userId, setUserId, loggedInUser, setLoggedInUser }}>
            {children}
        </UserContext.Provider>
    );
}