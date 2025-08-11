import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer, toast, Slide } from 'react-toastify';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';
import App from './App.jsx';
import rootReducer from './Reducer/index.js';
// --- End of IMPORTANT imports ---


const store = configureStore({
  reducer: rootReducer,
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        <ToastContainer 
          position="top-center"
          autoClose={1000}
          hideProgressBar
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
          transition={Slide}
        />
      </BrowserRouter>
    </Provider>
  </StrictMode>
);