import React, { useState, useEffect } from 'react';


// API Configuration - COMMENTED OUT FOR REFACTOR
// const API_BASE = 'http://localhost:3013';

// SVG components for icons
const BackIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 12H5M12 19L5 12L12 5" stroke="#8A8A8A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const MenuIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="4" width="7" height="7" rx="1" stroke="#8A8A8A" strokeWidth="2"/>
    <rect x="4" y="13" width="7" height="7" rx="1" stroke="#8A8A8A" strokeWidth="2"/>
    <rect x="13" y="4" width="7" height="7" rx="1" stroke="#8A8A8A" strokeWidth="2"/>
    <rect x="13" y="13" width="7" height="7" rx="1" stroke="#8A8A8A" strokeWidth="2"/>
  </svg>
);

const DiamondIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L2 12L12 22L22 12L12 2Z" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const GiftIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 12V22H4V12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M22 7H2V12H22V7Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 22V7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 7H7.5C6.83696 7 6.20107 6.73661 5.73223 6.26777C5.26339 5.79893 5 5.16304 5 4.5C5 3.83696 5.26339 3.20107 5.73223 2.73223C6.20107 2.26339 6.83696 2 7.5 2C11 2 12 7 12 7Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 7H16.5C17.163 7 17.7989 6.73661 18.2678 6.26777C18.7366 5.79893 19 5.16304 19 4.5C19 3.83696 18.7366 3.20107 18.2678 2.73223C17.7989 2.26339 17.163 2 16.5 2C13 2 12 7 12 7Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ChevronRightIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 18L15 12L9 6" stroke="#8A8A8A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Thinking animation component
const ThinkingAnimation = () => {
  return (
    <div style={{
      position: 'relative',
      width: '38.53px',
      height: '40px',
      flex: 'none',
      order: 0,
      flexGrow: 0,
      animation: 'pulse 2s infinite ease-in-out'
    }}>
      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(0.95); }
            50% { transform: scale(1.05); }
            100% { transform: scale(0.95); }
          }
        `}
      </style>
      <div style={{
        position: 'absolute',
        width: '35.5px',
        height: '37.11px',
        left: '0px',
        top: '3.02px',
        background: 'rgba(190, 219, 255, 0.25)',
        transform: 'rotate(-4.88deg)'
      }}></div>
      <div style={{
        position: 'absolute',
        width: '29.05px',
        height: '30.02px',
        left: '4.74px',
        top: '4.99px',
        background: '#8EC5FF'
      }}></div>
    </div>
  );
};

// Thinking overlay component
const ThinkingOverlay = ({ onClose }) => {
  const [messageIndex, setMessageIndex] = useState(0);
  const messages = [
    'Extracting key findings...',
    'Analyzing methodology...',
    'Identifying citations...',
    'Processing conclusions...',
    'Evaluating impact...'
  ];
  
  // Cycle through messages every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [messages.length]);
  
  return (
    <div style={{
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '0px',
      isolation: 'isolate',
      position: 'absolute',
      width: '300px',
      height: '227px',
      left: '0',
      top: '0',
      background: 'rgba(56, 56, 61, 0.9)',
      border: '1px solid #3F3F47',
      boxShadow: '0px 83px 33px rgba(0, 0, 0, 0.01), 0px 47px 28px rgba(0, 0, 0, 0.05), 0px 21px 21px rgba(0, 0, 0, 0.09), 0px 5px 11px rgba(0, 0, 0, 0.1)',
      backdropFilter: 'blur(10px)',
      borderRadius: '8px',
      zIndex: 10
    }}>
      {/* Top Bar (hidden but in the DOM) */}
      <div style={{ 
        boxSizing: 'border-box',
        display: 'none',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px',
        gap: '199px',
        width: '300px',
        height: '46px',
        background: 'rgba(56, 56, 61, 0.9)',
        borderBottom: '1px solid #52525C',
        flex: 'none',
        order: 0,
        alignSelf: 'stretch',
        flexGrow: 0,
        zIndex: 0
      }}></div>
      
      {/* Container */}
      <div style={{ 
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '12px',
        gap: '12px',
        width: '300px',
        height: '227px',
        flex: 'none',
        order: 1,
        alignSelf: 'stretch',
        flexGrow: 1,
        zIndex: 1
      }}>
        {/* Animation */}
        <ThinkingAnimation />
        
        {/* Text Content */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '0px',
          gap: '4px',
          width: '276px',
          height: '49px',
          flex: 'none',
          order: 1,
          alignSelf: 'stretch',
          flexGrow: 0
        }}>
          {/* Title */}
          <div style={{
            width: '150px',
            height: '24px',
            fontFamily: "'Poppins'",
            fontStyle: 'normal',
            fontWeight: 600,
            fontSize: '16px',
            lineHeight: '24px',
            textAlign: 'center',
            letterSpacing: '-0.005em',
            color: '#F4F4F5',
            flex: 'none',
            order: 0,
            flexGrow: 0
          }}>
            Elacity is thinking...
          </div>
          
          {/* Subtitle */}
          <div style={{
            width: '276px',
            height: '21px',
            fontFamily: "'Poppins'",
            fontStyle: 'normal',
            fontWeight: 500,
            fontSize: '14px',
            lineHeight: '21px',
            textAlign: 'center',
            letterSpacing: '-0.005em',
            color: '#9F9FA9',
            flex: 'none',
            order: 1,
            alignSelf: 'stretch',
            flexGrow: 0
          }}>
            {messages[messageIndex]}
          </div>
        </div>
      </div>
      
      {/* Close button */}
      <div 
        onClick={onClose}
        style={{
          position: 'absolute',
          width: '14px',
          height: '14px',
          right: '12px',
          top: '12px',
          cursor: 'pointer',
          flex: 'none',
          order: 2,
          flexGrow: 0,
          zIndex: 2
        }}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12.25 1.75L1.75 12.25M1.75 1.75L12.25 12.25" stroke="#737373" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
  );
};

// Toggle switch component
const ToggleSwitch = ({ isOn, handleToggle, disabled = false }) => {
  return (
    <div 
      onClick={disabled ? undefined : handleToggle}
      style={{
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: isOn ? 'flex-end' : 'flex-start',
        alignItems: 'center',
        padding: '2px',
        gap: '8px',
        width: '36px',
        height: '20px',
        background: disabled ? '#3F3F47' : isOn ? 'linear-gradient(147.93deg, rgba(81, 162, 255, 0.18) 17.31%, rgba(43, 127, 255, 0.054) 82.69%), #09090B' : '#52525C',
        borderRadius: '999px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'background-color 0.3s',
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <div
        style={{
          width: '16px',
          height: '16px',
          background: disabled ? '#71717B' : isOn ? '#F4F4F5' : '#D4D4D8',
          borderRadius: '999px',
          transition: 'left 0.3s',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {disabled && (
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 4V3C9 2.20435 8.68393 1.44129 8.12132 0.87868C7.55871 0.316071 6.79565 0 6 0C5.20435 0 4.44129 0.316071 3.87868 0.87868C3.31607 1.44129 3 2.20435 3 3V4M2 4H10C10.5523 4 11 4.44772 11 5V10C11 10.5523 10.5523 11 10 11H2C1.44772 11 1 10.5523 1 10V5C1 4.44772 1.44772 4 2 4Z" stroke="#9F9FA9" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>
    </div>
  );
};

function App() {
  const [currentUrl, setCurrentUrl] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // State for toggle switches
  const [preferences, setPreferences] = useState({
    alertsForListings: true,
    alertsForMessages: true,
    autoScanPages: false,
    provideImprovementData: true
  });
  
  // State for thinking overlay visibility
  const [showThinking, setShowThinking] = useState(false);

  // Authentication helper functions - COMMENTED OUT FOR REFACTOR
  /*
  const getAuthData = () => {
    return new Promise((resolve) => {
      chrome.storage.local.get(['elacity_session_token', 'elacity_user_data'], resolve);
    });
  };

  const clearAuthData = () => {
    chrome.storage.local.remove(['elacity_session_token', 'elacity_user_data']);
    setIsAuthenticated(false);
    setUserData(null);
  };

  const checkAuthStatus = async () => {
    try {
      const { elacity_session_token, elacity_user_data } = await getAuthData();
      
      if (!elacity_session_token) {
        setIsAuthenticated(false);
        setUserData(null);
        setLoading(false);
        return;
      }
      
      // Validate session with backend
      const response = await fetch(`${API_BASE}/api/validate-session`, {
        headers: { 'x-session-token': elacity_session_token }
      });
      const data = await response.json();
      
      if (data.valid) {
        // Map API fields to extension expected fields
        const mappedUserData = {
          user_id: data.user_id,
          plan: data.account_type || 'Free',
          credits_remaining: data.credit_balance || 0,
          credits_total: data.credit_balance || 500, // Default to same as remaining for now
          username: data.username
        };
        setIsAuthenticated(true);
        setUserData(mappedUserData);
      } else {
        clearAuthData();
      }
    } catch (error) {
      console.error('Auth validation failed:', error);
      clearAuthData();
    } finally {
      setLoading(false);
    }
  };

  const initiateLogin = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/extension-auth-url?redirect_to=${encodeURIComponent(currentUrl)}`);
      const data = await response.json();
      chrome.tabs.create({ url: data.auth_url });
    } catch (error) {
      console.error('Failed to initiate login:', error);
    }
  };

  const handleLogout = () => {
    clearAuthData();
  };
  */

  useEffect(() => {
    // Get current tab URL
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        setCurrentUrl(tabs[0].url);
      }
    });

    // Check authentication status - COMMENTED OUT
    // checkAuthStatus();

    // Listen for auth success messages - COMMENTED OUT
    /*
    const messageListener = (message) => {
      if (message.action === 'authSuccess') {
        console.log('Popup received auth success:', message.userData);
        setIsAuthenticated(true);
        setUserData(message.userData);
        setLoading(false);
      }
    };

    chrome.runtime.onMessage.addListener(messageListener);
    return () => chrome.runtime.onMessage.removeListener(messageListener);
    */
    
    setLoading(false); // Set loading to false since auth is commented out
  }, []);

  const handleToggle = (preference) => {
    setPreferences({
      ...preferences,
      [preference]: !preferences[preference]
    });
  };



  return (
    <div style={{
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center',
      padding: '0px',
      width: '300px',
      height: 'auto',
      background: 'rgba(80, 80, 90, 0.85)',
      boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
      backdropFilter: 'blur(10px)',
      borderRadius: '0',
      fontFamily: "'Poppins', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      color: '#FFFFFF',
      overflowX: 'hidden',
      overflowY: 'hidden',
      position: 'relative'
    }}>
      {/* Render the Thinking overlay if showThinking is true */}
      {showThinking && (
        <ThinkingOverlay onClose={() => setShowThinking(false)} />
      )}
      
      {/* Top Bar */}
      <div style={{ 
        boxSizing: 'border-box',
        display: 'flex', 
        flexDirection: 'row',
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '8px',
        gap: '120px',
        width: '300px',
        height: '44px',
        background: '#3A3A3E',
        borderBottom: '1px solid #52525C',
        flex: 'none',
        order: 0,
        alignSelf: 'stretch',
        flexGrow: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ fontWeight: 600, fontSize: '14px', color: '#F4F4F5', fontFamily: 'Poppins, system-ui, sans-serif' }}>
            Elacity
          </div>
          <div style={{ marginLeft: '12px', fontWeight: 500, fontSize: '12px', color: '#9F9FA9', fontFamily: 'Poppins, system-ui, sans-serif', cursor: 'pointer' }}>
            {/* Login functionality commented out */}
          </div>
        </div>
        <div style={{ width: '18px', height: '18px', flex: 'none', order: 2, flexGrow: 0 }}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 5.25V5.25M9 9V9M9 12.75V12.75" stroke="#71717B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
      
      {/* Plan Section */}
      <div style={{ 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        padding: '8px 12px 6px',
        gap: '8px',
        width: '300px',
        height: 'auto',
        flex: 'none',
        order: 1,
        alignSelf: 'stretch',
        flexGrow: 0
      }}>
        {/* Container */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          padding: 0,
          gap: '8px',
          width: '276px',
          height: 'auto',
          flex: 'none',
          order: 0,
          alignSelf: 'stretch',
          flexGrow: 0
        }}>
          {/* Text Content */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            padding: 0,
            gap: '4px',
            width: '276px',
            height: 'auto',
            flex: 'none',
            order: 0,
            alignSelf: 'stretch',
            flexGrow: 0
          }}>
            <div style={{
              fontSize: '16px',
              fontWeight: 600,
              color: '#F4F4F5',
              marginBottom: '4px'
            }}>
              Research Copilot
            </div>
            <div style={{
              fontSize: '14px',
              color: '#9F9FA9'
            }}>
              Elacity helps you read academic papers faster, critique deeper, and think clearer. Currently in development for arXiv papers and scientific articles.
            </div>
          </div>
          

        </div>
      </div>
      

      
      {/* Support section */}
      <div style={{ 
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: '6px 12px',
        gap: '6px',
        width: '300px',
        height: 'auto',
        flex: 'none',
        order: 2,
        alignSelf: 'stretch',
        flexGrow: 0
      }}>
        <div style={{
          width: '276px',
          height: '18px',
          fontFamily: "'Poppins'",
          fontStyle: 'normal',
          fontWeight: 600,
          fontSize: '16px',
          lineHeight: '18px',
          letterSpacing: '-0.005em',
          color: '#F4F4F5',
          flex: 'none',
          order: 0,
          alignSelf: 'stretch',
          flexGrow: 0,
          marginBottom: '4px'
        }}>
          Support
        </div>
        
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          padding: 0,
          gap: '8px',
          width: '276px',
          height: 'auto',
          flex: 'none',
          order: 1,
          alignSelf: 'stretch',
          flexGrow: 0
        }}>
          {/* Support contact */}
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 0,
            gap: '10px',
            width: '276px',
            height: 'auto',
            flex: 'none',
            order: 0,
            alignSelf: 'stretch',
            flexGrow: 0,
            cursor: 'pointer',
            marginBottom: '2px'
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1px'
            }}>
              <div style={{
                fontSize: '13px',
                fontWeight: 500,
                color: '#F4F4F5'
              }}>
                Contact support
              </div>
              <div style={{
                fontSize: '11px',
                color: '#9F9FA9'
              }}>
                Get help with Elacity features
              </div>
            </div>
            <div>
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.25 10.5L9.33333 7L5.25 3.5" stroke="#71717B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          
          {/* Provide feedback */}
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 0,
            gap: '10px',
            width: '276px',
            height: 'auto',
            flex: 'none',
            order: 1,
            alignSelf: 'stretch',
            flexGrow: 0,
            cursor: 'pointer'
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1px'
            }}>
              <div style={{
                fontSize: '13px',
                fontWeight: 500,
                color: '#F4F4F5'
              }}>
                Provide feedback
              </div>
              <div style={{
                fontSize: '11px',
                color: '#9F9FA9'
              }}>
                Help us improve Elacity
              </div>
            </div>
            <div>
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.25 10.5L9.33333 7L5.25 3.5" stroke="#71717B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      {/* Development Card */}
      <div style={{ 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        padding: '6px 12px 12px',
        gap: '8px',
        width: '300px',
        height: 'auto',
        flex: 'none',
        order: 4,
        alignSelf: 'stretch',
        flexGrow: 0
      }}>
        <div style={{
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          padding: '12px',
          gap: '12px',
          width: '276px',
          height: 'auto',
          background: '#3F3F47',
          border: '1px solid #52525C',
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.14), 0px 1px 3px rgba(0, 0, 0, 0.12)',
          borderRadius: '8px',
          flex: 'none',
          order: 0,
          flexGrow: 0
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            padding: 0,
            gap: '8px',
            width: '252px',
            height: '24px',
            flex: 'none',
            order: 0,
            alignSelf: 'stretch',
            flexGrow: 0
          }}>
            <div style={{
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              padding: '4px',
              gap: '6px',
              width: '22px',
              height: '22px',
              background: '#52525C',
              border: '1px solid #71717B',
              borderRadius: '6px',
              flex: 'none',
              order: 0,
              flexGrow: 0
            }}>
              <svg width="14" height="14" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 1.5L11.3775 6.32L16.5 7.08L12.75 10.77L13.7575 16L9 13.5L4.2425 16L5.25 10.77L1.5 7.08L6.6225 6.32L9 1.5Z" fill="#F4F4F5"/>
              </svg>
            </div>
            <div style={{
              fontSize: '13px',
              fontWeight: 600,
              color: '#F4F4F5'
            }}>
              Early Access
            </div>
          </div>
          
          <div style={{
            fontSize: '12px',
            color: '#9F9FA9',
            marginBottom: '6px'
          }}>
            Elacity is currently in development. Research analysis features will be available soon.
          </div>
          
          <div style={{
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            padding: '4px 8px',
            gap: '8px',
            width: '252px',
            height: '24px',
            background: '#52525C',
            border: '1px solid #71717B',
            borderRadius: '4px',
            flex: 'none',
            order: 2,
            flexGrow: 0
          }}>
            <div style={{
              fontSize: '11px',
              color: '#9F9FA9',
              flex: 'none',
              order: 1,
              flexGrow: 1,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              Development in progress...
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;