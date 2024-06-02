import React, { useState } from 'react';
import '../css/style.css'
import data from '../data/data.json'
import spot from '../assets/spot.png'
import map from '../assets/map/mapa1.jpg'

function Home(){
    const [modalOpen, setModalOpen] = useState(false);

    const handleSpotClick = () => {
        setModalOpen(true);
    }

    const handleClose = () => {
        setModalOpen(false);
    }

    return(
        <>
        <main>
            <div className='info'>
                <h1>Encontre um Ponto Próximo de Você</h1>
            </div>
            <div className='mapa'>
                <img src={map} alt='mapa1' className='map'/>
                {data.map((item, index) => {
                    const spotStyle = {
                        position: 'absolute',
                        top: `${item.latitude}%`,
                        left: `${item.longitude}%`,
                        width: '50px',
                        height: '50px',
                        cursor: 'pointer'
                    };
                    return <img key={index} src={spot} alt='spot' style={spotStyle} onClick={handleSpotClick}/>
                })}
            </div>
            {modalOpen && (
                <>
                <div className='modal-backdrop' onClick={handleClose}></div>
                <div className='modal'>
                    <h2>Escolha uma opção</h2>
                    <div>
                        <button className='spot-options'>Participar</button>
                        <button className='spot-options'>Organizar</button>
                    </div>
                    <button onClick={handleClose}>Close</button>
                </div>
                </>
            )}
        </main>
        </>
    )
}

export default Home