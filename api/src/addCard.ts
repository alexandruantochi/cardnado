import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { validateStoreAndCard } from "../../common/cardValidator";
import { getContainer } from "./lib/containerUtils";
import { AddCardRequest, AddCardReply } from '../../common/models';
import config from './lib/constants';

/// app
export async function addCard(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {

    let addCardRequest: AddCardRequest;

    try {
        addCardRequest = await request.json() as AddCardRequest;
    } catch (err) {
        return generateResponse(400, 'Invalid request.', context);
    }

    const validationCheck = validateStoreAndCard(addCardRequest.store, addCardRequest.cardNumber);

    if (!validationCheck.valid) {
        return generateResponse(400, validationCheck.msg, context);
    }

    return addCardIfDoesNotExist(addCardRequest, context);

};

async function addCardIfDoesNotExist(request: AddCardRequest, context: InvocationContext): Promise<AddCardReply> {
    const cardNumberContainer = getContainer(config.DATABASE, config.CARD_NUMBER_CONTAINER)
    const cardExists = await cardNumberContainer.item(request.cardNumber, request.store).read();

    if (cardExists.statusCode === 200) {
        return generateResponse(409, `Card number ${request.cardNumber} already exists in the ${request.store} database.`, context);
    } else {
        const res = await cardNumberContainer.items.create({
            id: request.cardNumber,
            store: request.store,
            flagged: 0
        });

        if (res.statusCode === 201) {
            return generateResponse(201, `Succesfully added ${request.cardNumber} to ${request.store} database.`, context);
        } else {
            return generateResponse(500, `Failed to add ${request.cardNumber} to ${request.store} database.`, context);
        }
    }
}

function generateResponse(statusCode: number, message: string, context: InvocationContext): AddCardReply {
    context.log(message);
    return {
        status: statusCode,
        jsonBody: {
            message: message
        }
    };
}

app.http('addCard', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: addCard
});
