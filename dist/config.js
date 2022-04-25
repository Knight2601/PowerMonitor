"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
class config {
}
exports.config = config;
config.endpoint = "https://powermon-knight.documents.azure.com:443/";
config.key = "RNcaKPHgUyx5Qgf6w0GflMFhSi6k8ySSjfFx52uoEQGtfQAnNiXyGDLQ3F6KNoglsW5BBCDUXdSLxNZIMaXE8Q==";
config.databaseId = "powermon";
config.containerId = "data";
config.partitionKey = { kind: "Hash", paths: ["/category"] };
//# sourceMappingURL=config.js.map