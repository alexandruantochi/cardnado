type AddCardRequest = {
    store: string,
    cardNumber: string
}

type AddCardReply = {
    jsonBody: {
        message: string
    },
    status: number
}

export { AddCardReply, AddCardRequest };