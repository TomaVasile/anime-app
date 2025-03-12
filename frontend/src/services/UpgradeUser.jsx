import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutButton from './CheckoutButton'; 

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const UpgradeUser = () => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleCheckout = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      window.location.href = '/login';
      return;
    }

    const userId = localStorage.getItem('userId'); 

    if (!userId) {
      setErrorMessage('Eroare: ID-ul utilizatorului nu este disponibil.');
      return;
    }
    
    const priceId = 'price_1R1rsKAY5agvoB6asW45NhZ6'; 

    setLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch('https://anime-app-bkmg.onrender.com/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          priceId,
          userId
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage('Eroare la crearea sesiunii de checkout. Te rugăm să încerci din nou.');
        console.error('Eroare de la server:', errorData);
        return;
      }

      const session = await response.json();
      console.log('Răspunsul de la server:', session);

      if (session.sessionId) {
        const stripe = await stripePromise;
        const { error } = await stripe.redirectToCheckout({
          sessionId: session.sessionId,
        });

        if (error) {
          console.error('Eroare la redirecționare către checkout:', error);
          setErrorMessage('Eroare la redirecționare către checkout. Te rugăm să încerci din nou.');
        }
      } else {
        setErrorMessage('Nu s-a primit un sessionId valid de la server.');
        console.error('Nu s-a primit un sessionId valid de la server.');
      }
    } catch (error) {
      console.error('Eroare în timpul procesării checkout-ului:', error);
      setErrorMessage('A apărut o eroare în timpul procesării checkout-ului. Te rugăm să încerci din nou.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Upgrade la Premium</h1>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <CheckoutButton onClick={handleCheckout} loading={loading} />
      <p>Dacă nu ești logat, tranzacția nu va fi procesată.</p>
    </div>
  );
};

export default UpgradeUser;
