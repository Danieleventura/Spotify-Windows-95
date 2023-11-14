import React from 'react';
import icon from '../img/icons/notepad_file-2.png';
import spotifyImg from '../img/device.png';


function Notepad() {
    return (
        <>
            <div class="box notepad">
                <div class="title">
                    <img src={icon} width="20" height="20" class="title" />
                    <p class="title">Spotify Connect - Notepad</p>
                    <button>X</button>
                    <button>?</button>
                </div>
                <div class="body">
                    <div class="body-notepad">
                        <p class="notepad-title">Transfer your playback</p>
                        <p>Spotify Connect is a feature on Spotify that allows users to use Spotify clients as a remote and cast content to different devices, such as smart speakers, game consoles, TVs, or wearables.</p>
                        <p>All devices must be connected to the same network. Once connected they will appear under the device icon of the Spotify app:</p>
                        <img src={spotifyImg} class="spotify-img" />
                    </div>
                </div>
            </div>
        </>
    );
}

export default Notepad;

