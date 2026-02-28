import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Brand, Hub, MaterialCategory, Recycler } from '../entities/reference.entity';
import { User } from '../entities/user.entity';
import { ReferenceController } from './reference.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Hub, MaterialCategory, Recycler, Brand, User]),
  ],
  controllers: [ReferenceController],
})
export class ReferenceModule {}
