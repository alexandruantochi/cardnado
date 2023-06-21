import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import Validator from "../../common/cardValidator";
import { getContainer } from "./lib/containerUtils";
import config from './lib/constants';

/// types
type AddCardRequest = {
    store: string,
    cardNumber: string
}

type Response = {
    jsonBody: {
        message: string
    },
    status: number
}

/// app
export async function addCard(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {

    let addCardRequest : AddCardRequest;
    
    try {
        addCardRequest = await request.json() as AddCardRequest;
    } catch (err) {
        context.log(`Failed to parse request json: ${request.body}`);
        return generateResponse(400, 'Invalid request.', context);
    }

    const validationCheck = validateRequest(addCardRequest, context);

    if (validationCheck[0] === false) {
        return validationCheck[1];
    }

    return addCardIfDoesNotExist(addCardRequest, context);

};

async function addCardIfDoesNotExist(request: AddCardRequest, context: InvocationContext): Promise<Response> {
    const cardNumberContainer = getContainer(config.DATABASE, config.CARD_NUMBER_CONTAINER)
    const cardExists = await cardNumberContainer.item(request.cardNumber, request.store).read();

    if (cardExists.statusCode === 200) {
        return generateResponse(409, `Card number ${request.cardNumber} already exists in the database for ${request.store}.`, context);
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


function validateRequest(request: AddCardRequest, context: InvocationContext): [boolean, Response] {
   
    if(!request.store || !request.cardNumber){
        return [false, generateResponse(400, "Card number and store required.", context)];
    }

    request.store = request.store.toLowerCase();
    const validator = new Validator(request.store);

    if (!validator.validate(request.cardNumber)) {
        return [false, generateResponse(400, `${validator.condition}`, context)];
    }

    return [true, undefined];
}


function generateResponse(statusCode: number, message: string, context: InvocationContext): Response {
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
