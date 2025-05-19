import axios, { AxiosResponse } from 'axios';

export class AxiosAdapter {

    async get<T>(url: string): Promise<T> {
        return await axios.get(url).then((res) => res.data);
    }
}