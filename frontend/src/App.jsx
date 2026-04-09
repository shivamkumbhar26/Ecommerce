import { useState } from 'react'
import { useContext , createContext } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import './App.css'
import Home from './pages/Home'
import Login from './pages/Login'
import Products from './pages/Products'




export const LoginContext = createContext() 

function App() {
  

  const [loginStatus, setLoginStatus] = useState(false)
  const [role, setRole] = useState('USER')
  console.log(role)
  return (
    <>
      <LoginContext.Provider value={{ loginStatus, setLoginStatus, role, setRole }}>
        <Routes>
          <Route path='/*' element={<Home />} />
          <Route path='/home' element={<Home />}/>
          <Route path='/login' element={<Login />} />
          <Route path='/products' element={<Products />} />

        </Routes>
      </LoginContext.Provider>
      <ToastContainer />
    </>
  )
}

export default App
