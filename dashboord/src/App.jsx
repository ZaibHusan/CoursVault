import React from 'react'
import Approutes from './routes/Approutes'
import { useAuth } from './hook/useAuth';
import { useEffect } from 'react';
import LoadingScreen from './components/LoadingScreen/LoadingScreen';

export default function App() {
  const { checkAuthStatus, isLoading } = useAuth();

  useEffect(() => {
    checkAuthStatus();
  }, [])



  if (isLoading) {
    return <LoadingScreen />
  }
  return <Approutes />
}
