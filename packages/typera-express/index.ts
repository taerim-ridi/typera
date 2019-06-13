import { identity } from 'fp-ts/lib/function'
import * as express from 'express'

import * as common from 'typera-common'
export { Response, RequestHandler } from 'typera-common'

export interface ExpressContext {
  req: express.Request
  res: express.Response
}

export namespace Parser {
  export type Parser<
    Output extends {},
    ErrorResponse extends common.Response.Generic
  > = common.Parser.Parser<ExpressContext, Output, ErrorResponse>

  export type ErrorHandler<
    ErrorResponse extends common.Response.Generic
  > = common.Parser.ErrorHandler<ErrorResponse>

  function getBody(e: ExpressContext): any {
    return e.req.body
  }
  export const bodyP = common.Parser.bodyP(getBody)
  export const body = common.Parser.body(getBody)

  function getRouteParams(e: ExpressContext): any {
    return e.req.params
  }
  export const routeParamsP = common.Parser.routeParamsP(getRouteParams)
  export const routeParams = common.Parser.routeParams(getRouteParams)

  function getQuery(e: ExpressContext): any {
    return e.req.query
  }
  export const queryP = common.Parser.queryP(getQuery)
  export const query = common.Parser.query(getQuery)
}

export type RouteHandler<
  Response extends common.Response.Generic
> = common.RouteHandler<ExpressContext, Response>

export function routeHandler<
  Parsers extends common.Parser.Parser<ExpressContext, any, any>[]
>(
  ...parsers: Parsers
): common.MakeRouteHandler<ExpressContext, ExpressContext, Parsers> {
  return common.routeHandler(identity, parsers)
}

export function run<Response extends common.Response.Generic>(
  handler: RouteHandler<Response>
): (req: express.Request, res: express.Response) => Promise<void> {
  return async (req, res) => {
    const response = await handler({ req, res })
    res.status(response.status).send(response.body)
  }
}