import React from 'react';
import './style/loading.css';

function Loading() {
  return (
    <>
      <div className="loading-container">
        <div className="loading-text">Waiting for host...</div>
      </div>
    </>
  );
}

export default Loading;