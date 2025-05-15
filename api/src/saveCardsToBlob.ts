import { app, InvocationContext } from "@azure/functions";
import { BlobServiceClient } from "@azure/storage-blob";
import { DefaultAzureCredential } from "@azure/identity";
import { getContainer } from "./lib/utils";
import { CardDetails, AllCardsData } from "../../common/models";
import config from "./lib/constants";
import { FeedResponse } from "@azure/cosmos";
import { getAvailableStores } from "../../common/cardValidator";
import { commonConstants } from "../../common/constants";

export async function saveCardsToBlob(myTimer: any, context: InvocationContext): Promise<void> {
    const credentials = new DefaultAzureCredential();
    const query = 'SELECT c.id AS cardNumber, c.store FROM c';
    var allCardsData : AllCardsData = {} as AllCardsData;
    getAvailableStores().forEach(store => allCardsData[store]= []);
  
    try {
        const container = getContainer(config.database.name, config.database.cardNumberContainer);
        const cardsPromise: Promise<FeedResponse<CardDetails>> = container.items.query(query).fetchAll();

        const blobServiceClient = new BlobServiceClient(
            commonConstants.blobStorageUrl,
            credentials
        );
        const containerClient = blobServiceClient.getContainerClient(commonConstants.blobStorageCardsContainer);
        const blockBlobClient = containerClient.getBlockBlobClient(commonConstants.blobStorageCardData);

        const cards: CardDetails[] = (await cardsPromise).resources;

        cards.forEach(card => allCardsData[card.store].push(card.cardNumber));

        const cardsJson = JSON.stringify(allCardsData);

        const uploadResponse = await blockBlobClient.upload(cardsJson, Buffer.byteLength(cardsJson), {
            blobHTTPHeaders: {
                blobContentType: "application/json",
            },
        });

        if (uploadResponse.errorCode) {
            context.error(`Blob upload failed with error: ${uploadResponse.errorCode}`);
        }
        else {
            context.log(`Successfully  uploaded ${cards.length} cards and initiated CDN purge.`);
        }

    } catch (error) {
        context.error(error);
    }
}


app.timer('saveCardsToBlob', {
    schedule: '0 0 0 * * *',
    handler: saveCardsToBlob,
    runOnStartup: true
}); 