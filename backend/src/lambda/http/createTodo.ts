import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import {createTodo} from '../../businessLogic/todoLogic'

import {createLogger} from '../../utils/logger'

const logger = createLogger('Create Todo')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  // TODO: Implement creating a new TODO item
  logger.info(`Processing CreateTodo event - ${JSON.stringify(event.body)}`)
  
  const newTodo: CreateTodoRequest = JSON.parse(event.body)

  if(!newTodo.name) {
    logger.error('Name of a todo item cannot be empty')
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: 'Name of todo item cannot be empty'
      })
    }
  }
  
  logger.info('Creating item...')
  const newItem = await createTodo(event, newTodo)
  
  logger.info(`Created new todo item ${JSON.stringify(newItem)}`)
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      item: newItem
    })
  } 
}

