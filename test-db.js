const { MongoClient } = require("mongodb");

const url = "mongodb://admin:password@localhost:27017";

console.log("Starting connection test...");

async function testConnection() {
    try {
        const client = await MongoClient.connect(url);
        console.log("CONNECTED TO MONGODB");
        await client.close();
    } catch (err) {
        console.log("CONNECTION ERROR:");
        console.log(err);
    }
}

testConnection();