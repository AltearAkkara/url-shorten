import 'dotenv/config';
import App from './app';
import ShortenerController from './controller/shortener.controller';

const app = new App(
  [
    new ShortenerController(),
  ],
);

app.listen();
