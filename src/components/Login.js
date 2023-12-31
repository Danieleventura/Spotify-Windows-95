import React from 'react';
import icon from '../img/icons/tip.png';

const dotenv = require('dotenv');

dotenv.config()


function Login() {

    const REACT_APP_SERVER_URL = process.env.REACT_APP_SERVER_URL + "/auth/login"
    return (
        <>
            <div class="box">
                <div class="title">
                    <img src={icon} width="20" height="20" class="title"/>
                    <p class="title">spotify.exe</p>
                    <button>X</button>
                    <button>?</button>
                </div>
                <div class="body">
                    <p>You'll need a premium account to use it.</p>
                    <p>Login with Spotify</p>
                    <button id="bnt-login"><a href={REACT_APP_SERVER_URL}>Login</a></button>
                </div>
            </div>
        </>
    );
}

export default Login;

