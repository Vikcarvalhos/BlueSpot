// Nav.jsx
import React, { useState, useContext } from 'react';
import {Link} from 'react-router-dom';
import { TiThMenu } from "react-icons/ti";
import '../css/nav.css';
import Register from './Register';
import Login from './Login';
import { UserContext } from '../../context/UserContext';

function Nav(){

    const { loggedInUser, setUserId } = useContext(UserContext);
    const [menu, setMenu] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [isRegister, setIsRegister] = useState(true);

    const openNav = () => {
        setMenu(true);
    }

    const closeNav = () => {
        setMenu(false);
    }

    const openModal = (register) => {
        setIsRegister(register);
        setModalOpen(true);
    }

    const closeModal = () => {
        setModalOpen(false);
    }

    const handleLogout = () => {
        setUserId(null);
        alert('Logout realizado com sucesso!');
    }

    return(
        <>
            <header>
                <nav className='nav-menu'>
                    <Link to="/"><img src="" alt="logo"></img></Link>
                    <button onClick={openNav} className='menu-button'><TiThMenu /></button>
                    <div className={menu ? 'overlay open' : 'overlay'}>
                    <button className='close-button' onClick={closeNav}>X</button>
                        <div id='menu' className='overlay-content'>
                            
                            <div>
                                {!loggedInUser && (
                                    <>
                                        <p onClick={() => openModal(true)} className='hover-underline'>Cadastro</p>
                                        <p onClick={() => openModal(false)} className='hover-underline'>Login</p>
                                    </>
                                )}
                                {loggedInUser && (
                                    <>
                                        <p>Olá, {loggedInUser.name}!</p>
                                        <p onClick={handleLogout} className='hover-underline'>Logout</p>
                                    </>
                                )}
                            </div>
                            
                        </div>
                    </div>
                </nav>
            </header>
            {modalOpen && (
                <>
                <div className='modal-background'></div>
                <div className='modal'>
                    <button onClick={closeModal}>X</button>
                    {isRegister ? <Register closeModal={closeModal} /> : <Login closeModal={closeModal} />}
                </div>
                </>
            )}
        </>
    )
}

export default Nav;