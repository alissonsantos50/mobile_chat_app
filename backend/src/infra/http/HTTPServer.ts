import { Server } from "http";

export default interface HTTPServer {
  route(
    method: string,
    url: string,
    callback: (
      params: any,
      body: any,
      query: any,
      context: any
    ) => Promise<any>,
    middlewares?: any[]
  ): void;
  listen(port: number): void;
  getHttpServer(): Server;
}
