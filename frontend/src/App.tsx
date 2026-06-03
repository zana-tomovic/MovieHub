import { BrowserRouter, Route, Routes } from 'react-router-dom'
import SearchBar from './components/Homepage/SearchBar/SearchBar'
import MovieTab from './components/MovieTab/MovieTab'
import Login from './components/User/Login/Login'
import Register from './components/User/Register/Register'
import './App.css'
import Homepage from './components/Homepage/Homepage'
import UserNav from './components/User/Account/UserNav'

function App() {

  return (
    <BrowserRouter>
      <div className="app-components">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/search" element={<SearchBar />} />
          <Route path="/movie/:key" element={<MovieTab />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/user/:username" element={<UserNav />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
