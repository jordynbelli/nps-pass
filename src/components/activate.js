import React from 'react';
import './activate.css';

function ActivatePage() {
  return (
    <div className="activate-page">
      <div className="activate-container">
        <h2>Activate Your ExpressPass</h2>
        <p>Enter your 10-digit activation code shown on the top of the transponder to activate your ExpressPass.</p>
        <form>
          <input
            type="text"
            placeholder="Activation Code"
            name="activationCode"
          />
          <button type="submit">Activate</button>
        </form>
      </div>
    </div>
  );
}

export default ActivatePage;
