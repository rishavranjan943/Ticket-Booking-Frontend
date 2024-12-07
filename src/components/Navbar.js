import React, { useContext } from 'react'
import {Link} from 'react-router-dom'
import {AuthContext} from '../context/AuthContext'
import './Navbar.css'
export default function Navbar() {
    const {user,logout}=useContext(AuthContext)
  return (
    <>
        <nav>
            <Link to='/'>Home</Link>
            {user ? (
                <>
                    <span>Welcome, {user.name}</span>
                    {user.isAdmin && <Link to='/add-event'>Add Event</Link>}
                    {user.isAdmin && <Link to='/admin'>Admin Panel</Link>}
                    <button className='logout' onClick={logout}>Logout</button>
                </>
            ) : (
                <>
                    <Link to='/login'>Login</Link>
                    <Link to='/register'>Register</Link>
                </>
            )}
        </nav>
    </>
  )
}
