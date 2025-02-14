import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Создаем таблицу 'tariffs'
  await knex.schema.createTable('tariffs', (table) => {
    table.increments('id').primary(); // автоинкрементируемый ID
    table.string('warehouseName').notNullable().unique(); // уникальное имя склада
    table.text('boxDeliveryAndStorageExpr'); // доставка и срок хранения коробки
    table.decimal('boxDeliveryBase', 10, 2); // базовая доставка коробки
    table.decimal('boxDeliveryLiter', 10, 2); // доставка за литр коробки
    table.decimal('boxStorageBase', 10, 2); // базовое хранение коробки
    table.decimal('boxStorageLiter', 10, 2); // хранение за литр коробки
    table.timestamp('created_at').defaultTo(knex.fn.now()); // дата и время создания
    table.timestamp('updated_at').defaultTo(knex.fn.now()); // дата и время обновления
  });
}

export async function down(knex: Knex): Promise<void> {
  // Удаляем таблицу 'tariffs'
  await knex.schema.dropTableIfExists('tariffs');
}
