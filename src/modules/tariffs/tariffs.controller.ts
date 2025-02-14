import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { TariffsService } from './tariffs.service';

@Controller('tariffs')
export class TariffsController {
  constructor(private readonly tariffsService: TariffsService) {}

  @Get('update')
  async updateTariffs(@Query('date') date: string) {
    try {
      const result = await this.tariffsService.updateTariffs(date);
      return {
        message: 'Тарифы успешно обновлены',
        data: result,
      };
    } catch (error) {
      throw new BadRequestException(
        `Ошибка при обновлении тарифов: ${error.message}`,
      );
    }
  }
}
