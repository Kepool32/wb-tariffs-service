import { Injectable, BadRequestException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { TariffsService } from './tariffs.service';
import { GoogleSheetsService } from '../google-sheets/google-sheets.service';
import { DataResponse } from '../../interfaces/interfaces';

@Injectable()
export class TariffsPresenter {
  private readonly API_URL: string;
  private readonly API_KEY: string | undefined;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly tariffsService: TariffsService,
    private readonly googleSheetsService: GoogleSheetsService,
  ) {
    const url = this.configService.get<string>('WB_API_URL');
    const key = this.configService.get<string>('WB_API_KEY');

    if (!url) {
      throw new Error(
        'WB_API_URL is not defined in the environment variables.',
      );
    }

    this.API_URL = url;
    this.API_KEY = key;
  }

  private getCurrentDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  async updateTariffs(date?: string): Promise<DataResponse> {
    const dateToUse = date || this.getCurrentDate();

    try {
      // Выполняем HTTP-запрос к API
      const response = await firstValueFrom(
        this.httpService.get<DataResponse>(this.API_URL, {
          headers: {
            Authorization: this.API_KEY,
            'Content-Type': 'application/json',
          },
          params: { date: dateToUse },
        }),
      );

      if (!response || !response.data) {
        throw new Error('Ответ не содержит данных');
      }

      // Сохраняем тарифы через модель (service)
      await this.tariffsService.saveTariffs(response.data);
      // Экспортируем данные в Google Sheets
      await this.googleSheetsService.exportTariffsData();

      return response.data;
    } catch (error) {
      throw new BadRequestException(`Ошибка при обновлении тарифов: ${error}`);
    }
  }
}
