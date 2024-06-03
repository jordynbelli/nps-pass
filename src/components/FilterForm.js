import React from 'react';

const FilterForm = ({ startDate, setStartDate, endDate, setEndDate, handleFilter }) => (
    <form onSubmit={handleFilter} className="filter-form">
        <label htmlFor="start_date">Start Date:</label>
        <input type="date" id="start_date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        
        <label htmlFor="end_date">End Date:</label>
        <input type="date" id="end_date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        
        <button type="submit">Filter</button>
    </form>
);

export default FilterForm;
