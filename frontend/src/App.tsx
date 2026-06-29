import { BrowserRouter, Route, Routes } from 'react-router-dom'
import MovieTab from './components/MovieTab/MovieTab'
import MoviesSearch from './components/MoviesSearch/MoviesSearch'
import Login from './components/User/Login/Login'
import Register from './components/User/Register/Register'
import './App.css'
import Homepage from './components/Homepage/Homepage'
import UserNav from './components/User/Account/UserNav'
import View from './components/UsersSearch/View'

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
          <Route path="/user/:username" element={<UserNav />} />
          <Route path="/users/:username" element={<View />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
