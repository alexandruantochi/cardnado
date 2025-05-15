import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { DefaultAzureCredential } from "@azure/identity";
import { commonConstants } from "../../common/constants";
import { BlobServiceClient } from "@azure/storage-blob";
import { generateResponse } from "./lib/utils";

type contactFormData = {
    email?: string,
    message: string
}

export async function contact(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    
    const credentials = new DefaultAzureCredential();

    const blobServiceClient = new BlobServiceClient(
        commonConstants.blobStorageUrl,
        credentials
    );

    const containerClient = blobServiceClient.getContainerClient(commonConstants.blobStorageContactContainer);
    const blockBlobClient = containerClient.getAppendBlobClient(commonConstants.blobStorageContactData);
    const feedbackData: contactFormData = await request.json() as contactFormData;
    if (!feedbackData.email) {
        feedbackData.email = "NOT_PROVIDED";
    }
    const feedbackDataString: string = JSON.stringify(feedbackData) + "\n";
    const uploadResponse = await blockBlobClient.appendBlock(feedbackDataString, Buffer.byteLength(feedbackDataString));

    if (uploadResponse.errorCode) {
        context.error(`Blob upload failed with error: ${uploadResponse.errorCode}`);
    }
    else {
        context.log(`Logged feedback from ${feedbackData.email}`);
    }

     return generateResponse(200, 'thanks', context);
}

app.http('contact', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: contact
});
