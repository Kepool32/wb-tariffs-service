import { Module } from '@nestjs/common';
import { TariffsService } from './tariffs.service';
import { KnexModule } from '../../common/knex/knex.module';
import { HttpModule } from '@nestjs/axios';
import { ScheduleModule } from '@nestjs/schedule';
import { TariffsCronService } from './tariffs-cron.service';
import { TariffsController } from './tariffs.controller';
import { ConfigModule } from '@nestjs/config';
import { GoogleSheetsModule } from '../google-sheets/google-sheets.module';

@Module({
  imports: [
    HttpModule,
    ScheduleModule.forRoot(),
    KnexModule,
    ConfigModule,
    GoogleSheetsModule,
  ],
  controllers: [TariffsController],
  providers: [TariffsService, TariffsCronService],
})
export class TariffsModule {}
