import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Homepage from './components/Homepage/Homepage'

import MovieTab from './components/MovieTab/MovieTab'
import MoviesSearch from './components/MoviesSearch/MoviesSearch'
import Login from './components/Login/Login'
import Register from './components/Register/Register'
import User from './components/User/User'

import './App.css'

function App() {

  return (
    <BrowserRouter>
      <div className="app-components">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/search" element={<MoviesSearch />} />
          <Route path="/movie/:key" element={<MovieTab />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/user/:username" element={<User />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
