import React, { useState } from 'react';
import Nav from './components/Nav';
import Footer from './components/Footer';
import { Outlet } from 'react-router-dom';
import { UserProvider } from '../context/UserContext'; // Importe apenas o UserProvider

function App() {
  return (
    <UserProvider> {/* Use UserProvider aqui */}
      <Nav/>
      <Outlet/>
      <Footer/>
    </UserProvider>
  );
}

export default App;