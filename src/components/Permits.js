import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Permits() {
  const [permits, setPermits] = useState([]);

  useEffect(() => {
    fetchPermits();
  }, []);

  const fetchPermits = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/permits');
      setPermits(response.data.permits);
    } catch (error) {
      console.error('Error fetching permits:', error);
    }
  };

  return (
    <div>
      <h2>Permits</h2>
      <ul>
        {permits.map((permit) => (
          <li key={permit.id}>{permit.PermitEntranceName}</li>
        ))}
      </ul>
    </div>
  );
}

export default Permits;
