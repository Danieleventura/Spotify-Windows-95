import React, { useState, useEffect } from 'react';
import WebPlayback from './WebPlayback'
import Login from './components/Login'
import Desktop from './components/Desktop'
import './App.css';
import Footer from './components/Footer';

const dotenv = require('dotenv');

dotenv.config()

function App() {

  const [token, setToken] = useState('');

  useEffect(() => {

    async function getToken() {
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/auth/token`);
      const json = await response.json();
      setToken(json.access_token);
      console.log(json);
      console.log("token: " + json.access_token)
    }

    async function getStatusServer() {
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/auth/status`);
      const json = await response.json();
      console.log("status: " + json.status)
    }

    async function getCodeCallback() {
      let code = (new URLSearchParams(window.location.search)).get("code")
      console.log("code: " + code)

      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/auth/callback?code=${code}`);
      const json = await response.json();
      setToken(json.access_token);
      console.log(json);
      console.log(json.access_token)
    }

    getStatusServer();
    getCodeCallback();
    getToken();

  }, []);

  return (
    <>  <Desktop></Desktop>
        { (token === '') ? <Login/> : <WebPlayback token={token} /> }
        <Footer></Footer>
    </>
  );
}


export default App;
