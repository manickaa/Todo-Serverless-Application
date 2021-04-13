import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { updateTodo } from '../../businessLogic/todoLogic'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  console.log('Todo id: ', todoId)
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
  console.log('Update request body', updatedTodo)
  const updatedItem = await updateTodo(event, updatedTodo)
  console.log('Updated item...', updatedItem)
  // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
  
  if(!updatedItem) {
    return {
      statusCode: 404,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        error: `Cannot find todoItem with id: ${todoId}. Id not found`
      })
    }
  }
  
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      message: `Updated item with id : ${todoId}`
    })
  }
}
