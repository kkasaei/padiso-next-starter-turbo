import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { DatabaseModule } from './features/database';
import { ProjectsModule } from './modules/projects/projects.module';

@Module({
  imports: [DatabaseModule, ProjectsModule],
  controllers: [AppController],
})
export class AppModule {}
