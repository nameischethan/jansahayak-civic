import React from 'react';
import '../styles/globals.css'; // adjust CSS import path if your setup differs

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}