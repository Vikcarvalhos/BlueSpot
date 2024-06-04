import React, { useState, useRef } from 'react';
import { MapInteractionCSS } from 'react-map-interaction';
import '../css/style.css'
import db from '../data/db.json' // Import the new db.json file
import spot from '../assets/spot.png'
import map from '../assets/map/mapa1.jpg'

function Home(){
    const [modalOpen, setModalOpen] = useState(false);
    const [spots, setSpots] = useState(db.spots); // Use the spots data from the db.json file
    const [selectedSpot, setSelectedSpot] = useState(null);
    const [newSpot, setNewSpot] = useState(null);
    const [userNames, setUserNames] = useState([]); // Add a new state variable for user names
    const mapRef = useRef();

    const handleSpotClick = async (item) => { // Make the function async
        setSelectedSpot(item);
        setModalOpen(true);

        // Fetch the names of the users
        const userNames = [];
        for (const userId of item.users) {
            const response = await fetch(`http://localhost:5000/users/${userId}`);
            const user = await response.json();
            userNames.push(user.name);
        }
        setUserNames(userNames);
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
        const userId = localStorage.getItem('userId');  // Get the userId from localStorage
        const newSpotData = {
            latitude: newSpot.latitude,
            longitude: newSpot.longitude,
            userId: userId,  // Include the userId in the newSpotData
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

    const handleParticipate = () => {
        const userId = localStorage.getItem('userId');
        fetch(`http://localhost:5000/spots/${selectedSpot.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId })
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'Participação adicionada com sucesso') {
                setSpots(prevSpots => prevSpots.map(spot => spot.id === selectedSpot.id ? {...spot, users: [...spot.users, userId]} : spot));
                setSelectedSpot(null);
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
                <MapInteractionCSS>
                    <img ref={mapRef} src={map} alt='mapa1' className='map'/>
                
                    {spots.map((item, index) => {
                        const spotStyle = {
                            position: 'absolute',
                            top: `calc(${item.latitude}% - 50px)`, // Subtract half the height of the image
                            left: `calc(${item.longitude}% - 25px)`, // Subtract half the width of the image
                            width: '50px',
                            height: '50px',
                            cursor: 'pointer'
                        };
                        return <img key={index} src={spot} alt='spot' style={spotStyle} onClick={(e) => {e.stopPropagation(); handleSpotClick(item);}}/>
                    })}
                </MapInteractionCSS>
            </div>
            {modalOpen && (
                <>
                <div className='modal-backdrop' onClick={handleClose}></div>
                <div className='modal'>
                    {selectedSpot && (
                        <>
                        <h2>Escolha uma opção para o ponto {selectedSpot.id}</h2>
                        <h3>Participantes:</h3>
                        <ul>
                            {userNames.map((name, index) => <li key={index}>{name}</li>)}
                        </ul>
                        </>
                    )}
                    {newSpot && <h2>Adicionar um novo ponto em latitude {newSpot.latitude.toFixed(2)}, longitude {newSpot.longitude.toFixed(2)}?</h2>}
                    <div>
                        {selectedSpot && (
                            <>
                            <button className='spot-options' onClick={handleParticipate}>Participar</button>
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