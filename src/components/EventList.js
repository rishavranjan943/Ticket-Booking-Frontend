import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './EventList.css';  

export default function EventList() {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get('/api/events');
        console.log(res.data); 
        if (Array.isArray(res.data)) {
          setEvents(res.data);
        } else {
          console.error("Expected an array, but got:", res.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchEvents();
  }, []);

  const handleViewDetails = (eventId) => {
    navigate(`/events/${eventId}`);
  };

  return (
    <div className="event-list">
      <h2>Events</h2>
      <ul>
        {events.map((event) => (
          <li key={event._id} className="event-item">
            <h3 className="event-name">{event.name}</h3>
            <p className="event-description">{event.description}</p>
            <button className="view-details-button" onClick={() => handleViewDetails(event._id)}>View Details</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
