type CardDetails = {
    store: string,
    cardNumber: string
}

type ApiReply = {
    jsonBody: {
        message: string
    },
    status: number
}

export { CardDetails, ApiReply };