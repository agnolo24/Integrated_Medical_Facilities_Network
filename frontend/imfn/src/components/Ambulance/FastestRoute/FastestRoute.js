import React, { useState } from 'react';

function FastestRoute({ lat, lon }) {
  const [open, setOpen] = useState(false);

  const mapUrl = `https://www.google.com/maps/embed/v1/directions?key=YOUR_API_KEY&destination=${lat},${lon}`;

  return (
    <div>
      <button onClick={() => setOpen(true)}>Navigate to Patient</button>

      {open && (
        <div style={{
          position: 'fixed',
          top: '10%',
          left: '10%',
          width: '80%',
          height: '80%',
          backgroundColor: 'white',
          border: '2px solid #000',
          zIndex: 1000
        }}>
          <button onClick={() => setOpen(false)}>Close</button>
          <iframe
            title="Google Maps"
            src={mapUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
          />
        </div>
      )}
    </div>
  );
}

export default FastestRoute;
