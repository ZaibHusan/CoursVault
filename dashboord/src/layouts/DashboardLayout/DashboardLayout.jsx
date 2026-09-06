import React from 'react'
import { Outlet } from 'react-router-dom'
import './DashboardLayout.css'
import Sidebar from '../../components/sidebar/Sidebar'
export default function DashboardLayout() {
  return (
    <div className='DashboardLayout'>
      <Sidebar />
      <Outlet />
    </div>
  )
}
