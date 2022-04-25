import { Container, CosmosClient, Database } from '@azure/cosmos';
import { config } from './config';

export class Message {
    val1: number;
    val2: number;
    val3: number;
    val4: number;
    asat?: string;
}

export class db {
    static client: CosmosClient;
    static database: Database;
    static container: Container;

    static async create(client, databaseId, containerId) {
        const partitionKey = config.partitionKey;

        /**
         * Create the database if it does not exist
         */
        const { database } = await client.databases.createIfNotExists({
            id: databaseId
        });
        console.log(`Created database:\n${database.id}\n`);

        /**
         * Create the container if it does not exist
         */
        const { container } = await client
            .database(databaseId)
            .containers.createIfNotExists(
                { id: containerId, partitionKey },
                { offerThroughput: 400 }
            );

        console.log(`Created container:\n${container.id}\n`);

    }
    
    static async init() {
        this.client = new CosmosClient(`AccountEndpoint=${config.endpoint}/;AccountKey=${config.key};`);

        this.database = this.client.database(config.databaseId);
        this.container = this.database.container(config.containerId);

        // Make sure database is already setup. If not, create it.
        await this.create(this.client, config.databaseId, config.containerId);
    }

    static async query(querystring: string) {
        console.log(`Querying container: ${config.containerId}`);

        const querySpec = {
            query: querystring
        };

        // read all items in the Items container
        const { resources: items } = await this.container.items
            .query(querySpec)
            .fetchAll();

        console.log(items.length);
        return items;
    }

    static async insert(item: Message) {
        const { resource: createdItem } = await this.container.items.create(item);

        console.log(`+ ${createdItem.id}`);
    }
}