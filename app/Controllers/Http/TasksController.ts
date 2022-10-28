import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Task from 'App/Models/Task'
import TaskValidator from 'App/Validators/TaskValidator'
export default class TasksController {
    public async index({ response }: HttpContextContract) {
        try {
            return await Task.all()

        } catch (error) {
            console.log(error)
            return response.json({
                status: false,
                message: error
            })
        }
    }

    public async details({ params, response }: HttpContextContract) {

        try {
            const task = await Task.query().where('id', params.id).first()

            if (!task) {
                return response.json({
                    status: false,
                    message: `task with this ${params.id} id not found`
                })
            }
            else {
                return response.json({
                    status: true,
                    message: 'data got',
                    task: task
                })
            }
        }
        catch (error) {
            console.log(error)
            return response.json({
                status: false,
                message: error
            })
        }

    }

    public async create({auth, request, response}:HttpContextContract){
        try {
            let taskValidate = await request.validate(TaskValidator)
            taskValidate.user_id = auth.user?.id;

            const task = await Task.create(taskValidate)

            return response.json({
                status:true,
                message:'Task has beed added',
                data:task.toJSON()
            })
            
        } catch (error) {
            console.log(error)
            return response.json({
                status: false,
                message: error,
            })
        }
    }

    public async update({request, params, response}:HttpContextContract){
        try {
        const taskData = await Task.query().where('id', params.id).first()

        if(!taskData){
            return response.json({
                status:false,
                message:`task with this ${params.id} id is not found`
            })
        }

        const task = await request.validate(TaskValidator)

        await Task.query().update(task).where('id' , params.id);
        
        return response.json({
            status:true,
            message:`Task updated successfully`
        })

            
        } catch (error) {
            console.log(error)
            return response.json({
                status: false,
                message: error,
            })
        }
    }

    public async destroy({params, response}:HttpContextContract){
        try {
            const taskData = await Task.query().where('id' ,params.id).first()

        if(!taskData){
            return response.json({
                status:false,
                message:'No result found againest this id'
            })
        }
        await taskData.delete()
        return response.send('Task deleted successsfully')

        } catch (error) {
            return response.json({
                status:false,
                message:error
            })
        }
    }
}
