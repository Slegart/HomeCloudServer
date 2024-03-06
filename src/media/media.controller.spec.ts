// media.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import { AuthGuard } from '../authguard/auth.guard';
import { JwtModule } from '@nestjs/jwt';

describe('MediaController (e2e)', () => {
  let app;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, JwtModule.register({ secret: process.env.JWT_SECRET})], 
    })
    .overrideGuard(AuthGuard)
    .useValue({ canActivate: () => true })
    .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/media/upload (POST) - should upload a file', async () => {

    const response = await request(app.getHttpServer())
      .post('/media/upload')
      .attach('file', 'C:\\Users\\slega\\OneDrive\\Desktop\\userfaruk.png')

    expect(response.status).toBe(201);

    const expectedMessage = 'userfaruk.png';
    expect(response.text).toContain(expectedMessage);
  });

  afterEach(async () => {
    await app.close();
  });
});
