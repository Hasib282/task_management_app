import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';


@Module({
    
    imports: [ConfigModule.forRoot(),UserModule, TypeOrmModule.forRoot(
        {
            type: 'postgres',
            host: process.env.NEXT_PUBLIC_DATABASE_HOST,
            port: 5432,
            username: process.env.NEXT_PUBLIC_DATABASE_USERNAME,
            password: process.env.NEXT_PUBLIC_DATABASE_PASS,
            database: process.env.NEXT_PUBLIC_DATABASE_NAME,
            autoLoadEntities: true,
            synchronize: true,
            ssl: {
                rejectUnauthorized: false,
            },
        }),
    ],
  controllers: [],
  providers: [],
})
export class AppModule {}
