import { Controller, Get, Query } from '@nestjs/common';
import { TariffsPresenter } from './tariffs.presenter';

@Controller('tariffs')
export class TariffsController {
  constructor(private readonly tariffsPresenter: TariffsPresenter) {}

  @Get('update')
  async updateTariffs(@Query('date') date: string) {
    return await this.tariffsPresenter.updateTariffs(date);
  }
}
