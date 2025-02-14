import { Module } from '@nestjs/common';
import { GoogleSheetsService } from './google-sheets.service';
import { KnexModule } from '../../common/knex/knex.module';

@Module({
  imports: [KnexModule],
  providers: [GoogleSheetsService],
  exports: [GoogleSheetsService],
})
export class GoogleSheetsModule {}
