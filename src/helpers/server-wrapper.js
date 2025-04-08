import axios from 'axios';
import data from '../utils/config.tsx';

export const serverWrapper = {
    get: request('GET'),
    post: request('POST'),
    put: request('PUT'),
    delete: request('DELETE'),
};

const instance = axios.create({
    baseURL: '/',
    headers: {
        'Content-Type': 'application/json',
    },
});

function request(method) {
    return (url, data, options) => {
        let fullUrl = getFullUrl(url);
        let request = {
            method: method,
            url: fullUrl,
        };

        if (data !== undefined) {
            request.data = data;
        }

        request = Object.assign(request, options);
        request.headers = Object.assign({}, request.headers);

        return instance(request);
    };
}

/**
 *
 * @param {*} url
 * @returns
 */
export function getFullUrl(url) {
    let fullUrl;
    fullUrl = 'https://' + data.host + data.port + '/api' + url;
    return fullUrl;
}
