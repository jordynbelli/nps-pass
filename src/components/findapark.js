
import React, { useState, useEffect } from 'react';
import './findapark.css';

function FindAPark() {
    const [query, setQuery] = useState('');
    const [parks, setParks] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [selectedPark, setSelectedPark] = useState(null);
    const [showSuggestions, setShowSuggestions] = useState(true);

    useEffect(() => {
        async function fetchAllParks() {
            const apiUrl = 'https://developer.nps.gov/api/v1/parks';
            const apiKey = '13Oytz1a3DT4YvyfPdqvG4mEckHntrte6TXotXJE';
            let allParks = [];
            let start = 0;
            let limit = 50; // API limit per request

            while (true) {
                const response = await fetch(`${apiUrl}?fields=fullName,states,images,description,operatingHours,addresses,latitude,longitude,camping&api_key=${apiKey}&start=${start}&limit=${limit}`);
                const data = await response.json();
                allParks = allParks.concat(data.data);
                if (data.total <= start + limit) {
                    break;
                }
                start += limit;
            }
            setParks(allParks);
            setSearchResults(allParks);
        }
        fetchAllParks();
    }, []);

    useEffect(() => {
        const results = searchParks(query, parks);
        setSearchResults(results);
        setShowSuggestions(true);
    }, [query, parks]);

    function searchParks(query, parks) {
        query = query.toLowerCase();
        return parks.filter(park =>
            (park.fullName && park.fullName.toLowerCase().includes(query)) ||
            (park.states && park.states.toLowerCase().includes(query))
        );
    }

    function handleSearch(event) {
        setQuery(event.target.value);
        setSelectedPark(null);
    }

    function handleParkClick(park) {
        setSelectedPark(park);
        setShowSuggestions(false);
    }

    return (
        <div className="findapark-page">
            <input
                type="text"
                id="searchInput"
                className="largeSearchBar"
                placeholder="Search for a national park..."
                value={query}
                onChange={handleSearch}
            />
            {showSuggestions && query && searchResults.length > 0 && (
                <div id="suggestions">
                    {searchResults.slice(0, 5).map(park => (
                        <div key={park.id} onClick={() => handleParkClick(park)} className="suggestion">
                            {park.fullName}
                        </div>
                    ))}
                </div>
            )}
            {selectedPark && (
                <div className="parkDetails">
                    <h2>{selectedPark.fullName}</h2>
                    <p>Location: {selectedPark.states}</p>
                    <p>Description: {selectedPark.description}</p>
                    {selectedPark.images.length > 0 && (
                        <img src={selectedPark.images[0].url} alt={selectedPark.fullName} />
                    )}
                    {selectedPark.operatingHours && selectedPark.operatingHours.length > 0 && (
                        <div>
                            <h3>Operating Hours:</h3>
                            <ul>
                                {selectedPark.operatingHours[0].standardHours && Object.entries(selectedPark.operatingHours[0].standardHours).map(([day, hours]) => (
                                    <li key={day}>{day.charAt(0).toUpperCase() + day.slice(1)}: {hours}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {selectedPark.addresses && selectedPark.addresses.length > 0 && (
                        <div>
                            <h3>Address:</h3>
                            <p>{selectedPark.addresses[0].line1}</p>
                            <p>{selectedPark.addresses[0].city}, {selectedPark.addresses[0].stateCode} {selectedPark.addresses[0].postalCode}</p>
                        </div>
                    )}
                    <div>
                        <h3>Coordinates:</h3>
                        <p>Latitude: {selectedPark.latitude}</p>
                        <p>Longitude: {selectedPark.longitude}</p>
                    </div>
                    {selectedPark.camping && (
                        <div>
                            <h3>Camping Availability:</h3>
                            <p>{selectedPark.camping.campsites ? 'Available' : 'Not available'}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default FindAPark;
