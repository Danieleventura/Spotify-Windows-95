import React from 'react';
import icon from '../img/icons/windows-0.png';
import iconGithub from '../img/github-mark.png';
import iconLinkedin from '../img/linkedin.png';

function Footer() {

    const date = new Date();

    return (
        <>
            <footer >
                <div id="taskbar">
                    <button class="start">
                        <img src={icon} class="icon-control-player"></img>Start
                    </button>
                    <a href="https://github.com/Danieleventura/Spotify-Windows-95" target="_blank"  class="button-contact">
                        <img src={iconGithub} class="icon-control-player"></img>GitHub
                    </a>
                    <a href="https://www.linkedin.com/in/daniele-ventura-83b66410b/" target="_blank" class="button-contact">
                        <img src={iconLinkedin} class="icon-control-player"></img>Linkedin
                    </a>
                    <div id="notifications">
                        <div id="clock">{date.getDate()}/{date.getMonth() +1}/1995</div>
                    </div>
                </div>
            </footer>
        </>
    );
}

export default Footer;

