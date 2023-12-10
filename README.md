# Spotify Windows 95

This repository contains the source code for the [Web Playback SDK Guide](https://developer.spotify.com/documentation/web-playback-sdk/guide/).

The application can be viewed at https://spotify-windows-95.vercel.app/.

My Backend server repository: https://github.com/Danieleventura/Spotify-wind95-server/.


The backend server can be included in the same react app using proxy, as shown in the guide in the [Proxying Backend Requests](https://developer.spotify.com/documentation/web-playback-sdk/guide/) topic.
## Using your own credentials

You will need to register your app and get your own credentials from the
[Spotify for Developers Dashboard](https://developer.spotify.com/dashboard/)

To do so, go to your Spotify for Developers Dashboard, create your
application and register the following callback URI:

`http://localhost:3000/auth/callback`

Once you have created your app, create a file called `.env` in the root folder
of the repository with your Spotify credentials:

```bash
SPOTIFY_CLIENT_ID='my_client_id'
SPOTIFY_CLIENT_SECRET='my_client_secret'
```

For this application you need the url of your backend server:

```bash
REACT_APP_SERVER_URL='server url'
```

## Installation

These examples run on Node.js. On its
[website](http://www.nodejs.org/download/) you can find instructions on how to
install it.

Once installed, clone the repository and install its dependencies running:

```bash
npm install
```

## Running the App Locally

Start with the following command:

```bash
npm run dev
```

The React application will start on `http://localhost:3000`

##  Next Steps

Here you have some ideas to add to the prototype:

- Use the refresh_token field from the Request Access Token response to request a new token once the current one expires.

- Use the Search endpoint to include search capabilities by artist, albums, or tracks.

- Include a Transfer Playback button to transfer the current playback to another Spotify instance using the Get Playback State endpoint.

- Include lyrics

