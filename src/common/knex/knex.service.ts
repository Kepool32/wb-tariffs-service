import { Injectable, Inject } from '@nestjs/common';
import { Knex } from 'knex';

@Injectable()
export class KnexService {
  constructor(@Inject('KNEX_CONNECTION') private readonly knex: Knex) {}

  getKnex(): Knex {
    return this.knex;
  }
}
