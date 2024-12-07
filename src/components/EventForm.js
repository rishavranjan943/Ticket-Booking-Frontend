import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function EventForm({ onEventCreated }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    organizer: '', 
    location: '',
    seats: '',
    date: '',
    time: '',
    price: '',
  });

  useEffect(() => {
    const user=localStorage.getItem('user')
    const parsedUser=JSON.parse(user)
    formData.organizer=parsedUser._id
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.seats || !formData.date || !formData.time || !formData.price) {
      alert('All fields are required.');
      return;
    }

    try {
      const user = localStorage.getItem('user');
      const parsedUser = JSON.parse(user);
      const token=parsedUser.token;
      const res = await axios.post(
        '/api/events',
        { ...formData },
        { headers: { Authorization: `${token}` } }
      );

      if (onEventCreated) {
        onEventCreated(res.data);
      }

      alert('Event created successfully!');
      setFormData({
        title: '',
        description: '',
        organizer: formData.organizer,
        location: '',
        seats: '',
        date: '',
        time: '',
        price: '',
      });
    } catch (err) {
      console.error('Failed to create event:', err);
      alert(err.response?.data?.message || 'An error occurred while creating the event.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="title"
        placeholder="Title"
        value={formData.title}
        onChange={handleChange}
        required
      />
      <input
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="organizer"
        value={formData.organizer}
        readOnly
        hidden
      />
      <input
        type="text"
        name="location"
        placeholder='location'
        onChange={handleChange}
        value={formData.location}
        required
      />
      <input
        type="number"
        name="seats"
        placeholder="Seats"
        value={formData.seats}
        onChange={handleChange}
        required
      />
      <input
        type="number"
        name="price"
        placeholder="Price per seat (in Rs.)"
        value={formData.price}
        onChange={handleChange}
        required
      />
      <input
        type="date"
        name="date"
        value={formData.date}
        onChange={handleChange}
        required
      />
      <input
        type="time"
        name="time"
        value={formData.time}
        onChange={handleChange}
        required
      />
      <button type="submit">Create Event</button>
    </form>
  );
}
