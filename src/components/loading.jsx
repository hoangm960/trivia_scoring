import React from 'react';
import './style/loading.css';

function Loading({ msg }) {
  return (
    <div className="loading-text">{msg}</div>
  );
}

export default Loading;