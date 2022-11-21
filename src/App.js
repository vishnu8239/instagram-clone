import {BrowserRouter, Routes, Route} from 'react-router-dom'
import ProtectedRoute from './config/ProtectedRoute'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en.json'

import Home from './pages/Home'
import Error from './pages/Error'
import RegisterPage from './pages/RegisterPage'
import Dashboard from './pages/Dashboard'
import Main from './components/Dashboard/Main'
import Profile from './pages/Profile'
import Inbox from './pages/Inbox'

TimeAgo.addDefaultLocale(en)
TimeAgo.addLocale(en)

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='register' element={<RegisterPage />} />
        <Route path='/' element={<ProtectedRoute />}>
          <Route path='/' element={<Dashboard />}>
            <Route path='dashboard' element={<Main />} />
            <Route path='profile' element={<Profile />} />
            <Route path='inbox' element={<Inbox />} />
          </Route>
        </Route>
        <Route path='*' element={<Error />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
