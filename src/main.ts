import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as cors from 'cors';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.use(
    session({
      secret: 'my-secret',
      resave: false,
      saveUninitialized: false,

      //test env
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
        secure: false,
      },
    }),
  );

  const port =5000;
  await app.listen(port);
}
bootstrap();
