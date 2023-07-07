import { Container, CosmosClient } from "@azure/cosmos";
import { InvocationContext } from "@azure/functions/types/InvocationContext";
import { ApiReply } from "../../../common/models";

function getContainer(database: string, container: string): Container {
    
    const endpoint = process.env.COSMOS_ENDPOINT;
    const key = process.env.COSMOS_KEY;

    return new CosmosClient({ endpoint: endpoint, key: key }).database(database)
        .container(container);
}

function generateResponse(statusCode: number, message: string, context: InvocationContext): ApiReply {
    context.log(message);
    return {
        status: statusCode,
        jsonBody: {
            message: message
        }
    };
}

export { getContainer, generateResponse  }