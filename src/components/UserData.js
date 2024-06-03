import React, { useState, useCallback } from 'react';
import axios from 'axios';
import './UserData.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const parks = [
    "Yellowstone National Park",
    "Yosemite National Park",
    "Rocky Mountain National Park",
    "Bryce Canyon National Park",
    "Hawaii Volcanoes National Park",
    "Great Smoky Mountains National Park",
    "Arches National Park",
    "Glacier National Park",
    "Joshua Tree National Park",
    "Grand Canyon National Park",
    "Zion National Park",
    "Mount Rushmore National Memorial",
    "Grand Teton National Park",
    "Sequoia National Park",
    "Denali National Park",
    "Badlands National Park",
    "Everglades National Park",
    "Death Valley National Park",
    "Acadia National Park",
    "Olympic National Park",
    "Shenandoah National Park",
    "Canyonlands National Park",
    "Petrified Forest National Park",
    "Mesa Verde National Park"
];

const UserData = () => {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchRecreationReservations = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get('https://ridb.recreation.gov/api/v1/facilities', {
                headers: {
                    'apikey': '6f0e166b-0807-4a4a-a1bb-fe9c10e60bd8'
                },
                params: {
                    activity: 'camping',
                    limit: 50,
                    offset: 0,
                    start_date: startDate.toISOString().split('T')[0],
                    end_date: endDate.toISOString().split('T')[0]
                }
            });
            const filteredReservations = response.data.RECDATA.filter(facility => 
                parks.includes(facility.FacilityName)
            );
            setReservations(filteredReservations);
        } catch (error) {
            console.error('Error fetching reservations', error);
        } finally {
            setLoading(false);
        }
    }, [startDate, endDate]);

    const handleFilter = (event) => {
        event.preventDefault();
        fetchRecreationReservations();
    };

    return (
        <div className="user-data">
            <div className="data-container">
                <h1>Campsite Reservation Information</h1>

                <form onSubmit={handleFilter} className="filter-form">
                    <label>
                        Start Date:
                        <DatePicker
                            selected={startDate}
                            onChange={(date) => setStartDate(date)}
                            selectsStart
                            startDate={startDate}
                            endDate={endDate}
                            dateFormat="yyyy-MM-dd"
                            required
                        />
                    </label>
                    <label>
                        End Date:
                        <DatePicker
                            selected={endDate}
                            onChange={(date) => setEndDate(date)}
                            selectsEnd
                            startDate={startDate}
                            endDate={endDate}
                            minDate={startDate}
                            dateFormat="yyyy-MM-dd"
                            required
                        />
                    </label>
                    <button type="submit">Search Reservations</button>
                </form>

                <h2>Available Campsite Reservations</h2>
                {loading ? (
                    <div className="loading">
                        <div className="loading-spinner"></div>
                        Loading...
                    </div>
                ) : reservations.length > 0 ? (
                    reservations.map((reservation, index) => (
                        <div key={index} className="reservation-item">
                            <p>Facility ID: {reservation.FacilityID}</p>
                            <p>Facility Name: {reservation.FacilityName}</p>
                            <p>Type: {reservation.FacilityTypeDescription}</p>
                        </div>
                    ))
                ) : (
                    <p>No reservations available</p>
                )}
            </div>
        </div>
    );
};

export default UserData;
