import React, { useEffect } from 'react';
import Navbar from './components/navbar';
import RegistrationPage from './components/RegistrationPage';
import LoginPage from './components/LoginPage';
import FindAPark from './components/findapark';
import About from './components/about';
import ActivatePage from './components/activate';
import PurchaseForm from './components/purchase';
import PaymentForm from './components/payment';
import CampPage from './components/fetch_campsites';
import UserPage from './components/useredit';
import { AuthProvider } from './AuthContext';
import backgroundImage from './images/22.jpg';

function App() {
  const isRegisterPage = window.location.pathname === '/register';
  const isLoginPage = window.location.pathname === '/login';
  const isFindAParkPage = window.location.pathname === '/findapark';
  const isAboutPage = window.location.pathname === '/about';
  const isActivatePage = window.location.pathname === '/activate';
  const isPurchasePage = window.location.pathname === '/purchase';
  const isPaymentPage = window.location.pathname === '/payment';
  const isCampPage = window.location.pathname === '/fetch_campsites';
  const isUserPage = window.location.pathname === '/useredit';
  const isHomePage = window.location.pathname === '/';

  useEffect(() => {
    (function(d, s, id) {
      if (d.getElementById(id)) {
        if (window.__TOMORROW__) {
          window.__TOMORROW__.renderWidget();
        }
        return;
      }
      const fjs = d.getElementsByTagName(s)[0];
      const js = d.createElement(s);
      js.id = id;
      js.src = "https://www.tomorrow.io/v1/widget/sdk/sdk.bundle.min.js";
      fjs.parentNode.insertBefore(js, fjs);
    })(document, 'script', 'tomorrow-sdk');
  }, []);

  const homePageStyles = {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    minHeight: '100vh',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
    paddingTop: '20px',
    justifyContent: 'space-between',
  };

  const headerStyles = {
    alignSelf: 'flex-start',
    marginLeft: '30px',
    marginTop: '40px',
    color: 'white',
    fontSize: '36px',
  };

  const contentContainerStyles = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '80%',
    maxWidth: '1200px',
    marginTop: '20px',
  };

  const linksContainerStyles = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    color: 'white',
    textAlign: 'right', 
    alignItems: 'flex-end', 
    marginLeft: '1000px'
  };

  const linkStyles = {
    color: '#ffff',
    textDecoration: 'none',
    fontSize: '18px',
    transition: 'color 0.3s ease',
  };

  const widgetContainerStyles = {
    width: '100%',
    maxWidth: '1200px',
    marginTop: '20px',
    marginBottom: '20px',
    alignSelf: 'center',
  };

  return (
    <AuthProvider>
      <div>
        <Navbar />
        {isHomePage && (
          <div style={homePageStyles}>
            <div>
              <h2 style={headerStyles}>Welcome to NPS ExpressPass</h2>
              <div style={contentContainerStyles}>
                <div style={linksContainerStyles}>
                  <a href="/login" style={linkStyles} className="link">Login</a>
                  <a href="/useredit" style={linkStyles} className="link">Update Your Account</a>
                  <a href="https://www.recreation.gov" target="_blank" style={linkStyles} className="link">Make a Reservation</a>
                  <a href="https://www.nps.gov" target="_blank" style={linkStyles} className="link">Explore the Parks</a>
                  <a href="https://www.alltrails.com" target="_blank" style={linkStyles} className="link">Explore Trails</a>
                </div>
              </div>
            </div>
            <div style={widgetContainerStyles}>
              <div className="tomorrow"
                data-location-id="2671744,2594170,2685599,2665901,2572112,333212"
                data-language="EN"
                data-unit-system="IMPERIAL"
                data-skin="dark"
                data-widget-type="aqi6"
                style={{ paddingBottom: '22px', position: 'relative' }}
              >
                <a
                  href="https://www.tomorrow.io/weather-api/"
                  rel="nofollow noopener noreferrer"
                  target="_blank"
                  style={{ position: 'absolute', bottom: 0, transform: 'translateX(-50%)', left: '50%' }}
                >
                  <img
                    alt="Powered by the Tomorrow.io Weather API"
                    src="https://weather-website-client.tomorrow.io/img/powered-by.svg"
                    width="250"
                    height="18"
                  />
                </a>
              </div>
            </div>
          </div>
        )}
        {isRegisterPage && <RegistrationPage />}
        {isLoginPage && <LoginPage />}
        {isFindAParkPage && <FindAPark />}
        {isAboutPage && <About />}
        {isActivatePage && <ActivatePage />}
        {isUserPage && <UserPage />}
        {isPurchasePage && <PurchaseForm />}
        {isPaymentPage && <PaymentForm />}
        {isCampPage && <CampPage />}
      </div>
      <style>{`
        .link:hover {
          color: darkgreen;
        }
      `}</style>
    </AuthProvider>
  );
}

export default App;
