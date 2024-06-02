import React, { useState, useRef } from 'react';
import '../css/style.css'
import db from '../data/db.json' // Import the new db.json file
import spot from '../assets/spot.png'
import map from '../assets/map/mapa1.jpg'

function Home(){
    const [modalOpen, setModalOpen] = useState(false);
    const [spots, setSpots] = useState(db.spots); // Use the spots data from the db.json file
    const [selectedSpot, setSelectedSpot] = useState(null);
    const [newSpot, setNewSpot] = useState(null);
    const mapRef = useRef();

    const handleSpotClick = (item) => {
        setSelectedSpot(item);
        setModalOpen(true);
    }

    const handleMapClick = (event) => {
        const rect = mapRef.current.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const latitude = (y / rect.height) * 100;
        const longitude = (x / rect.width) * 100;

        const existingSpot = spots.find(item => item.latitude === latitude && item.longitude === longitude);
        if (!existingSpot) {
            setNewSpot({ latitude, longitude });
            setModalOpen(true);
        }
    }

    const handleReport = () => {
        const newSpotData = {
            latitude: newSpot.latitude,
            longitude: newSpot.longitude,
        };
        fetch('http://localhost:5000/spots', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newSpotData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'Spot adicionado com sucesso') {
                newSpotData.id = spots.length + 1;
                newSpotData.users = [];
                newSpotData.insertedBy = 1;
                setSpots(prevSpots => [...prevSpots, newSpotData]);
                setNewSpot(null);
                setModalOpen(false);
            } else {
                alert(data.message);
            }
        });
    }

    const handleClose = () => {
        setModalOpen(false);
        setNewSpot(null);
        setSelectedSpot(null);
    }

    return(
        <>
        <main>
            <div className='info'>
                <h1>Encontre um Ponto Próximo de Você</h1>
            </div>
            <div className='mapa' onClick={handleMapClick}>
                <img ref={mapRef} src={map} alt='mapa1' className='map'/>
                {spots.map((item, index) => {
                    const spotStyle = {
                        position: 'absolute',
                        top: `${item.latitude}%`,
                        left: `${item.longitude}%`,
                        width: '50px',
                        height: '50px',
                        cursor: 'pointer'
                    };
                    return <img key={index} src={spot} alt='spot' style={spotStyle} onClick={(e) => {e.stopPropagation(); handleSpotClick(item);}}/>
                })}
            </div>
            {modalOpen && (
                <>
                <div className='modal-backdrop' onClick={handleClose}></div>
                <div className='modal'>
                    {selectedSpot && <h2>Escolha uma opção para o ponto {selectedSpot.id}</h2>}
                    {newSpot && <h2>Adicionar um novo ponto em latitude {newSpot.latitude.toFixed(2)}, longitude {newSpot.longitude.toFixed(2)}?</h2>}
                    <div>
                        {selectedSpot && (
                            <>
                            <button className='spot-options'>Participar</button>
                            <button className='spot-options'>Organizar</button>
                            </>
                        )}
                        {newSpot && (
                            <>
                            <button className='spot-options' onClick={handleReport}>Reportar</button>
                            <button className='spot-options'>Cancelar</button>
                            </>
                        )}
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