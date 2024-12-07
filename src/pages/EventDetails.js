import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import './EventDetails.css';



const stripePromise = loadStripe(process.env.REACT_APP_STRIPE); 

function CheckoutForm({ event, ticketCount, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const user = localStorage.getItem('user');
      const parsedUser = JSON.parse(user);
      const token=parsedUser.token;
      console.log(event._id);
      const { data } = await axios.post(
        `/api/events/book/${event._id}`,
        {
          ticketCount,
          paymentMethodId: (await stripe.createPaymentMethod({
            type: 'card',
            card: elements.getElement(CardElement),
          })).paymentMethod.id,
        },
        {
          headers: { Authorization: `${token}` },
        }
      );

      alert(data.message);
      onSuccess(data.remainingSeats);
    } catch (err) {
      console.error('Payment error:', err.message);
      alert(err.response?.data?.message || 'Payment failed!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit" disabled={!stripe || isLoading}>
        {isLoading ? 'Processing...' : `Pay Rs. ${event.pricePerSeat * ticketCount}`}
      </button>
    </form>
  );
}

export default function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [ticketCount, setTicketCount] = useState(1);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const res = await axios.get(`/api/events/${id}`);
        setEvent(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchEventDetails();
  }, [id]);

  if (!event) {
    return <div>Loading event details...</div>;
  }

  return (
    <div className="event-details">
      <h2>{event.name}</h2>
      <p><strong>Description:</strong> {event.description}</p>
      <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
      <p><strong>Location:</strong> {event.location}</p>
      <p><strong>Seats Available:</strong> {event.seats}</p>
      <p><strong>Price:</strong> Rs. {event.pricePerSeat}</p>

      <div className="ticket-counter">
        <button  onClick={() => setTicketCount(Math.max(1, ticketCount - 1))}>-</button>
        <span>{ticketCount}</span>
        <button onClick={() => setTicketCount(Math.min(event.seats, ticketCount + 1))}>+</button>
      </div>

      <Elements stripe={stripePromise}>
        <CheckoutForm
          event={event}
          ticketCount={ticketCount}
          onSuccess={(remainingSeats) => setEvent({ ...event, seats: remainingSeats })}
        />
      </Elements>
    </div>
  );
}
