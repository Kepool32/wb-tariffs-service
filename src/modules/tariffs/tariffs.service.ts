import { Injectable } from '@nestjs/common';
import { KnexService } from '../../common/knex/knex.service';
import { DataResponse, Tariff } from '../../interfaces/interfaces';

@Injectable()
export class TariffsService {
  constructor(private readonly knexService: KnexService) {}

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

  async saveTariffs(data: DataResponse): Promise<void> {
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
}
