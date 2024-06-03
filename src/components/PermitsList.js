import React from 'react';

const PermitsList = ({ permits, page, setPage }) => (
    <>
        <h2>Permits</h2>
        <ul>
            {permits.map((permit, index) => (
                <li key={index}>
                    <strong>Permit Name:</strong> {permit.PermitEntranceName} <br />
                    <strong>Description:</strong> {permit.PermitEntranceDescription} <br />
                    <strong>Location:</strong> {permit.Town}, {permit.District}
                </li>
            ))}
        </ul>
        <div className="pagination">
            <button onClick={() => setPage(page - 1)} disabled={page === 1}>Previous</button>
            <span>Page {page}</span>
            <button onClick={() => setPage(page + 1)}>Next</button>
        </div>
    </>
);

export default PermitsList;
