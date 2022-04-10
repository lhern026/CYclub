import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import App from './App';
import { MetaMaskProvider } from "metamask-react";

ReactDOM.render(
  <MetaMaskProvider>
      <React.StrictMode>
      <App />
    </React.StrictMode>                                        
   </MetaMaskProvider>,
  document.getElementById('root')
);
