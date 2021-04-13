import * as uuid from 'uuid'
import {APIGatewayProxyEvent} from 'aws-lambda'

import {TodoAccess} from '../dataLayer/todoAccess'
import {TodoS3Access} from '../dataLayer/todoS3Access'

import {getUserId} from '../lambda/utils'
import {CreateTodoRequest} from '../requests/CreateTodoRequest'
import {UpdateTodoRequest} from '../requests/UpdateTodoRequest'

import {TodoItem} from '../models/TodoItem'
import { createLogger } from '../utils/logger'

//generate TodoAccess and TodoS3Access object instance
const todoAccess = new TodoAccess()
const todoS3Access = new TodoS3Access()
const logger = createLogger('todoLogic')

export async function createTodo(event: APIGatewayProxyEvent, createTodoRequest: CreateTodoRequest) : Promise<TodoItem> {
    
    const newTodoId = uuid.v4()
    const userId = getUserId(event)
    const createdAt = new Date().toISOString()
    const todoItem = {
        todoId: newTodoId,
        userId: userId,
        createdAt: createdAt,
        done: false,
        attachmentUrl: `http://${todoS3Access.getBucketName()}.s3.amazonaws.com/${newTodoId}`,
        ...createTodoRequest
    }

    await todoAccess.createTodo(todoItem);

    return todoItem

}

export async function getAllTodo(event: APIGatewayProxyEvent) : Promise<TodoItem[]> {
    
    const userId = getUserId(event)
    return await todoAccess.getUserTodos(userId)

}

export async function getTodoById(event: APIGatewayProxyEvent) : Promise<TodoItem> {

    const todoId = event.pathParameters.todoId
    const userId = getUserId(event)
    return await todoAccess.getTodoById(todoId, userId)

}
export async function updateTodo(event: APIGatewayProxyEvent, updateTodoRequest: UpdateTodoRequest) {
    
    const todoId = event.pathParameters.todoId
    const userId = getUserId(event)

    console.log('User id in todo Logic', userId)
    
    if(!(await todoAccess.getTodoById(todoId, userId))) {
        console.log('Unknown todo item')
        logger.error('Unknown todo item')
        return false
    }

    const result = await todoAccess.updateTodo(updateTodoRequest, todoId, userId)
    console.log('After updating - Result', result)
    return true
}

export async function deleteTodo(event: APIGatewayProxyEvent) {
    const todoId = event.pathParameters.todoId
    const userId = getUserId(event)

    if(!(await todoAccess.getTodoById(todoId, userId))) {
        console.log('Unknown todo item')
        logger.error('Unknown todo item')
        return false
    }

    await todoAccess.deleteTodoById(todoId, userId)

    return true
    
}

export async function generateUploadUrl(event: APIGatewayProxyEvent) {
    const todoS3BucketName = todoS3Access.getBucketName()
    const urlExpiration = process.env.SIGNED_URL_EXPIRATION
    const todoId = event.pathParameters.todoId

    const createSignedURLRequest = {
        Bucket: todoS3BucketName,
        Key: todoId,
        Expires: urlExpiration
    }

    return await todoS3Access.getPreSignedUploadURL(createSignedURLRequest)

}



