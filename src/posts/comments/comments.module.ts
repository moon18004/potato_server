import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { PostsCommentsModel } from './entities/postComments.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([PostsCommentsModel]), AuthModule, UsersModule],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
