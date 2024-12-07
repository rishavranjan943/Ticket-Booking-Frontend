import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './UpdateEvent.css'


export default function UpdateEvent() {
  const { id } = useParams();  
  const navigate = useNavigate();
  const [event, setEvent] = useState({
    name: '',
    description: '',
    date: '',
    time: '',
    location: '',
    seats: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`/api/events/${id}`);  
        setEvent(res.data);  
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Error fetching event details.');
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEvent({ ...event, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(event)
    try {
      const res = await axios.put(`/api/events/${id}`, event);  
      console.log('Event updated successfully:', res.data);
      navigate(`/events/${id}`);  
    } catch (err) {
      console.error(err);
      setError('Error updating event.');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="update-event">
      <h2>Update Event</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Event Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={event.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={event.description}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={event.date}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="time">Time</label>
          <input
            type="time"
            id="time"
            name="time"
            value={event.time}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            value={event.location}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="seats">Seats</label>
          <input
            type="number"
            id="seats"
            name="seats"
            value={event.seats}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Update Event</button>
      </form>
    </div>
  );
}
