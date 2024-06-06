import React, { useState, useEffect, useRef } from 'react';
import { MapInteractionCSS } from 'react-map-interaction';
import { GrHelp } from "react-icons/gr";
import '../css/style.css'
import db from '../data/db.json'
import spot from '../assets/spot.png'
import map from '../assets/map/mapa1.jpg'
import coletores from '../assets/Participar.svg'
import reportar from '../assets/Reportar.svg'

function Home(){
    const [modalOpen, setModalOpen] = useState(false);
    const [spots, setSpots] = useState(db.spots);
    const [selectedSpot, setSelectedSpot] = useState(null);
    const [newSpot, setNewSpot] = useState(null);
    const [userNames, setUserNames] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
    const [value, setValue] = useState({ scale: 1, translation: { x: -100, y: -100 } });
    const [spotSize, setSpotSize] = useState(50);
    const mapRef = useRef();

    // Listen for window resize events
    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;

            if (width <= 576) {
                setValue({ scale: 1.5, translation: { x: -400, y: -50 } });
                setSpotSize(25); // Update spot size
            } else if (width <= 768) {
                setValue({ scale: 1, translation: { x: -300, y: -70 } });
                setSpotSize(40); // Update spot size
            } else if (width <= 992) {
                setValue({ scale: 0.8, translation: { x: -80, y: -80 } });
                setSpotSize(45); // Update spot size
            } else if (width <= 1200) {
                setValue({ scale: 0.9, translation: { x: -90, y: -90 } });
                setSpotSize(50); // Update spot size
            } else {
                setValue({ scale: 1, translation: { x: -100, y: -100 } });
                setSpotSize(50); // Update spot size
            }
        };

        // Initial resize
        handleResize();

        // Add event listener
        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

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

    const checkImagePosition = () => {
        const newPosition = mapRef.current.getBoundingClientRect();
        if (newPosition.x !== imagePosition.x || newPosition.y !== imagePosition.y) {
            setIsDragging(true);
        } else {
            setIsDragging(false);
        }
    }

    const handleMapClick = (event) => {
        if (isDragging) {
            setIsDragging(false); // Reset the flag for the next interaction
            return;
        }
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

    const handleMouseDown = (event) => {
        setImagePosition(mapRef.current.getBoundingClientRect());
    }
    
    const handleMouseUp = (event) => {
        const newPosition = mapRef.current.getBoundingClientRect();
        if (newPosition.x === imagePosition.x && newPosition.y === imagePosition.y) {
            handleMapClick(event);
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

    const [helpModalOpen, setHelpModalOpen] = useState(false); // Estado para controlar a abertura/fechamento do modal de ajuda

    const handleHelpClick = () => {
        setHelpModalOpen(true);
    }

    const handleHelpClose = () => {
        setHelpModalOpen(false);
    }

    return(
        <>
        <main>
            <div className='mapa'>
            <MapInteractionCSS 
                onDragStart={() => setImagePosition(mapRef.current.getBoundingClientRect())} 
                onDragEnd={checkImagePosition}
                value={value} onChange={(value) => setValue(value)}
            >
                <img 
                    onMouseDown={handleMouseDown} 
                    onMouseUp={handleMouseUp} 
                    onTouchStart={handleMouseDown} 
                    onTouchEnd={handleMouseUp} 
                    ref={mapRef} 
                    src={map} 
                    alt='mapa1' 
                    className='map'
                />
                {spots.map((item, index) => {
                    const spotStyle = {
                        position: 'absolute',
                        top: `calc(${item.latitude}% - ${spotSize}px)`, // Subtract half the height of the image
                        left: `calc(${item.longitude}% - ${spotSize / 2}px)`, // Subtract half the width of the image
                        width: `${spotSize}px`,
                        height: `${spotSize}px`,
                        cursor: 'pointer'
                    };
                    return (
                        <div key={index} style={spotStyle}>
                            <img 
                                src={spot} 
                                alt='spot' 
                                onClick={(e) => {e.stopPropagation(); handleSpotClick(item);}}
                                onTouchEnd={(e) => {e.stopPropagation(); handleSpotClick(item);}}
                                style={{width: '100%', height: '100%'}}
                            />
                            <div className='user-count'>
                                {item.users.length}
                            </div>
                        </div>
                    )
                })}
                </MapInteractionCSS>
            </div>
            {modalOpen && (
                <>
                {selectedSpot && (
                    <div className='modal-backdrop' onClick={handleClose}>
                        <img src={coletores} alt='coletores' className='modal-image'/>
                    </div>
                )}
                {newSpot && (
                    <div className='modal-backdrop' onClick={handleClose}>
                        <img src={reportar} alt='procurando lixo' className='modal-image'/>
                    </div>
                )}
                <div className='modal'>
                    {selectedSpot && (
                        <>
                        <div>
                            <h2>Junte-se ao mutirão!</h2>
                            <h3>Parcipantes:</h3>
                        </div>
                        <ul>
                            {userNames.map((name, index) => <li key={index}>{name}</li>)}
                        </ul>
                        </>
                    )}
                    {newSpot && <h2>Encontrou lixo acumulado?</h2>}
                    <div className='modal-button-container'>
                        {selectedSpot && (
                            <>
                            <div className='spot-options-container'>
                                <button className='spot-options' onClick={handleParticipate}>Participar</button>
                                <button className='spot-options' onClick={handleClose}>Cancelar</button>
                            </div>
                            </>
                        )}
                        {newSpot && (
                            <>
                            <div className='spot-options-container'>
                                <button className='spot-options' onClick={handleReport}>Reportar</button>
                                <button className='spot-options' onClick={handleClose}>Cancelar</button>
                            </div>
                            </>
                        )}
                    </div>
                </div>
                </>
            )}
            <button className="help-button" onClick={handleHelpClick}>
                <GrHelp />
            </button>

            {helpModalOpen && (
                <div>
                    <div className='modal-backdrop' onClick={handleHelpClose}></div>
                    <div className='modal'>
                        <h2>Sobre este projeto</h2>
                        <p>
                            Este projeto é um mapa interativo que tem como objetivo reduzir a quantidade de lixo
                            que pode afetar a vida marinha. Aqui, você irá visualizar locais com acumulo
                            de lixo reportador por usuários ou gerados apartir de nossa análise de dados.
                            Crie grupos de mutirão para limpeza desses locais e ajude a preservar o meio ambiente.
                        </p>
                        <button onClick={handleHelpClose}>Fechar</button>
                    </div>
                </div>
            )}
        </main>
        </>
    )
}

export default Home

