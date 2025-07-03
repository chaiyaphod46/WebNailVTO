import React from 'react';

export default function BackButton(props) {
  const handleBackClick = () => {
    window.history.back();
  };

  return (
    <div className='BackButton'>
      <button 
        onClick={handleBackClick}
        className='btn btn-dark btn-lg btn-block'
      >
        Back
      </button>
    </div>
  );
}

