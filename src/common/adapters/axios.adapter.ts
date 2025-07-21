import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { map, firstValueFrom } from 'rxjs';
import { HttpInterfaceAdapter } from '../interfaces/http-interfase-adapter';

@Injectable()
export class AxiosAdapter implements HttpInterfaceAdapter {

    constructor(private readonly httpService: HttpService) {}

    async get<T>(url: string): Promise<T> {
        const response$ = this.httpService.get<T>(url).pipe(
            map((response: AxiosResponse<T>) => response.data)
        );
        return await firstValueFrom(response$);
    }
}