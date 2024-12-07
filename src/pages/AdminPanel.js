import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminPanel.css';  
import { useNavigate } from 'react-router-dom';



export default function AdminPanel() {
  const user = localStorage.getItem('user');
  const parsedUser = JSON.parse(user);
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get(`/api/events/organizer/${parsedUser._id}`);
        console.log(res.data);
        setEvents(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Error fetching events.");
        setLoading(false);
      }
    };
    fetchEvents();
  }, [parsedUser._id]); 

  const handleDelete = async (eventId) => {
    try {
      await axios.delete(`/api/events/${eventId}`);
      setEvents(events.filter((event) => event._id !== eventId));  
    } catch (err) {
      console.error(err);
      setError("Error deleting event.");
    }
  };

  const handleUpdate = (eventId) => {
    window.location.href = `/update-event/${eventId}`;
  };

  const handleViewDetails = (eventId) => {
    navigate(`/events/${eventId}`);
  };

  if (loading) return <div>Loading events...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="admin-panel">
      <h2>Admin Panel</h2>
      <h3>Events Managed by {parsedUser.name}</h3>
      {events.length === 0 ? (
        <p>No events found for this organizer.</p>
      ) : (
        <ul className="event-list">
          {events.map((event) => (
            <li key={event._id} className="event-item">
              <div className="event-info">
                <h4>{event.name}</h4>
                <p>{event.description}</p>
                <div className="event-actions">
                  <button className="update-button" onClick={() => handleUpdate(event._id)}>Update</button>
                  <button className="delete-button" onClick={() => handleDelete(event._id)}>Delete</button>
                  <button className="details-button" onClick={() => handleViewDetails(event._id)}>Details</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
