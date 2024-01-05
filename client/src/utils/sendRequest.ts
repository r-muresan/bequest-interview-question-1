const API_URL = "http://localhost:8080";

const refreshAccessToken = async () => {
  const response = await fetch(`${API_URL}/auth/refresh_token`);

  if (!response.ok && response.status === 401) {
    return null;
  }
  const data = await response.json();
  localStorage.setItem("jwt", data.accessToken);
  return data.accessToken;
};


const sendRequestWithAccessToken = async (
  url: string,
  accessToken: string,
  requestOptions?: RequestInit
) => {
  const response = await fetch(url, {
    ...requestOptions,
    headers: {
      ...requestOptions?.headers,
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response;
};


//send request that requires authentication in the server, it will fire a refresh token if access token expires
export const sendRequest=async(url:string, requestOptions?: RequestInit)=> {
  const accessToken = localStorage.getItem('jwt')
  if(!accessToken){
    return null
  }

  let response = await sendRequestWithAccessToken(
    url,
    accessToken,
    requestOptions
  );

  if (response.status === 401) {
    try {
      const accessToken = await refreshAccessToken();
      if(accessToken){
        response = await sendRequestWithAccessToken(
          url,
          accessToken,
          requestOptions
        );
      }
    } catch (error) {
      console.error("Failed to refresh token:", error);

    }
  }

  return response;
}
