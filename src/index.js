import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import Backendless from "backendless";

Backendless.serverURL = "https://api.backendless.com";
Backendless.initApp('7B31A8E3-8458-32C6-FF76-8E255EC2A200', '5796BBB4-5C71-4A34-93E1-E2E1EF3442F1');

ReactDOM.render(
    <App/>,
    document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();