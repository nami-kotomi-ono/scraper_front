import React from 'react';
import { SearchPage } from './pages/SearchPage';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <SearchPage />
    </>
  );
}

export default App;