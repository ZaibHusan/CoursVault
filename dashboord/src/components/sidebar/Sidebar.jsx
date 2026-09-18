import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Library, Inbox, LogOut, ShieldCheck } from 'lucide-react';
import './Sidebar.css';
import { useAuth } from '../../hook/useAuth';

export default function Sidebar() {
    const { logout } = useAuth();

    return (
        <aside className="admin-sidebar">
            {/* Top: Logo */}
            <div className="sidebar-brand">
                <ShieldCheck size={28} color="#E63946" />
                <span className="brand-text">CoursesGuy</span>
            </div>

            {/* Middle: Navigation Links */}
            <nav className="sidebar-nav">
                <NavLink to="/home" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                    <LayoutDashboard size={20} />
                    <span className="nav-label">Home</span>
                </NavLink>
                
                <NavLink to="/courses" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                    <Library size={20} />
                    <span className="nav-label">Courses</span>
                </NavLink>
                
                <NavLink to="/orders" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                    <Inbox size={20} />
                    <span className="nav-label">Orders</span>
                </NavLink>
            </nav>

            {/* Bottom: Logout */}
            <div className="sidebar-footer">
                <button onClick={logout} className="logout-btn">
                    <LogOut size={20} />
                    <span className="nav-label">Logout</span>
                </button>
            </div>
        </aside>
    );
}