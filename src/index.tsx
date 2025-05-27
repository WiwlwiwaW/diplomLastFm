/**
 * Entry point for the React application.
 * Renders the main App component into the root DOM element.
 * 
 * @module index
 */
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './styles.css';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);