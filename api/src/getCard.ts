import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { getContainer } from "./lib/containerUtils";
import Validator from "../../common/cardValidator";
import config from "./lib/constants";

type CardDetails = {
    id: string,
    store: string
}

export async function getCard(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {

    const store = request.query.get('store')?.toLocaleLowerCase();

    if (!validateRequest(store)) {
        return {
            jsonBody: {
                message: `Invalid store requested: ${store}`
            },
            status: 400
        }
    }

    const container = getContainer(config.DATABASE, config.CARD_NUMBER_CONTAINER);
    const countQuery = {
        query: "SELECT VALUE COUNT(1) FROM c WHERE c.store = @store",
        parameters: [
            { name: "@store", value: store }
        ]
    };

    let offset = 0;
    try {
        const { resources: countResult } = await container.items.query(countQuery).fetchNext();
        const count = countResult[0];
        offset = Math.floor(Math.random() * count);
    } catch (err) {
        context.log(err);
        return {
            jsonBody: {
                message: `Error retrieving from database.`,
                status: 500
            }
        }
    }
    
    const querySpec = {
        query: "SELECT * FROM c WHERE c.store = @store ORDER BY c.id OFFSET @offset LIMIT 1",
        parameters: [
            { name: "@offset", value: offset },
            { name: "@store", value: store }
        ]
    };

    const { resources: items } = await container.items.query<CardDetails>(querySpec).fetchNext();
    const randomCard = { id: items[0].id, store: items[0].store };

    context.log(`Retrieved ${randomCard.id} - ${randomCard.store}, offset: ${offset}`);

    return {
        jsonBody: randomCard,
        status: 200
    }
};

function validateRequest(store: string): boolean {
    return new Validator(store).canValidate;
}

app.http('getCard', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: getCard
});
