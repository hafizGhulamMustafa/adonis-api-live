import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Task from 'App/Models/Task'

export default class TaskSeeder extends BaseSeeder {
  public async run () {
    await Task.createMany([
      {
        title: 'Mobile',
        description: 'this is device',
      },
      {
        title: 'pen',
        description: 'this is device',
      }
    ])
  }
}
