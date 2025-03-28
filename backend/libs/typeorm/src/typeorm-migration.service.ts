import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';

@Injectable()
export class TypeormMigrationService implements OnModuleInit {
  constructor(private configService: ConfigService, private dataSource: DataSource) {}

  async onModuleInit(): Promise<void> {
    if (this.configService.get<boolean>('db.migration.autoRun')) {
      if (!this.dataSource.isInitialized) {
        await this.dataSource.initialize();
      }
      await this.dataSource.runMigrations();
    }
  }
}
