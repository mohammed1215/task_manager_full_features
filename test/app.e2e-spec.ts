import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import path from 'path';
import { pathToFileURL } from 'url';
jest.setTimeout(30000);
describe('AppController (e2e)', () => {
    let app: INestApplication<App>;
    let jwtToken: string;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();

        const res = await request(app.getHttpServer())
            .post('/auth/login')
            .send({
                email: 'mohammedelbanawey224@gmail.com',
                password: '123123123',
            });
        jwtToken = res.body.accessToken;
    });

    afterAll(async () => {
        if (app) {
            await app.close();
        }
    });

    it('/ (GET)', () => {
        return request(app.getHttpServer())
            .get('/')
            .expect(200)
            .expect('Hello World!');
    });

    it('/users/me (GET) - should return current user', () => {
        console.log(jwtToken);
        return request(app.getHttpServer())
            .get('/users/me') // المسار الحقيقي بتاعك
            .set('Authorization', `Bearer ${jwtToken}`) // بنبعت التوكن في الهيدر
            .expect(200) // بنتوقع إن الـ Status Code يكون 200
            .expect((res) => {
                // بنتوقع إن الرد يكون فيه بياناتك الحقيقية من الداتابيز
                expect(res.body).toHaveProperty(
                    'email',
                    'mohammedelbanawey224@gmail.com',
                );
                expect(res.body).toHaveProperty('id');
                expect(res.body).toHaveProperty('firstname');
                // نتأكد إن الباسورد مش راجع في الـ Response
                expect(res.body.password).toBeUndefined();
            });
    });

    it('/users/me (GET) - should fail if no token provided', () => {
        return (
            request(app.getHttpServer())
                .get('/users/me')
                // مبعتناش توكن هنا
                .expect(401)
        ); // بنتوقع إن الـ Guard يرفض الطلب ويرجع Unauthorized
    });

    // it('/users/me (PATCH) - should return message of updated profile successfully', () => {
    //     return request(app.getHttpServer())
    //         .patch('/users/me')
    //         .set('Authorization', `Bearer ${jwtToken}`) // بنبعت التوكن في الهيدر
    //         .send({})
    //         .expect(200)
    //         .expect((res) => {
    //             console.log(res.body.message);
    //             expect(res.body).toHaveProperty(
    //                 'message',
    //                 'updated profile data successfully',
    //             );
    //         });
    // });

    it('users/me/avatar (POST) - should update profile picture of the account and return a message and updated user', () => {
        return request(app.getHttpServer())
            .post('/users/me/avatar')
            .set('Authorization', `Bearer ${jwtToken}`) // بنبعت التوكن في الهيدر
            .attach(
                'avatar',
                '/home/mohammed/Desktop/9c96771f-738d-495c-afbd-758cfd4e7278.jpg',
            )
            .expect(200)
            .expect((res) => {
                console.log(res.body.message);
                expect(res.body).toHaveProperty(
                    'message',
                    'updated profile data successfully',
                );
            });
    });
});
