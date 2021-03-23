import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter } from "react-router-dom"
import App from './App'
import reportWebVitals from './reportWebVitals'
import {SocketContext, socket} from "./context/socket";

import "./assets/css/index.css"

import { Provider } from 'react-redux'
import store from "./store/store"
window.store = store

ReactDOM.render(
  <HashRouter>
    <SocketContext.Provider value={socket} >
      <Provider store={store}>
        <React.StrictMode>
          <App />
        </React.StrictMode>
      </Provider>
    </SocketContext.Provider>
  </HashRouter>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
