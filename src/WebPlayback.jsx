import React, { useState, useEffect, useRef } from 'react';
import Note from './components/Note';
import Notepad from './components/Notepad';
import Footer from './components/Footer';
import './App.css';

import icon from './img/icons/cd_audio_cd_a-4.png';
import iconPrevious from './img/icons/controls-player/back.png';
import iconNext from './img/icons/controls-player/front.png';
import iconPlay from './img/icons/controls-player/play.png';
import iconPause from './img/icons/controls-player/pausa.png';
import iconShuffle from './img/icons/controls-player/shuffle.png';
import User from './types/User';
import track from './types/Track';
import { api } from './api';

import { saveAs } from 'file-saver';
import CanvasToBlob from 'canvas-toBlob/canvas-toBlob.js'
import html2canvas from 'html2canvas';

function WebPlayback(props) {

    const [is_paused, setPaused] = useState(false);
    const [is_active, setActive] = useState(false);
    const [player, setPlayer] = useState(undefined);
    const [current_playlist, setPLaylist] = useState("");
    const [current_track, setTrack] = useState([]);
    const [playlists, setPlaylists] = useState([]);
    const [user, setUser] = useState(User);
    const [tracks, setTracks] = useState([]);
    const [current_playlist_uri, setCurrentPlaylistURI] = useState("");
    const [current_track_uri, setCurrentTrackURI] = useState("");
    const [inputTrack, setInputTrack] = useState("");
    const [inputPlaylist, setInputPlaylist] = useState("");
    const [is_shuffle, setShuffle] = useState(false);
    const elementToCaptureRef = useRef(null);

    const getTracks = async (playlist_id) => {
        setTracks([]);
        if (playlist_id == 1) {
            getUserSavedTracks()
        } else {
            getTracksPlaylist(playlist_id);
        }
    };

    const getTracksPlaylist = async (playlist_id) => {
        setTracks([]);
        playlists.map(function (item) {
            if (item.id == playlist_id) {
                setCurrentPlaylistURI(item.uri);
                setPLaylist(item.name);
                setInputPlaylist(item.name);
            }
        });
        let next = "nextTrack";
        let offset = 0;
        while (next != null) {
            let response = await api.getItemsPlaylist(props.token, offset, playlist_id);

            response.items.forEach((track) => {
                setTracks(tracks => [...tracks, track]);
            })
            next = response.next;
            offset += 100;
        }

    };

    const getUserSavedTracks = async () => {
        setTracks([]);
        if (user.uri != null) {
            var uri = user.uri + ":collection";
            setCurrentPlaylistURI(uri);
            setPLaylist("Liked Songs");
            setInputPlaylist("Liked Songs");
        }

        let next = "nextTrack";
        let offset = 0;
        while (next != null) {
            let response = await api.getUserSavedTracks(props.token, offset);

            response.items.forEach((track) => {
                setTracks(tracks => [...tracks, track]);
            })
            next = response.next;
            offset += 100;
        }
    };

    const changeShuffle = async () => {
        await api.setShuffle(props.token, !is_shuffle);
        var button = document.getElementById('btn-shuffle');
        if (!is_shuffle) {
            button.className = "active";
        } else {
            button.classList.remove("active");
        }

        setShuffle(!is_shuffle);
    };

    const playTrack = async (e) => {
        setCurrentTrackURI(e.target.value);
        let response = await api.setTrack(props.token, e.target.value, current_playlist_uri);
    };

    useEffect(() => {

        const getUser = async () => {
            setUser(await api.getUserProfile(props.token));
        };

        const setPlaybackSate = async (state) => {

            setShuffle(state.shuffle);
            if (state.shuffle) {
                document.getElementById('btn-shuffle').className = "active";
            } else {
                document.getElementById('btn-shuffle').classList.remove("active");
            }
            let metadata = state.context.metadata;
            let playlist_id = state.context.uri?.split(":") || [];
            if (metadata.context_description) {
                //setCurrentPlaylistURI(metadata.uri);
                setPLaylist(metadata.context_description);
                setInputPlaylist(metadata.context_description);
                setInputTrack(state.track_window.current_track.name);
                //getTracksPlaylist(playlist_id[2]);
            } else {
                setPLaylist("Liked Songs");
                setInputPlaylist("Liked Songs");
                //getUserSavedTracks();
            }
        };

        const getUserPlaylists = async () => {
            let next = "nextPlaylist";
            let offset = 0;
            while (next != null) {
                let response = await api.getPlaylists(props.token, offset);
                setPlaylists(playlists => [...playlists, ...response.items]);
                next = response.next;
                offset += 50;
            }
        };

        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;

        document.body.appendChild(script);

        getUser();
        getUserPlaylists();

        window.onSpotifyWebPlaybackSDKReady = () => {

            const player = new window.Spotify.Player({
                name: 'Web Playback Windows 95',
                getOAuthToken: cb => { cb(props.token); },
                volume: 0.5
            });

            setPlayer(player);

            player.addListener('ready', ({ device_id }) => {
                console.log('Ready with Device ID', device_id);
            });

            player.addListener('not_ready', ({ device_id }) => {
                console.log('Device ID has gone offline', device_id);
            });

            player.addListener('player_state_changed', (state => {

                if (!state) {
                    return;
                }

                setTrack(state.track_window.current_track);
                setInputTrack(state.track_window.current_track.name);
                setPaused(state.paused);

                player.getCurrentState().then(state => {
                    (!state) ? setActive(false) : setActive(true)
                    //config state current
                    setPlaybackSate(state);
                });
            }));

            player.connect();
        };
    }, []);

    async function download() {

        const elTrack = document.getElementById("tracks");
        const elPlaylist = document.getElementById("playlist");

        const elInputTrack = document.getElementById("input-track");
        const elInputPlaylist = document.getElementById("input-playlist");

        const elRange = document.getElementById("range");
        const elFakeRange = document.getElementById("fake-range");

        try {

            elTrack.style.display = "none";
            elPlaylist.style.display = "none";
            elInputTrack.style.display = "block";
            elInputPlaylist.style.display = "block";
            elRange.style.display = "none";
            elFakeRange.style.display = "block";

            html2canvas(elementToCaptureRef.current, {
                logging: true,
                useCORS: true,
                allowTaint: true,
                taintTest: true,
                letterRendering: 1
            }).then((canvas) => {
                canvas.toBlob((blob) => {
                    track ? saveAs(blob, current_track.name + '-player.png') : window.saveAs(blob, 'player.png');
                });
            });
        } catch (error) {
            alert("Error capturing or saving the image")
            console.error('Error capturing or saving the image:', error);
        } finally {
            elTrack.style.display = "block";
            elPlaylist.style.display = "block";
            elInputTrack.style.display = "none";
            elInputPlaylist.style.display = "none";
            elRange.style.display = "block";
            elFakeRange.style.display = "none";
        }
    }

    if (!is_active) {
        return (
            <>
                <Note></Note>
                <Notepad></Notepad>
            </>

        )
    } else {
        return (
            <>
                <div class="box player" ref={elementToCaptureRef}>
                    <div class="title music">
                        <img src={icon} width="20" height="20" class="icon-music" />
                        <p class="title music">Spotify '95</p>
                    </div>
                    <div class="body">
                        <div class="container-info-music" >
                            <img src={current_track.album.images[0].url} alt="" class="photo-album" />
                            <div class="box-spotify">
                                <div class="music-group">
                                    <p>Playlist:
                                        <div id="input-playlist" class="input-player" >{inputPlaylist}</div>
                                        <select name="playlists" id="playlist" onChange={(e) => { getTracks(e.target.value), document.getElementById("playlist").value = "0"; setInputPlaylist(current_playlist); }}>
                                            <option value="0" class="option-music" selected disabled>{current_playlist}</option>
                                            <option value="1" >Liked Songs</option>
                                            {playlists.map(item =>
                                                <option key={item.uri} value={item.id}>{item.name}</option>
                                            )};
                                        </select>
                                    </p>
                                </div>
                                <div class="music-group">
                                    <p>Track:
                                        <div id="input-track" class="input-player tracks">{inputTrack}</div>
                                        <select value={0} name="tracks" id="tracks" onChange={(e) => { playTrack(e) }}>
                                            <option value="0" class="option-music" selected disabled>{current_track.name}</option>
                                            {tracks.map(item =>
                                                <option value={item.track.uri}>{item.track.name}</option>
                                            )};
                                        </select>
                                    </p>
                                </div>
                                <div class="music-group">
                                    <p>Artist: <span id="artist">{current_track.artists[0].name}</span></p>
                                </div>
                                <div class="music-group">
                                    <div>
                                        <div id="fake-range" class="slider"><div class="custom-range">
                                            <div class="custom-thumb"></div></div>
                                        </div>
                                        <input id="range" type="range" min="0" max="100" onChange={(e) => { player.setVolume(e.target.value / 100) }}></input>
                                    </div>
                                </div>
                                <div class="bnt-spotify">
                                    <button onClick={() => { player.previousTrack() }} >
                                        <img src={iconPrevious} class="icon-control-player"></img>
                                    </button>

                                    <button onClick={() => { player.togglePlay() }} >
                                        {is_paused ? <img src={iconPlay} class="icon-control-player"></img> : <img src={iconPause} class="icon-control-player"></img>}
                                    </button>

                                    <button onClick={() => { player.nextTrack() }} >
                                        <img src={iconNext} class="icon-control-player"></img>
                                    </button>

                                    <button id="btn-shuffle" class="active" onClick={() => { changeShuffle() }} >
                                        {is_shuffle ? <img src={iconShuffle} class="icon-control-player"></img> : <img src={iconShuffle} class="icon-control-player"></img>}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button class="button-download"onClick={download} > Download Image </button>
                </div>
            </>
        );
    }
}

export default WebPlayback
