import React, { useState } from 'react';
import './App.css';
import Navbar from './components/navbar';
import RegistrationPage from './components/RegistrationPage';
import LoginPage from './components/LoginPage';
import FindAPark from './components/findapark';
import About from './components/about';
import ActivatePage from './components/activate';
import PurchaseForm from './components/purchase';
import PaymentForm from './components/payment';
import HomePage from './components/home';
import UserPage from './components/UserData';
import { AuthProvider } from './AuthContext';

function App() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipcode: '',
    quantity: 1,
    payment: 'credit',
  });

  const handlePurchaseSubmit = (e) => {
    e.preventDefault();
    window.location.href = '/payment';
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('http://http://127.0.0.1:5000/purchase', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      alert(`Thank you, ${formData.name}! You have successfully purchased ${formData.quantity} NPS ExpressPass(es) using ${formData.payment}.`);
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        zipcode: '',
        quantity: 1,
        payment: 'credit',
      });
      window.location.href = '/home';
    } else {
      alert('There was an error processing your purchase. Please try again.');
    }
  };

  const isRegisterPage = window.location.pathname === '/register';
  const isLoginPage = window.location.pathname === '/login';
  const isFindAParkPage = window.location.pathname === '/findapark';
  const isAboutPage = window.location.pathname === '/about';
  const isActivatePage = window.location.pathname === '/activate';
  const isPurchasePage = window.location.pathname === '/purchase';
  const isPaymentPage = window.location.pathname === '/payment';
  const isHomePage = window.location.pathname === '/home';
  const isUserPage = window.location.pathname === '/userdata';

  return (
    <AuthProvider>
      <div>
      {isHomePage && <HomePage />}
        <Navbar />
       
        {isRegisterPage && <RegistrationPage />}
        {isLoginPage && <LoginPage />}
        {isFindAParkPage && <FindAPark />}
        {isAboutPage && <About />}
        {isActivatePage && <ActivatePage />}
        {isPurchasePage && (
          <PurchaseForm
            formData={formData}
            setFormData={setFormData}
            handleSubmit={handlePurchaseSubmit}
          />
        )}
        {isPaymentPage && (
          <PaymentForm
            formData={formData}
            setFormData={setFormData}
            handleSubmit={handlePaymentSubmit}
          />
        )}
        {isUserPage && <UserPage />}
     
      </div>
    </AuthProvider>
  );
}

export default App;
