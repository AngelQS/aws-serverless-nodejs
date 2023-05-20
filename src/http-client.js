import axios from "axios";

export async function makeRequest(url, method, body) {
    const axiosResponse = await axios({
        url,
        method,
        body
    })

    const data = axiosResponse.data
    const response = {
      statusCode: axiosResponse.status,
      body: data
    };

    return response
  }