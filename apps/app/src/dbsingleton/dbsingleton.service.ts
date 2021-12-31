import {Injectable} from '@nestjs/common';
import {Pool} from 'pg';

const config = {
    user: 'postgres',
    host: 'localhost',
    database: 'InternetShopClothes',
    password: 'qwerty',
    port: 5432,
};

@Injectable()
export class DbSingletonService {
    private static db: Pool

    static isInitialized(): boolean {
        return this.db !== undefined;
    }

    public static getClient(): Pool {
        if (this.isInitialized()) return this.db;

        // Initialize the connection.
        this.db = new Pool(config);
        return this.db;
    }
}