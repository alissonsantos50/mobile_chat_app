import express, { Request, Response, Express, RequestHandler } from "express";
import cors from "cors";
import http from "http";
import HTTPServer from "./HTTPServer";

type ExpressMethods = "get" | "post" | "put" | "patch" | "delete";

export class ExpressHTTPServerAdapter implements HTTPServer {
  app: Express;
  private server: http.Server;

  constructor() {
    this.app = express();
    this.app.use(express.json());
    this.app.use(cors());
    this.server = http.createServer(this.app);
  }

  route(
    method: ExpressMethods,
    url: string,
    callback: Function,
    middlewares: RequestHandler[] = []
  ): void {
    this.app[method](
      url,
      ...middlewares,
      async (req: Request, res: Response) => {
        const context = { userId: (req as any).user?.userId };
        const params = req.params;
        const query = req.query;
        const body = req.body;
        try {
          const { response, statusCode } = await callback(
            params,
            body,
            query,
            context
          );
          res.status(statusCode || 200).json(response);
        } catch (e: any) {
          res.status(422).json({
            message: e.message,
          });
        }
      }
    );
  }

  listen(port: number): void {
    this.server.listen(port);
  }

  getHttpServer(): http.Server {
    return this.server;
  }
}
