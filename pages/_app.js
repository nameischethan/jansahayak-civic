import '../styles/globals.css';
import { AppProvider } from '../context/AppContext'; // Update this import path to match your AppContext file

export default function App({ Component, pageProps }) {
  return (
    <AppProvider>
      <Component {...pageProps} />
    </AppProvider>
  );
}