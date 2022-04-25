export class config {
    static endpoint = "https://powermon-knight.documents.azure.com:443/";
    static key = "RNcaKPHgUyx5Qgf6w0GflMFhSi6k8ySSjfFx52uoEQGtfQAnNiXyGDLQ3F6KNoglsW5BBCDUXdSLxNZIMaXE8Q==";
    static databaseId = "powermon";
    static containerId = "data";
    static partitionKey = { kind: "Hash", paths: ["/category"] };
  }
