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

export { ApiReply, CardDetails };