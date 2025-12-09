import React from 'react';
import { AuthProvider } from './src/context/AuthContext';
import Router from './src/navigation';

const App = () => {
  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  );
};

export default App;
