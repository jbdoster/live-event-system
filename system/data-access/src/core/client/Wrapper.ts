import { Pool } from "pg";

type DataAccessObject = Record<string, unknown>;

class Wrapper {
    private pool: Pool;

    constructor() {
        this.pool = new Pool({
            database: 'gateway',
            user: 'admin',
            password: 'password',
            port: 5432,
            // ssl: true,
            max: 20, // set pool max size to 20
            idleTimeoutMillis: 1000, // close idle clients after 1 second
            connectionTimeoutMillis: 1000, // return an error after 1 second if connection could not be established
            maxUses: 7500, // close (and replace) a connection after it has been used 7500 times (see below for discussion)
        })
        this.pool.connect();
    }

    query<T = DataAccessObject>(statement: string): Promise<T[]> {
        // if (!this.pool.ended) {
        //     throw new Error("Pool not connected to read.");
        // }

        return this.pool.query(statement).then(
        // return this.pool.query("set search_path to accounts_instances; INSERT INTO profiles (first_name, last_name) VALUES ('test', 'test') RETURNING first_name, last_name;").then(
            data => {
                return (data?.rows || []) as unknown as T[]
            }
        )
    }
}

export default new Wrapper();
