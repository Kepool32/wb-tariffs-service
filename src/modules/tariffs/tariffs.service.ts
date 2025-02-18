import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { KnexService } from '../../common/knex/knex.service';
import { ConfigService } from '@nestjs/config';
import { DataResponse, Tariff } from '../../interfaces/interfaces';
import { GoogleSheetsService } from '../google-sheets/google-sheets.service';

@Injectable()
export class TariffsService {
  private readonly API_URL: string | undefined;
  private readonly API_KEY: string | undefined;

  constructor(
    private readonly httpService: HttpService,
    private readonly knexService: KnexService,
    private readonly configService: ConfigService,
    private readonly googleSheetsService: GoogleSheetsService,
  ) {
    this.API_URL = this.configService.get<string>('WB_API_URL');
    this.API_KEY = this.configService.get<string>('WB_API_KEY');
  }

  private getCurrentDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private formatDecimal(value: string | number): number | null {
    if (value === '-' || value === '') {
      return null;
    }
    if (typeof value === 'string') {
      const formattedValue = value.replace(',', '.');
      const parsedValue = parseFloat(formattedValue);
      return isNaN(parsedValue) ? null : parsedValue;
    }
    if (typeof value === 'number') {
      return value;
    }

    return null;
  }

  async saveTariffs(data: DataResponse) {
    const knex = this.knexService.getKnex();

    const tariffs = data.response.data.warehouseList.map(
      (warehouse: Tariff) => ({
        warehouseName: warehouse.warehouseName,
        boxDeliveryAndStorageExpr: warehouse.boxDeliveryAndStorageExpr,
        boxDeliveryBase: this.formatDecimal(warehouse.boxDeliveryBase),
        boxDeliveryLiter: this.formatDecimal(warehouse.boxDeliveryLiter),
        boxStorageBase: this.formatDecimal(warehouse.boxStorageBase),
        boxStorageLiter: this.formatDecimal(warehouse.boxStorageLiter),
      }),
    );

    await knex('tariffs').insert(tariffs).onConflict('warehouseName').merge();
  }

  async updateTariffs(date?: string): Promise<DataResponse> {
    const dateToUse = date || this.getCurrentDate();

    try {
      if (!this.API_URL) {
        throw new Error('API URL is not defined in the environment variables.');
      }

      const response = await this.httpService
        .get<DataResponse>(this.API_URL, {
          headers: {
            Authorization: this.API_KEY,
            'Content-Type': 'application/json',
          },
          params: { date: dateToUse },
        })
        .toPromise();

      if (!response || !response.data) {
        throw new Error('Ответ не содержит данных');
      }

      await this.saveTariffs(response.data);
      await this.googleSheetsService.exportTariffsData();
      return response.data;
    } catch (error) {
      throw new Error(`Не удалось получить тарифы: ${error}`);
    }
  }
}
