import React from 'react';

interface SpinnerProps {

}

const Spinner: React.FC<SpinnerProps> = () => {
  return (
    <div className="spinner-container flex justify-content-center align-items-center">
      <div className="spinner"></div>
    </div>
  );
};

export default Spinner;
