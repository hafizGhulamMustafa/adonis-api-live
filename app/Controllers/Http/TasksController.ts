import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class TasksController {
    public async index({response}:HttpContextContract){
        return response.send('hello this is working')
    }
}
