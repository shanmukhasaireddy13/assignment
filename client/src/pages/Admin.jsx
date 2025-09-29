import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { AppContent } from '../context/AppContexts'
import { useNavigate } from 'react-router-dom'

const Admin = () => {
  const navigate = useNavigate()
  const { backendUrl, isLoggedin, authChecked, userData } = useContext(AppContent)
  const [users, setUsers] = useState([])
  const [logs, setLogs] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [userDetail, setUserDetail] = useState(null)
  const [editUser, setEditUser] = useState({ name:'', email:'', newPassword:'' })
  const [newTask, setNewTask] = useState({ title:'', description:'' })
  const [query, setQuery] = useState('')
  const [activeTab, setActiveTab] = useState('profile') // profile | tasks | logs

  const load = async () => {
    const u = await axios.get(backendUrl + '/api/v1/admin/users')
    const a = await axios.get(backendUrl + '/api/v1/admin/audits')
    if (u.data.success) setUsers(u.data.data)
    if (a.data.success) setLogs(a.data.data)
  }
  // role changes removed per request

  const selectUser = async (u) => {
    setSelectedUser(u)
    const { data } = await axios.get(backendUrl + '/api/v1/admin/users/' + u._id)
    if (data.success) {
      setUserDetail(data.data)
      setEditUser({ name: data.data.user.name, email: data.data.user.email, newPassword:'' })
      setActiveTab('profile')
    }
  }

  const saveUserProfile = async (e) => {
    e.preventDefault()
    await axios.put(backendUrl + '/api/v1/admin/users/' + selectedUser._id, { name: editUser.name, email: editUser.email })
    if (editUser.newPassword) {
      await axios.put(backendUrl + '/api/v1/admin/users/' + selectedUser._id + '/password', { newPassword: editUser.newPassword })
    }
    await load()
    await selectUser(selectedUser)
  }

  const deleteUser = async () => {
    await axios.delete(backendUrl + '/api/v1/admin/users/' + selectedUser._id)
    setSelectedUser(null)
    setUserDetail(null)
    load()
  }

  const addTask = async (e) => {
    e.preventDefault()
    await axios.post(backendUrl + '/api/v1/admin/users/' + selectedUser._id + '/tasks', newTask)
    setNewTask({ title:'', description:'' })
    selectUser(selectedUser)
  }

  const updateTask = async (taskId, patch) => {
    await axios.put(backendUrl + '/api/v1/admin/tasks/' + taskId, patch)
    selectUser(selectedUser)
  }

  const deleteTask = async (taskId) => {
    await axios.delete(backendUrl + '/api/v1/admin/tasks/' + taskId)
    selectUser(selectedUser)
  }

  useEffect(()=>{
    if (!authChecked) return
    if (!isLoggedin) return navigate('/login')
    if (userData?.role !== 'admin') return navigate('/')
    load()
  },[authChecked, isLoggedin, userData])

  const logout = async () => {
    try {
      axios.defaults.withCredentials = true
      const { data } = await axios.post(backendUrl + '/api/v1/auth/logout')
      if (data.success) {
        navigate('/login')
      }
    } catch (e) {}
  }

  return (
    <div className='p-6 max-w-7xl mx-auto'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-semibold'>Admin</h1>
        <button onClick={logout} className='border px-3 py-1.5 rounded text-sm'>Logout</button>
      </div>
      <div className='grid grid-cols-1 lg:grid-cols-12 gap-6'>
        <aside className='lg:col-span-4 xl:col-span-3'>
          <div className='border rounded p-3 mb-3'>
            <div className='flex items-center justify-between mb-2'>
              <div className='font-medium'>Users</div>
              <span className='text-xs text-gray-500'>Total: {users.length}</span>
            </div>
            <input value={query} onChange={e=>setQuery(e.target.value)} placeholder='Search users' className='border rounded w-full p-2 text-sm mb-2'/>
            <div className='max-h-[520px] overflow-auto'>
              <table className='w-full text-sm'>
                <thead>
                  <tr className='text-left text-gray-500 text-xs'>
                    <th className='p-2'>Name</th>
                    <th className='p-2'>Email</th>
                    <th className='p-2'>Role</th>
                  </tr>
                </thead>
                <tbody>
                  {users.filter(u => (u.name+u.email).toLowerCase().includes(query.toLowerCase())).map(u => (
                    <tr key={u._id} className={`cursor-pointer ${selectedUser?._id===u._id?'bg-blue-50':''}`} onClick={()=>selectUser(u)}>
                      <td className='p-2 align-top'>
                        <div className='font-medium'>{u.name}</div>
                        <div className='text-[11px] text-gray-500'>Tasks: {u.taskCount ?? 0}</div>
                      </td>
                      <td className='p-2 align-top'>{u.email}</td>
                      <td className='p-2 align-top'>{u.role}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </aside>
        <main className='lg:col-span-8 xl:col-span-9'>
          {!userDetail && (
            <div className='border rounded p-6 text-sm text-gray-500'>Select a user from the left to manage profile, password, role and tasks.</div>
          )}
          {userDetail && (
            <div className='space-y-4'>
              <div className='border-b flex gap-4 text-sm'>
                <button className={`py-2 ${activeTab==='profile'?'border-b-2 border-blue-600 text-blue-700':''}`} onClick={()=>setActiveTab('profile')}>Profile</button>
                <button className={`py-2 ${activeTab==='tasks'?'border-b-2 border-blue-600 text-blue-700':''}`} onClick={()=>setActiveTab('tasks')}>Tasks ({userDetail.taskCount})</button>
                <button className={`py-2 ${activeTab==='logs'?'border-b-2 border-blue-600 text-blue-700':''}`} onClick={()=>setActiveTab('logs')}>Logs</button>
              </div>
              {activeTab==='profile' && (
                <form onSubmit={saveUserProfile} className='border rounded p-4'>
                  <div className='font-medium mb-2'>User Profile</div>
                  <div className='text-xs text-gray-500 mb-4'>Created: {new Date(userDetail.user.createdAt).toLocaleString()}</div>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                      <label className='block text-sm mb-1'>Name</label>
                      <input className='border rounded w-full p-2' value={editUser.name} onChange={e=>setEditUser({...editUser, name:e.target.value})}/>
                    </div>
                    <div>
                      <label className='block text-sm mb-1'>Email</label>
                      <input className='border rounded w-full p-2' value={editUser.email} onChange={e=>setEditUser({...editUser, email:e.target.value})}/>
                    </div>
                    <div>
                      <label className='block text-sm mb-1'>New Password</label>
                      <input className='border rounded w-full p-2' type='password' value={editUser.newPassword} onChange={e=>setEditUser({...editUser, newPassword:e.target.value})}/>
                    </div>
                  </div>
                <div className='flex flex-wrap gap-2 mt-4'>
                    <button className='px-3 py-2 bg-blue-600 text-white rounded'>Save</button>
                    <button type='button' onClick={deleteUser} className='px-3 py-2 border rounded'>Delete User</button>
                    
                  </div>
                </form>
              )}
              {activeTab==='tasks' && (
                <div className='border rounded p-4'>
                  <div className='font-medium mb-3'>Tasks</div>
                  <form onSubmit={addTask} className='flex gap-2 mb-4'>
                    <input className='border p-2 flex-1' placeholder='Title' value={newTask.title} onChange={e=>setNewTask({...newTask, title:e.target.value})}/>
                    <input className='border p-2 flex-1' placeholder='Description' value={newTask.description} onChange={e=>setNewTask({...newTask, description:e.target.value})}/>
                    <button className='px-3 bg-blue-600 text-white rounded'>Add</button>
                  </form>
                  <div className='space-y-2 max-h-[420px] overflow-auto'>
                    {userDetail.tasks.map(t => (
                      <div key={t._id} className='border p-3 rounded'>
                        <div className='flex justify-between'>
                          <div className='font-medium'>{t.title}</div>
                          <div className='text-xs text-gray-500'>{new Date(t.createdAt).toLocaleString()}</div>
                        </div>
                        <div className='text-sm text-gray-700'>{t.description}</div>
                        <div className='mt-2 space-x-2'>
                          <button className='px-2 py-1 border rounded' onClick={()=>updateTask(t._id,{ status: t.status==='done'?'todo':'done' })}>Toggle Done</button>
                          <button className='px-2 py-1 border rounded' onClick={()=>deleteTask(t._id)}>Delete</button>
                        </div>
                      </div>
                    ))}
                    {userDetail.tasks.length===0 && <div className='text-sm text-gray-500'>No tasks yet.</div>}
                  </div>
                </div>
              )}
              {activeTab==='logs' && (
                <div className='border rounded p-4'>
                  <div className='font-medium mb-3'>Recent Audit Logs</div>
                  <div className='max-h-[420px] overflow-auto text-sm'>
                    {logs.map(l => (
                      <div key={l._id} className='border-b p-2'>
                        <div className='text-gray-700'>{l.action}</div>
                        <div className='text-gray-500'>{new Date(l.createdAt).toLocaleString()}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default Admin


