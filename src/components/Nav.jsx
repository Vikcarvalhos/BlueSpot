// Nav.jsx
import React, { useState, useContext } from 'react';
import {Link} from 'react-router-dom';
import { CgProfile } from "react-icons/cg";
import { GrClose } from "react-icons/gr";
import '../css/nav.css';
import Register from './Register';
import Login from './Login';
import { UserContext } from '../../context/UserContext';
import logo from '../assets/Bluespot.svg'

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
                    <Link to="/"><img src={logo} alt="logo" className="logo"></img></Link>
                    <button onClick={openNav} className='menu-button'><CgProfile /></button>
                    <div className={menu ? 'overlay open' : 'overlay'}>
                        <div id='menu' className='overlay-content'>
                            <div className='user-login'>
                                {loggedInUser && (
                                    <>
                                        <p>Olá, {loggedInUser.name}!</p>
                                        <p onClick={handleLogout} className='hover-underline'>Logout</p>
                                    </>
                                )}
                                {!loggedInUser && (
                                    <>
                                        <div className='login'>
                                            <p onClick={() => openModal(true)} className='hover-underline'>Cadastro</p>
                                            <p onClick={() => openModal(false)} className='hover-underline'>Login</p>
                                        </div>
                                    </>
                                )}
                            </div>
                            <div className='close-button-container'>
                                <button className='close-button' onClick={closeNav}><GrClose /></button>
                            </div>
                        </div>
                    </div>
                </nav>
            </header>
            {modalOpen && (
                <>
                <div className='modal-background' onClick={closeModal}></div>
                <div className='modal'>
                    {isRegister ? <Register closeModal={closeModal} /> : <Login closeModal={closeModal} />}
                </div>
                </>
            )}
        </>
    )
}

export default Nav;