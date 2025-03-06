import React from 'react';

const CheckoutButton = ({ onClick, loading }) => {
  return (
    <button onClick={onClick} disabled={loading} className="form-button">
      {loading ? 'Procesare...' : 'Checkout'}
    </button>
  );
};

export default CheckoutButton;
