import React, { useContext } from 'react'
import { Routes,Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Admin from './pages/Admin'
import { ToastContainer } from 'react-toastify';
import { AppContent } from './context/AppContexts'


const App = () => {
  const { authChecked, isLoggedin, userData } = useContext(AppContent)
  return (
    <div>
      <ToastContainer/>
      <Routes>
        <Route path='/' element={authChecked && isLoggedin && userData?.role === 'admin' ? <Admin/> : <Home/>}/>
        <Route path='/login' element={<Login/>}/>
      </Routes>
    </div>
  )
}

export default App
