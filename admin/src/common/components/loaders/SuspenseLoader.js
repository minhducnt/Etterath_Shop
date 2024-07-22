import React from 'react';

import './styles/loader.css';

function SuspenseLoader() {
  return (
    <div
      className="loader"
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
      }}
    ></div>
  );
}

export default SuspenseLoader;
