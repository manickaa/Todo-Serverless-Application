import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { updateTodo } from '../../businessLogic/todoLogic'

import {createLogger} from '../../utils/logger'

const logger = createLogger('Update Todo')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
  logger.info(`Processing Update Todo event - ${JSON.stringify(event.pathParameters.todoId)}`)
  
  const todoId = event.pathParameters.todoId

  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
  
  logger.info(`UpdateTodo request body ${JSON.stringify(updatedTodo)}`)
  
  const updatedItem = await updateTodo(event, updatedTodo)
  
  logger.info('Updating item...')
  
  if(!updatedItem) {
    logger.error(`Update item failed..Cannot find todoItem with id: ${todoId}`)
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
  
  logger.info(`UpdateTodo item with id ${todoId} succeeded`)

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
