import React, { useState, useEffect } from 'react';
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
    const [is_shuffle, setShuffle] = useState(false);

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
        
        if (user.uri != User) {
            var uri = user.uri + ":collection";
            setCurrentPlaylistURI(uri);
            setPLaylist("Liked Songs");
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
                setCurrentPlaylistURI(metadata.uri);
                setPLaylist(metadata.context_description);
                //getTracksPlaylist(playlist_id[2]);
            } else {
                setPLaylist("Liked Songs");
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
                setPaused(state.paused);

                player.getCurrentState().then(state => {
                    (!state) ? setActive(false) : setActive(true)
                    //config state current
                    setPlaybackSate(state);
                    console.log(state)
                });
            }));

            player.connect();
        };
    }, []);

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
                <div class="box player">
                    <div class="title music">
                        <img src={icon} width="20" height="20" class="icon-music" />
                        <p class="title music">Music Player</p>
                    </div>
                    <div class="body">
                        <div class="container-info-music">
                            <img src={current_track.album.images[0].url} alt="" class="photo-album" />
                            <div class="box-spotify">
                                <div class="music-group">
                                    <p>Playlist:
                                        <select name="playlists" id="playlist" onChange={(e) => { getTracks(e.target.value) }}>
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
                                    <div class="slider"><input type="range" min="0" max="100" onChange={(e) => { player.setVolume(e.target.value / 100) }}></input></div>
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
                </div>
            </>
        );
    }
}

export default WebPlayback
