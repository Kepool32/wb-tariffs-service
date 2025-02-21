import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { KnexService } from './common/knex/knex.service';
import { TariffsCronService } from './modules/tariffs/tariffs-cron.service';
import { TariffsService } from './modules/tariffs/tariffs.service';
import { KnexModule } from './common/knex/knex.module';
import { TariffsModule } from './modules/tariffs/tariffs.module';
import { ConfigModule } from '@nestjs/config';
import { GoogleSheetsModule } from './modules/google-sheets/google-sheets.module';
import { GoogleSheetsService } from './modules/google-sheets/google-sheets.service';
import { TariffsPresenter } from './modules/tariffs/tariffs.presenter';

@Module({
  imports: [
    ConfigModule.forRoot(),
    HttpModule,
    KnexModule,
    TariffsModule,
    GoogleSheetsModule,
  ],
  providers: [
    TariffsService,
    TariffsCronService,
    TariffsPresenter,
    KnexService,
    GoogleSheetsService,
  ],
})
export class AppModule {}
