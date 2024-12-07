import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import EventList from './components/EventList';
import EventDetails from './pages/EventDetails';
import Login from './pages/LoginPage';
import Register from './pages/RegisterPage';
import AdminPanel from './pages/AdminPanel';
import { AuthProvider } from './context/AuthContext';
import EventForm from './components/EventForm';
import UpdateEvent from './pages/UpdateEvent';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<EventList />} />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/add-event" element={<EventForm />} />
          <Route path="/update-event/:id" element={<UpdateEvent />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
