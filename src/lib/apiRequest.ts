import { AxiosError, Method } from 'axios';
const axios = require('axios').default;

const apiRequest = async function (uri: string, method: Method, data: {}, showError = true, auth = true, token?: string | null, additionalHeaders?: {}, abort?: AbortController) {
  if (!token) {
    auth = false;
  }

  const abortController = abort ?? new AbortController();

  let headers = {
    'Authorization': auth === true ? 'Bearer ' + token : '',
    'Content-Type': 'application/json;charset=UTF-8',
    'Origin': process.env.NEXT_PUBLIC_APIREQ_URL,
  }

  if (additionalHeaders) {
    const aH = additionalHeaders;
    headers = { ...headers, ...aH }
  }

  return axios({
    method: method,
    data: data,
    url: process.env.NEXT_PUBLIC_API_URL + uri,
    headers: headers,
    signal: abortController.signal,
  })
    .then(function (response: { data: any, message: string }) {
      if (response && response.data) return response.data;
      else return response;
    })
    .catch(function (error: Error | AxiosError<any>) {
      let message: any = '';
      if (abortController.signal.aborted && error.message === "canceled") {
        console.log('The user aborted the request');
        message = "The user aborted the request";
      }
      else if ("response" in error) {
        let tempError: any = "";
        if (error.response && error.response.data && error.response.data.message === "invalid_user_token") {
          console.log(error.response.data.message, 'error');
          tempError = error.response.data;
        }
        else if (showError && error.response && error.response.data && error.response.data !== "") tempError = error.response.data;
        else if (showError) tempError = "An error occurred";
        message = tempError;
      } else {
        console.log(error.message);
        message = error.message;
      }

      return message;
    });
};

export default apiRequest;