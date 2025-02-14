import { Module } from '@nestjs/common';
import { KnexService } from './knex.service';
import knex from 'knex';
import { ConfigService, ConfigModule } from '@nestjs/config';
import knexConfig from './knexfile';

@Module({
  imports: [ConfigModule],
  providers: [
    KnexService,
    {
      provide: 'KNEX_CONNECTION',
      useFactory: () => {
        return knex(knexConfig);
      },
      inject: [ConfigService],
    },
  ],
  exports: [KnexService, 'KNEX_CONNECTION'],
})
export class KnexModule {}
