import { BrowserRouter, Route, Routes } from 'react-router-dom'
import SearchBar from './components/SearchBar'
import MovieTab from './components/MovieTab/MovieTab'
import Login from './components/User/Login/Login'
import Register from './components/User/Register/Register'
import './App.css'
import Account from './components/User/Account/Account'

function App() {

  return (
    <BrowserRouter>
      <div className="app-components">
        <Routes>
          <Route path="/" element={<SearchBar />} />
          <Route path="/movie/:id" element={<MovieTab />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/account/:username" element={<Account />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
