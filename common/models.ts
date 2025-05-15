import { availableStore } from "./cardValidator"

type CardDetails = {
    store: availableStore,
    cardNumber: string,
    flagged?: number,
    verified?: boolean
}

type ApiReply = {
    jsonBody: {
        message: string
    },
    status: number
}

type AllCardsData = {
    [k in availableStore]: string[];
}

export { CardDetails, ApiReply, AllCardsData };