import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Task from 'App/Models/Task'
// import User from 'App/Models/User'
import TaskValidator from 'App/Validators/TaskValidator'
export default class TasksController {
    public async index({ response, auth }: HttpContextContract) {
        try {

            if (!auth.user?.id) return
            const user = await Task.query().where('user_id', auth.user?.id)
            // const user = auth.user?.userType
            if (!user[0]) {
                return response.json({
                    status: false,
                    message: `No any task added by ${auth.user?.username}`
                })
            }
            return response.send(user)

        } catch (error) {
            console.log(error)
            return response.json({
                status: false,
                message: error
            })
        }
    }

    public async details({ params, response, auth }: HttpContextContract) {

        try {
            if (!auth.user?.id) return
            const task = await Task.query().where('id', params.id).andWhere('user_id', auth.user?.id).first()

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

    public async create({ auth, request, response }: HttpContextContract) {
        try {

            if (auth.user?.userType == 1) {
                let taskValidate = await request.validate(TaskValidator)
                taskValidate.user_id = auth.user?.id;

                const task = await Task.create(taskValidate)

                return response.json({
                    status: true,
                    message: 'Task has beed added',
                    data: task.toJSON()
                })
            }


            return response.json({
                status: false,
                message: 'Only admin can add task',
            })

        } catch (error) {
            console.log(error)
            return response.json({
                status: false,
                message: error,
            })
        }
    }

    public async update({ auth, request, params, response }: HttpContextContract) {
        try {
            if (!auth.user?.id) return
            const taskData = await Task.query().where('user_id', auth.user?.id).andWhere('id', params.id).first()
            if (!taskData) {
                return response.json({
                    status: false,
                    message: `task with this ${params.id} id is not found`
                })
            }

            const task = await request.validate(TaskValidator)

            await Task.query().update(task).where('id', params.id);

            return response.json({
                status: true,
                message: `Task updated successfully`
            })


        } catch (error) {
            console.log(error)
            return response.json({
                status: false,
                message: error,
            })
        }
    }

    public async destroy({ auth, params, response }: HttpContextContract) {
        try {

            if (auth.user?.userType == 1) {
                const taskData = await Task.query().where('id', params.id).first()
                if (!taskData) {
                    return response.json({
                        status: false,
                        message: 'No result found againest this id'
                    })
                }
                await taskData.delete()
                return response.send('Task deleted successsfully')
            }
            return response.json({
                status: false,
                message: 'Only admin can add task',
            })
        } catch (error) {
            return response.json({
                status: false,
                message: error
            })
        }
    }
}
