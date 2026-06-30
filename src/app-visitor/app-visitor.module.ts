import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppVisitor } from './app-visitor.entity';
import { AppVisitorController } from './app-visitor.controller';
import { AppVisitorService } from './app-visitor.service';

@Module({
  imports: [TypeOrmModule.forFeature([AppVisitor])],
  controllers: [AppVisitorController],
  providers: [AppVisitorService],
})
export class AppVisitorModule {}
