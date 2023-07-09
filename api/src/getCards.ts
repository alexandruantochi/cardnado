import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { generateResponse, getContainer } from "./lib/utils";
import config from "./lib/constants";

export async function getCards(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    const container = getContainer(config.DATABASE, config.CARD_NUMBER_CONTAINER);
    const query = 'SELECT c.id AS cardNumber, c.store FROM c';
    try {
       const res = await container.items.query(query).fetchAll();
       return {
        jsonBody: res.resources,
        status : 200
       }
    } catch {
        return generateResponse(500, `Failed to fetch data from the database.`, context);
    }    
};

app.http('getCards', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: getCards
});
