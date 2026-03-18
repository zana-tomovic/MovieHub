import { Injectable, OnModuleInit } from '@nestjs/common';
import { Database } from 'arangojs';

@Injectable()
export class AppService implements OnModuleInit {
  public readonly db: Database;

  constructor() {
      this.db = new Database({
        url: process.env.DB_URL || 'http://localhost:8529/_db/app',
        databaseName: process.env.DB_NAME,
      });

      this.db.useBasicAuth(
        process.env.DB_USER || 'root',
        process.env.DB_PASS
      ); 
  }

  async onModuleInit() {
    try {
      const info = await this.db.get();
      console.log('Povezano');
    } catch (error) {
      console.error('Nije povezan: ', error.message);
    }
  }
}
