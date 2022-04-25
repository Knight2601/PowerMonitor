"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = exports.Message = void 0;
const cosmos_1 = require("@azure/cosmos");
const config_1 = require("./config");
class Message {
}
exports.Message = Message;
class db {
    static create(client, databaseId, containerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const partitionKey = config_1.config.partitionKey;
            /**
             * Create the database if it does not exist
             */
            const { database } = yield client.databases.createIfNotExists({
                id: databaseId
            });
            console.log(`Created database:\n${database.id}\n`);
            /**
             * Create the container if it does not exist
             */
            const { container } = yield client
                .database(databaseId)
                .containers.createIfNotExists({ id: containerId, partitionKey }, { offerThroughput: 400 });
            console.log(`Created container:\n${container.id}\n`);
        });
    }
    static init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.client = new cosmos_1.CosmosClient(`AccountEndpoint=${config_1.config.endpoint}/;AccountKey=${config_1.config.key};`);
            this.database = this.client.database(config_1.config.databaseId);
            this.container = this.database.container(config_1.config.containerId);
            // Make sure database is already setup. If not, create it.
            yield this.create(this.client, config_1.config.databaseId, config_1.config.containerId);
        });
    }
    static query(querystring) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`Querying container: ${config_1.config.containerId}`);
            const querySpec = {
                query: querystring
            };
            // read all items in the Items container
            const { resources: items } = yield this.container.items
                .query(querySpec)
                .fetchAll();
            console.log(items.length);
            return items;
        });
    }
    static insert(item) {
        return __awaiter(this, void 0, void 0, function* () {
            const { resource: createdItem } = yield this.container.items.create(item);
            console.log(`+ ${createdItem.id}`);
        });
    }
}
exports.db = db;
//# sourceMappingURL=db.js.map