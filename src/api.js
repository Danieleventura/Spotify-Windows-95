import axios from "axios";

const http = axios.create({
    baseURL: "https://api.spotify.com/v1"
});

export const api = {

    getPlaylists: async (token, offset) => {

        const config = {
            headers: {
                "Content-type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        };

        let response = await http.get(`/me/playlists?limit=50&offset=${offset}`, config);
        return response.data;
    },

    getPlaybackSate: async (token) => {

        const config = {
            headers: {
                "Content-type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        };

        let response = await http.get(`/me/player`, config);
        console.log(response)
        return response.data;
    },

    getItemsPlaylist: async (token, offset, playlist_id) => {

        const config = {
            params: {
                "fields": "next,items(track(name,id,uri))",
                "limit": 100,
                "offset": offset
            },
            headers: {
                "Content-type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        };

        let response = await http.get(`/playlists/${playlist_id}/tracks`, config);
        return response.data;
    },

    setTrack: async (token, track_uri, playlist_uri) => {
        const config = {
            headers: {
                "Content-type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        };

        const body = {
            "context_uri": playlist_uri,
            "offset": {
                "uri": track_uri
            },
            "position_ms": 0
        };

        let response = await http.put(`/me/player/play`, body, config);
        return response;
    },

    getUserProfile: async (token) => {
        const config = {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        };

        let response = await http.get(`/me`, config);
        return response.data;
    },

    setShuffle: async (token, state) => {
        const config = {
            params: {
                "state": state
            },
            headers: {
                "Content-type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        };

        let response = await http.put(`/me/player/shuffle`, null, config);
        return response;
    },



}