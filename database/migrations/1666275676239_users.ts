import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').notNullable()
      table.string('email').notNullable().unique()
      table.string('password').notNullable()
      table.string('remember_me_token').nullable()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
      table.timestamp('deleted_at').defaultTo(null)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
