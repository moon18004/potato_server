import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsModel } from './posts/entities/posts.entity';
import { CommonModule } from './common/common.module';
import { UsersModule } from './users/users.module';
import { UsersModel } from './users/entities/users.entity';
import { CoursesModule } from './courses/courses.module';
import { AuthModule } from './auth/auth.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CoursesModel } from './courses/entities/courses.entity';
import { MailModule } from './mail/mail.module';
import { ConfigModule } from '@nestjs/config';
import { PostsCommentsModel } from './posts/comments/entities/postComments.entity';
import { CommentsModule } from './posts/comments/comments.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres', // database type
      host: '127.0.0.1',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'postgres',
      entities: [PostsModel, UsersModel, CoursesModel, PostsCommentsModel],
      synchronize: true
    }),
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true
    }),
    PostsModule,
    CommonModule,
    UsersModule,
    CoursesModule,
    AuthModule,
    MailModule,
    CommentsModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor
    }
  ]
})
export class AppModule {}
