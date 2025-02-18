import { Injectable, Logger } from '@nestjs/common';
import { google } from 'googleapis';
import { KnexService } from '../../common/knex/knex.service';
import config from '../../config/google-sheets.config';
import { GoogleSheetsResponse, Tariff } from '../../interfaces/interfaces';

@Injectable()
export class GoogleSheetsService {
  private sheets = google.sheets('v4');
  private readonly logger = new Logger(GoogleSheetsService.name);
  private readonly sheetIds: string[];
  private readonly sheetName = 'stocks_coefs';

  constructor(private readonly knexService: KnexService) {
    this.sheetIds = config().sheetIds;
  }

  async ensureSheetExists(auth: any, spreadsheetId: string): Promise<void> {
    try {
      const response = (await this.sheets.spreadsheets.get({
        auth,
        spreadsheetId,
      })) as GoogleSheetsResponse;

      const sheets = response.data.sheets || [];
      const sheetExists = sheets.some(
        (sheet) => sheet.properties?.title === this.sheetName,
      );

      if (!sheetExists) {
        this.logger.warn(
          `Лист '${this.sheetName}' не найден, создаём новый...`,
        );

        await this.sheets.spreadsheets.batchUpdate({
          auth,
          spreadsheetId,
          requestBody: {
            requests: [
              {
                addSheet: {
                  properties: { title: this.sheetName },
                },
              },
            ],
          },
        });

        this.logger.log(`Лист '${this.sheetName}' успешно создан.`);
      }
    } catch (error) {
      this.logger.error(`Ошибка при проверке/создании листа: ${error}`);
    }
  }

  async appendDataToMultipleSheets(data: any[][]): Promise<void> {
    const auth = new google.auth.JWT(
      config().clientEmail,
      undefined,
      config().privateKey,
      config().sheetsScope,
    );

    for (const sheetId of this.sheetIds) {
      try {
        await this.ensureSheetExists(auth, sheetId);

        await this.sheets.spreadsheets.values.append({
          auth,
          spreadsheetId: sheetId,
          range: `${this.sheetName}!A1`,
          valueInputOption: 'RAW',
          requestBody: { values: data },
        });

        this.logger.log(
          `Данные успешно добавлены в лист '${this.sheetName}' таблицы ${sheetId}`,
        );
      } catch (error) {
        this.logger.error(
          `Ошибка при добавлении данных в таблицу ${sheetId}: ${error}`,
        );
      }
    }
  }

  async exportTariffsData(): Promise<void> {
    const knex = this.knexService.getKnex();
    const tariffs = await knex('tariffs')
      .select('*')
      .orderBy('boxDeliveryBase', 'asc');

    const data: [string, string, string, string, string, string][] = [
      [
        'Warehouse Name',
        'Delivery And Storage Expr',
        'Delivery Base',
        'Delivery Liter',
        'Storage Base',
        'Storage Liter',
      ],
    ];

    tariffs.forEach((tariff: Tariff) => {
      data.push([
        tariff.warehouseName,
        tariff.boxDeliveryAndStorageExpr || '',
        tariff.boxDeliveryBase.toString(),
        tariff.boxDeliveryLiter.toString(),
        tariff.boxStorageBase.toString(),
        tariff.boxStorageLiter.toString(),
      ]);
    });

    await this.appendDataToMultipleSheets(data);
    this.logger.log('Экспорт данных тарифов в Google Sheets завершён.');
  }
}
