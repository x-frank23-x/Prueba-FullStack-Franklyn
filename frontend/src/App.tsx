import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Dashboard from './pages/Dashboard';
import ProtectRouter from './componets/ProtectRouter';
import SingUp from './pages/SingUp';
import Nav from './componets/Nav';
import Login from './pages/Login';
import Home from './pages/Home';
import { AuthProvider } from './functions/AuthContext'; 

function App() {


  return (
    <BrowserRouter>
      <AuthProvider>
        <Nav/> 
        <Routes>
          <Route path='/singUp' element={<SingUp />} />
          <Route path='/login' element={<Login />} />
          <Route path='/' element={<Home />} />
          <Route element={<ProtectRouter />}>
            <Route path='/dashboard' element={<Dashboard />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;