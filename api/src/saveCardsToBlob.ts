import { app, InvocationContext } from "@azure/functions";
import { BlobServiceClient } from "@azure/storage-blob";
import { DefaultAzureCredential } from "@azure/identity";
import { CdnManagementClient } from "@azure/arm-cdn";
import { getContainer } from "./lib/utils";
import { CardDetails } from "../../common/models";
import config from "./lib/constants";
import { FeedResponse } from "@azure/cosmos";

export async function saveCardsToBlob(myTimer: any, context: InvocationContext): Promise<void> {
    const credentials = new DefaultAzureCredential();
    const query = 'SELECT c.id AS cardNumber, c.store FROM c';

    try {
        const container = getContainer(config.database.name, config.database.cardNumberContainer);
        const cardsPromise: Promise<FeedResponse<CardDetails>> = container.items.query(query).fetchAll();

        const blobServiceClient = new BlobServiceClient(
            `https://${config.blob.storageAccountName}.blob.core.windows.net`,
            credentials
        );
        const containerClient = blobServiceClient.getContainerClient(config.blob.container);
        const blockBlobClient = containerClient.getBlockBlobClient(config.blob.fileName);

        const cards: CardDetails[] = (await cardsPromise).resources;
        const cardsJson = JSON.stringify(cards);

        const uploadResponse = blockBlobClient.upload(cardsJson, cardsJson.length);

        const cdnClient = new CdnManagementClient(credentials, process.env.SUBSCRIPTION_ID);
        await uploadResponse;
        cdnClient.afdEndpoints.beginPurgeContent(
            process.env.RESOURCE_GROUP,
            config.cdn.profile,
            config.cdn.endpoint,
            {
                contentPaths: [`/*`]
            }
        );

        await new Promise((resolve) => setTimeout(resolve, 3000));

        context.log(`Succesfully uploaded ${cards.length} cards and initiated CDN purge.`);
    } catch (error) {
        context.error(error);
    }
}


app.timer('saveCardsToBlob', {
    schedule: '0 0 0 * * *',
    handler: saveCardsToBlob,
    runOnStartup: true
}); 