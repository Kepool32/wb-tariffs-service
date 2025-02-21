import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TariffsPresenter } from './tariffs.presenter';

@Injectable()
export class TariffsCronService {
  constructor(private readonly tariffsService: TariffsPresenter) {}

  @Cron(CronExpression.EVERY_HOUR)
  async handleCron() {
    try {
      await this.tariffsService.updateTariffs();
      console.log('Тарифы обновлены успешно');
    } catch (error) {
      console.error('Ошибка при обновлении или экспорте тарифов:', error);
    }
  }
}
