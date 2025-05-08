import { app, InvocationContext } from "@azure/functions";
import { BlobServiceClient } from "@azure/storage-blob";
import { DefaultAzureCredential } from "@azure/identity";
import { CdnManagementClient } from "@azure/arm-cdn";
import { getContainer } from "./lib/utils";
import { CardDetails } from "../../common/models";
import config from "./lib/constants";

export async function saveCardsToBlob(myTimer: any, context: InvocationContext): Promise<void> {
    try {
        // Get cards from Cosmos DB
        const container = getContainer(config.database.name, config.database.cardNumberContainer);
        const query = 'SELECT c.id AS cardNumber, c.store FROM c';
        const { resources: cards } = await container.items.query(query).fetchAll();

        // Connect to blob storage using managed identity
        const blobServiceClient = new BlobServiceClient(
            `https://${config.blob.storageAccountName}.blob.core.windows.net`,
            new DefaultAzureCredential()
        );
        const containerClient = blobServiceClient.getContainerClient(config.blob.container);
        await containerClient.createIfNotExists();

        // Save cards to blob
        const blockBlobClient = containerClient.getBlockBlobClient(config.blob.fileName);
        await blockBlobClient.upload(JSON.stringify(cards), JSON.stringify(cards).length);

        // Purge CDN cache
        const cdnClient = new CdnManagementClient(new DefaultAzureCredential(), process.env.SUBSCRIPTION_ID);
        await cdnClient.endpoints.beginPurgeContentAndWait(
            process.env.RESOURCE_GROUP,
            config.cdn.profile,
            config.cdn.endpoint,
            {
                contentPaths: [`/${config.blob.container}/${config.blob.fileName}`]
            }
        );
 
        context.log(`Successfully saved ${cards.length} cards to blob storage and purged CDN cache`);
    } catch (error) {
        context.error('Error saving cards to blob storage:', error);
    }
}

// Run every day at midnight
app.timer('saveCardsToBlob', {
    schedule: '0 0 * * *',
    handler: saveCardsToBlob
}); 