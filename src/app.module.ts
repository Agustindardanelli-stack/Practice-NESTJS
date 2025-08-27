import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '1234', // Tu password de Postgres
      database: 'taskflow',
      autoLoadEntities: true,
      synchronize: true, // Solo en desarrollo
    }),
    AuthModule,
    UsersModule,
  ],
})
export class AppModule {}