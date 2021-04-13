import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import {deleteTodo} from '../../businessLogic/todoLogic'

import {createLogger} from '../../utils/logger'

const logger = createLogger('Delete Todos')


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  logger.info(`Processing DeleteTodo event - ${event}`)
  const todoId = event.pathParameters.todoId

  // TODO: Remove a TODO item by id
  const deleted = await deleteTodo(event)

  if(!deleted) {
    logger.error(`Cannot delete todoItem with id: ${todoId}. Id not found`)
    return {
      statusCode: 404,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        error: `Cannot delete todoItem with id: ${todoId}. Id not found`
      })
    }
  }

  logger.info('Delete event succeeded')
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({message:`Deleted item with id : ${todoId}`})
  }
}
