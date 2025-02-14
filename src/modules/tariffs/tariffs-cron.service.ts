import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TariffsService } from './tariffs.service';
import { GoogleSheetsService } from '../google-sheets/google-sheets.service';

@Injectable()
export class TariffsCronService {
  constructor(
    private readonly tariffsService: TariffsService,
    private readonly googleSheetsService: GoogleSheetsService,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async handleCron() {
    try {
      await this.tariffsService.updateTariffs();
      console.log('Тарифы обновлены успешно');
      await this.googleSheetsService.exportTariffsData();
    } catch (error) {
      console.error(
        'Ошибка при обновлении или экспорте тарифов:',
        error.message,
      );
    }
  }
}
