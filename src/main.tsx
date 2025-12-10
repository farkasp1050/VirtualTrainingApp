import React from 'react';
import { createRoot } from 'react-dom/client';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import App from './App';
import "./i18n";

const actualTheme = localStorage.getItem("theme");

if(actualTheme === "dark"){
  document.documentElement.classList.add("darkMode");
  document.documentElement.classList.remove("light");
} else{
  document.documentElement.classList.add("light");
  document.documentElement.classList.remove("darkMode");
}

const container = document.getElementById('root');
const root = createRoot(container!);
defineCustomElements(window);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);