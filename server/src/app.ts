import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import * as https from 'https';
import * as fs from 'fs';
import * as util from 'util'
import * as mongoose from 'mongoose';
import Controller from './interface/controller.interface';
import errorMiddleware from './middleware/error.middleware';
import * as cors from 'cors';

const readFile = util.promisify(fs.readFile);

class App {
  public app: express.Application;

  constructor(controllers: Controller[]) {
    this.app = express();
    this.app.use(cors());
    this.connectToTheDatabase();
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    this.initializeErrorHandling();
  }
  // create your own 
  // openssl req -x509 -newkey rsa:4096 -keyout key.pem -out certificate.pem -days 365 -nodes
  public async listen() {
    // https
    const [key, cert] = await Promise.all([
      readFile('src/cert/key.pem'),
      readFile('src/cert/certificate.pem')
    ]);
    https.createServer({ key, cert }, this.app).listen(process.env.PORT, () => {
      console.log(`App listening on the port ${process.env.PORT}`);
    });
    // http
    // this.app.listen(process.env.PORT, () => {
    //   console.log(`App listening on the port ${process.env.PORT}`);
    // });
  }

  public getServer() {
    return this.app;
  }

  private initializeMiddlewares() {
    this.app.use(bodyParser.json());
    this.app.use(cookieParser());
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

  private initializeControllers(controllers: Controller[]) {
    controllers.forEach((controller) => {
      this.app.use('/', controller.router);
    });
  }

  private connectToTheDatabase() {
    const {
      MONGO_USER,
      MONGO_PASSWORD,
      MONGO_PATH,
    } = process.env;
    // mongoose.connect(`mongodb://${MONGO_USER}:${MONGO_PASSWORD}${MONGO_PATH}`);
    mongoose.connect(`mongodb://${MONGO_PATH}`, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
      console.log('successfully connected to the database');
    }).catch(err => {
      console.log('error connecting to the database');
    });
  }
}

export default App;
