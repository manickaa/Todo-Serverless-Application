import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

import {TodoItem} from '../models/TodoItem'
import {UpdateTodoRequest} from '../requests/UpdateTodoRequest'

const XAWS = AWSXRay.captureAWS(AWS)

export class TodoAccess {
    constructor(
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly todoTable = process.env.TODO_TABLE,
        private readonly userIdIndex = process.env.USER_INDEX) {
    }

    async getUserTodos(userId:string): Promise<TodoItem[]> {
        console.log('Getting all todos')

        const result = await this.docClient.query({
            TableName: this.todoTable,
            IndexName: this.userIdIndex,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues:{
                ':userId': userId
            }
        }).promise()

        const items = result.Items
        return items as TodoItem[]
    }

    async createTodo(todoItem){

        await this.docClient.put({
            TableName: this.todoTable,
            Item: todoItem
        }).promise()

    }

    async getTodoById(todoId:string, userId:string): Promise<TodoItem> {
        console.log('Getting todos with id', todoId)

        const result = await this.docClient.get({
            TableName: this.todoTable,
            Key: {
                todoId,
                userId
            }
        }).promise()

        return result.Item as TodoItem
    }

    async updateTodo(updatedTodo:UpdateTodoRequest, todoId:string, userId:string) {
        console.log('Todoid in todoAccess', todoId)
        const updatedItem = await this.docClient.update({
            TableName: this.todoTable,
            Key: {
                todoId,
                userId
            },
            ExpressionAttributeNames: {
                "#N" : "name"
            },
            UpdateExpression: 'set #N=:todoName, dueDate=:dueDate, done=:done',
            ExpressionAttributeValues: {
                ':todoName' : updatedTodo.name,
                ':dueDate' : updatedTodo.dueDate,
                ':done' : updatedTodo.done
            },
            ReturnValues: "UPDATED_NEW"
            
        }).promise()
        return updatedItem
    }

    async deleteTodoById(todoId: string, userId:string) {

        const param = {
            TableName: this.todoTable,
            Key: {
                "todoId":todoId,
                "userId":userId
            }
        }

        await this.docClient.delete(param).promise()

    }   
}


