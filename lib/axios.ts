import Axios from 'axios'

const axios = Axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
    },
    withCredentials: true,
})
export default axios


export const client = Axios.create({
    baseURL:  process.env.NEXT_PUBLIC_BACKEND_URL,
});

export const postMethod = async (methodName: string, params: any, header?: any) => {
    return client.post(methodName, params, header);
};