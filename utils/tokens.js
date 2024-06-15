import { getData, storeData } from './asyncStorage';

const refreshAccessToken = async () => {
  const refreshToken = await getData('refreshToken');

  let body = `grant_type=refresh_token&refresh_token=${refreshToken}&client_id=${process.env.EXPO_PUBLIC_SPOTIFY_CLIENT_ID}`;

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body,
    });

    if (!response.ok) {
      throw new Error('HTTP status ' + response.status);
    }

    const data = await response.json();

    const tokenExpiration = JSON.stringify(Date.now() + 2700000);
    await storeData('token2', data.access_token);
    await storeData('tokenExpiration2', tokenExpiration);
    await storeData('refreshToken', data.refresh_token);
    setToken(data.access_token);
  } catch (error) {
    console.error('Error:', error);
  }
};

const checkTokenExpiration = async () => {
  const tokenExpiration = await getData('tokenExpiration2');
  if (tokenExpiration !== null) {
    const expirationTime = Number(tokenExpiration) ?? 0;
    if (Date.now() > expirationTime) {
      console.log('tokenExpiration is expired, refreshing');
      await refreshAccessToken();
    }
  }
};

export { refreshAccessToken, checkTokenExpiration };