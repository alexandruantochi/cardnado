import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { generateResponse, getContainer } from "./lib/utils";
import { CardDetails } from "../../common/models";
import config from "./lib/constants";


var cardsCache: CardDetails[] = [];

export async function getCards(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    const container = getContainer(config.DATABASE, config.CARD_NUMBER_CONTAINER);
    const query = 'SELECT c.id AS cardNumber, c.store FROM c';
    if (cardsCache.length === 0) {
        try {
            const res = await container.items.query(query).fetchAll();
            cardsCache = res.resources;
        } catch {
            return generateResponse(500, `Failed to fetch data from the database.`, context);
        }
    }

    return {
        jsonBody: cardsCache,
        status: 200
    }
};

app.http('getCards', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: getCards
});
