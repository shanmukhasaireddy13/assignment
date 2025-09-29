import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { AppContent } from '../context/AppContexts'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const navigate = useNavigate()
  const { backendUrl, userData, isLoggedin, authChecked, setIsLoggedin, setUserData } = useContext(AppContent)
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const load = async () => {
    const { data } = await axios.get(backendUrl + '/api/v1/tasks')
    if (data.success) setTasks(data.data)
  }
  const add = async (e) => {
    e.preventDefault()
    const { data } = await axios.post(backendUrl + '/api/v1/tasks', { title, description })
    if (data.success) { setTitle(''); setDescription(''); load() }
  }
  const del = async (id) => {
    await axios.delete(backendUrl + '/api/v1/tasks/' + id)
    load()
  }

  const logout = async () => {
    try {
      axios.defaults.withCredentials = true
      const { data } = await axios.post(backendUrl + '/api/v1/auth/logout')
      if (data.success) {
        setIsLoggedin(false)
        setUserData(false)
        navigate('/login')
      }
    } catch (e) {}
  }

  useEffect(() => {
    if (!authChecked) return
    if (!isLoggedin) {
      navigate('/login')
      return
    }
    if (userData?.role === 'admin') return navigate('/admin')
    load()
  }, [authChecked, isLoggedin])
  return (
    <div className='p-6 max-w-3xl mx-auto'>
      <div className='flex justify-between items-center mb-4'>
        <h1 className='text-2xl font-semibold'>Dashboard</h1>
        <button onClick={logout} className='border px-3 py-1 rounded text-sm'>Logout</button>
      </div>
      <form onSubmit={add} className='flex gap-2 mb-4'>
        <input className='border p-2 flex-1' placeholder='Title' value={title} onChange={e=>setTitle(e.target.value)} />
        <input className='border p-2 flex-1' placeholder='Description' value={description} onChange={e=>setDescription(e.target.value)} />
        <button className='bg-blue-600 text-white px-4'>Add</button>
      </form>
      <ul className='space-y-2'>
        {tasks.map(t => (
          <li key={t._id} className='border p-3 flex justify-between'>
            <div>
              <div className='font-medium'>{t.title}</div>
              <div className='text-sm text-gray-600'>{t.description}</div>
            </div>
            <button onClick={()=>del(t._id)} className='text-red-600'>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Home
