import React from 'react';
import { NavBar } from '../components/NavBar.jsx';

export const Layout = ({ children }) => {
   return (
      <React.Fragment>
         <div className="container mx-auto">
         <NavBar />
            { children }
         </div>
      </React.Fragment>
   )
}
