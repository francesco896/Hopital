import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Routing from './Routing';
import { UserProvider } from './userContext'; 
 

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
   <UserProvider>  
     <Routing />
   </UserProvider>
 
  </React.StrictMode>
);
