import React, { useState, useCallback } from 'react';
import axios from 'axios';
import './fetch_campsites.css';

const states = [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", 
    "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", 
    "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", 
    "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", 
    "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", 
    "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", 
    "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", 
    "Wisconsin", "Wyoming"
];

const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

const FetchCampsites = () => {
    const [selectedState, setSelectedState] = useState('');
    const [campsites, setCampsites] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchCampsitesByState = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://127.0.0.1:5000/fetch_campsites', {
                params: {
                    state: selectedState
                }
            });
            const randomizedCampsites = shuffleArray(response.data.campsites).slice(0, 5);
            setCampsites(randomizedCampsites);
        } catch (error) {
            console.error('Error fetching campsites', error);
        } finally {
            setLoading(false);
        }
    }, [selectedState]);

    const handleFilter = (event) => {
        event.preventDefault();
        fetchCampsitesByState();
    };

    return (
        <div className="user-data">
            <div className="data-container">
                <h1>Find Campsites by State | Powered by Recreation.gov </h1>
                <form onSubmit={handleFilter} className="filter-form">
                    <label>
                        Select State:
                        <select 
                            value={selectedState} 
                            onChange={(e) => setSelectedState(e.target.value)} 
                            required
                        >
                            <option value="">Select a state</option>
                            {states.map(state => (
                                <option key={state} value={state}>{state}</option>
                            ))}
                        </select>
                    </label>
                    <button type="submit">Search Campsites</button>
                </form>
                <h2>Available Campsites in {selectedState}</h2>
                {loading ? (
                    <div className="loading">
                        <div className="loading-spinner"></div>
                        Loading...
                    </div>
                ) : campsites.length > 0 ? (
                    <div className="campsite-grid">
                        {campsites.map((campsite, index) => (
                            <div key={index} className="campsite-item">
                                <h3>{campsite.CampsiteName}</h3>
                                {campsite.image && <img src={campsite.image} alt={campsite.CampsiteName} className="campsite-thumbnail" />}
                                <p><strong>Type:</strong> {campsite.CampsiteType}</p>
                                <p><strong>Type of Use:</strong> {campsite.TypeOfUse}</p>
                                <p><strong>Accessible:</strong> {campsite.CampsiteAccessible ? 'Yes' : 'No'}</p>
                                <p><strong>Longitude:</strong> {campsite.CampsiteLongitude}</p>
                                <p><strong>Latitude:</strong> {campsite.CampsiteLatitude}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No campsites available</p>
                )}
            </div>
        </div>
    );
};

export default FetchCampsites;
