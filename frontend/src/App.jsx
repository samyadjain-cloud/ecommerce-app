import { useState } from 'react';
import './App.css';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const token = localStorage.getItem('token');

  if (token) {
    return (
        <div className="app-container">
          <h1>Welcome to VOLTA!</h1>
          <button onClick={() => {
            localStorage.removeItem('token');
            window.location.reload();
          }}>
            Logout
          </button>
        </div>
    );
  }

  return (
      <div className="app-container">
        {currentPage === 'login' ? (
            <Login switchToRegister={() => setCurrentPage('register')} />
        ) : (
            <Register switchToLogin={() => setCurrentPage('login')} />
        )}
      </div>
  );
}

export default App;