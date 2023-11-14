import React from 'react';
import icon from '../img/icons/msg_warning-0.png';


function Note() {
    return (
        <>
            <div class="box note">
                <div class="title">
                    <img src={icon} width="20" height="20" class="title" />
                    <p class="title">spotify.exe</p>
                    <button>X</button>
                    <button>?</button>
                </div>
                <div class="body">
                    <p>Instance not active. </p>
                    <p>Transfer your playback using your Spotify app</p>
                    <p>Select the device <b> Web Playback Windows 95</b></p>
                </div>
            </div>
        </>
    );
}

export default Note;

