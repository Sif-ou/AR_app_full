'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AccountPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  
  // Auth state flags
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState<{ name: string; email: string } | null>(null);
  
  // Login Form States
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Registration Form States
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // UI Notification Messaging
  const [statusMessage, setStatusMessage] = useState('');
  const [isError, setIsError] = useState(false);

  // Check profile validation status on mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      const savedToken = localStorage.getItem('token');
      if (!savedToken) return;

      try {
        const response = await fetch('https://ar-app-back-end.onrender.com/api/users/me', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${savedToken}`,
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          setIsLoggedIn(true);
          setLoggedInUser({
            name: data.username,
            email: data.email
          });
          
          // Secondary fallback security catch: redirect to dashboard if profile token indicates admin
          const savedRole = localStorage.getItem('userRole') || data.role;
          if (savedRole === 'ADMIN') {
            router.push('/admin/dashboard');
          }
        } else {
          // If token expired or bad payload returned, flush storage
          localStorage.clear();
        }
      } catch (err) {
        console.error('Failed to authenticate stored session token:', err);
      }
    };

    fetchUserProfile();
  }, [router]);

  // Handle Login Authentication
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage('');
    setIsError(false);

    if (!loginIdentifier || !loginPassword) {
      setIsError(true);
      setStatusMessage('Please fill in all login fields.');
      return;
    }

    try {
      const response = await fetch('https://ar-app-back-end.onrender.com/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          identifier: loginIdentifier,
          password: loginPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Save session storage blocks safely to local storage
        localStorage.setItem('token', data.token);
        localStorage.setItem('userRole', data.role); 
        localStorage.setItem('username', data.username);
        localStorage.setItem('userEmail', data.email);

        setStatusMessage('Welcome back! Logging you in... 🎉');

        // THE ADMIN REDIRECT TRIGGER:
        if (data.role === 'ADMIN') {
          router.push('/admin/dashboard');
        } else {
          setLoggedInUser({
            name: data.username,
            email: data.email
          });
          setIsLoggedIn(true);
          // Clear input components
          setLoginIdentifier('');
          setLoginPassword('');
        }
      } else {
        setIsError(true);
        setStatusMessage(data.message || 'Authentication failed. Please verify credentials.');
      }
    } catch (err) {
      setIsError(true);
      setStatusMessage('Could not connect to the authentication server. Try again later.');
    }
  };

  // Handle New Client Registrations
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage('');
    setIsError(false);

    if (!username || !email || !phoneNumber || !password || !confirmPassword) {
      setIsError(true);
      setStatusMessage('All registration fields are required.');
      return;
    }

    if (password !== confirmPassword) {
      setIsError(true);
      setStatusMessage('Passwords do not match.');
      return;
    }

    try {
      const response = await fetch('https://ar-app-back-end.onrender.com/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          username: username,
          email: email,
          phoneNum: phoneNumber,
          password: password
        })
      });

      if (response.ok) {
        setStatusMessage('Account created successfully! Please sign in with your credentials.');
        // Clean up input fields and flip back to login tab view
        setUsername('');
        setEmail('');
        setPhoneNumber('');
        setPassword('');
        setConfirmPassword('');
        setActiveTab('login');
      } else {
        const errData = await response.json();
        setIsError(true);
        setStatusMessage(errData.message || 'Registration failed. Username or email might be taken.');
      }
    } catch (err) {
      setIsError(true);
      setStatusMessage('Server communication failure during registration setup.');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setLoggedInUser(null);
    setStatusMessage('Logged out safely.');
    setIsError(false);
    router.refresh();
  };

  // Render Client Profile Interface if Authenticated
  if (isLoggedIn && loggedInUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg text-center">
          <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto text-3xl font-bold uppercase">
            {loggedInUser.name.charAt(0)}
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">Your AR Furn Profile</h2>
          <div className="text-left bg-gray-50 p-4 rounded-lg space-y-2 border border-gray-100">
            <p className="text-sm text-gray-500">Username: <span className="font-semibold text-gray-900 block text-base">{loggedInUser.name}</span></p>
            <p className="text-sm text-gray-500">Email Address: <span className="font-semibold text-gray-900 block text-base">{loggedInUser.email}</span></p>
          </div>
          {statusMessage && (
            <p className={`text-sm font-medium ${isError ? 'text-red-600' : 'text-green-600'}`}>
              {statusMessage}
            </p>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors"
          >
            Sign Out Securely
          </button>
        </div>
      </div>
    );
  }

  // Render Authentication Portal (Login / Registration Layout)
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {activeTab === 'login' ? 'Sign in to your account' : 'Create your account'}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100">
          
          {/* Tab Navigation Controls */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              className={`flex-1 pb-4 text-sm font-medium text-center border-b-2 transition-colors ${
                activeTab === 'login' ? 'border-amber-500 text-amber-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => { setActiveTab('login'); setStatusMessage(''); }}
            >
              Sign In
            </button>
            <button
              className={`flex-1 pb-4 text-sm font-medium text-center border-b-2 transition-colors ${
                activeTab === 'register' ? 'border-amber-500 text-amber-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => { setActiveTab('register'); setStatusMessage(''); }}
            >
              Register
            </button>
          </div>

          {/* System Warning/Success Toast Messaging */}
          {statusMessage && (
            <div className={`p-3 rounded-md mb-4 text-sm font-medium ${isError ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-green-50 text-green-700 border border-green-100'}`}>
              {statusMessage}
            </div>
          )}

          {/* Render Login Panel Component Layout */}
          {activeTab === 'login' ? (
            <form className="space-y-6" onSubmit={handleLoginSubmit}>
              <div>
                <label htmlFor="loginIdentifier" className="block text-sm font-medium text-gray-700">Email or Phone Number</label>
                <input
                  id="loginIdentifier"
                  type="text"
                  required
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm text-black"
                  placeholder="name@example.com or 055..."
                />
              </div>

              <div>
                <label htmlFor="loginPassword" className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  id="loginPassword"
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm text-black"
                />
              </div>

              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors"
              >
                Sign In
              </button>
            </form>
          ) : (
            /* Render Client Registration Layout Form */
            <form className="space-y-4" onSubmit={handleRegisterSubmit}>
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                <input
                  id="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm text-black"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm text-black"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  id="phone"
                  type="text"
                  required
                  value={phoneNumber}
                  onChange={(e) => {
                    const cleanValue = e.target.value.replace(/\D/g, ''); // Custom regex number filter
                    setPhoneNumber(cleanValue);
                  }}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm text-black"
                  placeholder="Digits only (e.g. 0551234567)"
                />
              </div>

              <div>
                <label htmlFor="pass" className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  id="pass"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm text-black"
                />
              </div>

              <div>
                <label htmlFor="confirmPass" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                <input
                  id="confirmPass"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm text-black"
                />
              </div>

              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors"
              >
                Register Account
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}