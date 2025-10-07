import React from 'react';

const WasteSegregatorGame = () => {
    return (
        <div style={{ width: '100%', height: '100vh' }}>
            <iframe
                src="/Games/waste-segregator.html"
                style={{ width: '100%', height: '100%', border: 'none' }}
                title="Waste Segregator Game"
            ></iframe>
        </div>
    );
};

export default WasteSegregatorGame;
