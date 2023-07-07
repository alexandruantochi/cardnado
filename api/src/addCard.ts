import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { validateStoreAndCard } from "../../common/cardValidator";
import { generateResponse, getContainer } from "./lib/utils";
import { CardDetails, ApiReply } from '../../common/models';
import config from './lib/constants';

/// app
export async function addCard(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {

    let addCardRequest: CardDetails;

    try {
        addCardRequest = await request.json() as CardDetails;
    } catch (err) {
        return generateResponse(400, 'Invalid request.', context);
    }

    const validationCheck = validateStoreAndCard(addCardRequest.store, addCardRequest.cardNumber);

    if (!validationCheck.valid) {
        return generateResponse(400, validationCheck.msg, context);
    }

    return addCardIfDoesNotExist(addCardRequest, context);

};

async function addCardIfDoesNotExist(request: CardDetails, context: InvocationContext): Promise<ApiReply> {
    const cardNumberContainer = getContainer(config.DATABASE, config.CARD_NUMBER_CONTAINER)
    const cardExists = await cardNumberContainer.item(request.cardNumber, request.store).read();

    if (cardExists.statusCode === 200) {
        return generateResponse(409, `Card number ${request.cardNumber} already exists in the ${request.store} database.`, context);
    } else {
        const res = await cardNumberContainer.items.create({
            id: request.cardNumber,
            store: request.store,
            flagged: 0,
            verified: false
        });

        if (res.statusCode === 201) {
            return generateResponse(201, `Succesfully added ${request.cardNumber} to ${request.store} database.`, context);
        } else {
            return generateResponse(500, `Failed to add ${request.cardNumber} to ${request.store} database.`, context);
        }
    }
}



app.http('addCard', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: addCard
});
