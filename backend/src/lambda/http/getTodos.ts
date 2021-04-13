import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getAllTodo } from '../../businessLogic/todoLogic'

import {createLogger} from '../../utils/logger'

const logger = createLogger('Get All Todos')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // TODO: Get all TODO items for a current user
  logger.info(`Processing Get Todos event - ${event}`)

  const todoItems = await getAllTodo(event)

  logger.info(`Get All todo items succeeded. ${todoItems}`)
  
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      items: todoItems
    })
  }
  
}
