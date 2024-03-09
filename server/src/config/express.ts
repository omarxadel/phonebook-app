import express, { urlencoded } from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import listEndpoints from "express-list-endpoints";
import { Server } from "http";
import routes from "../routes";

function initExpress(): Server {
  const app = express();

  // Middleware
  app.use(
    cors({
      credentials: true,
      // origin: "http://localhost:3000",
    })
  );
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(urlencoded({ extended: false }));
  app.use(express.json());

  // Logger
  app.use(morgan("dev"));

  // Router V1
  app.use(routes);

  console.log(listEndpoints(app));

  // Init Express
  const PORT: string | number = process.env.PORT || 3000;
  return app.listen(
    PORT,
    () => console.log(`Server started on port ${PORT}`) // tslint:disable-line
  );
}

export default initExpress;
