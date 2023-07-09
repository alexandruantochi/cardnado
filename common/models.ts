import { availableStore } from "./cardValidator"

type CardDetails = {
    store: availableStore,
    cardNumber: string
}

type ApiReply = {
    jsonBody: {
        message: string
    },
    status: number
}

export { CardDetails, ApiReply };