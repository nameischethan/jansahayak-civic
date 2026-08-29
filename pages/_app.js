import '../styles/globals.css';
import { AppProvider } from '../context/AppContext'; // Adjust path if your AppContext is located elsewhere

export default function App({ Component, pageProps }) {
  return (
    <AppProvider>
      <Component {...pageProps} />
    </AppProvider>
  );
}