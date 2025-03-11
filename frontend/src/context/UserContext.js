import React, { createContext, useState, useEffect, useContext } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(null);  
  const updateUserStatus = (status) => {
    setIsAdmin(status);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const fetchUserStatus = async () => {
        try {
          const response = await fetch('https://anime-app-bkmg.onrender.com/api/protected', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const userData = await response.json();
            setIsAdmin(userData.isAdmin !== undefined ? userData.isAdmin : false);
          }
        } catch (err) {
          console.error('Error fetching user status:', err);
          setIsAdmin(false); 
        }
      };

      fetchUserStatus();
    } else {
      setIsAdmin(false);  
    }
  }, []);

  return (
    <UserContext.Provider value={{ isAdmin, updateUserStatus }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
