import { CardDetails } from "../../../common/models";
import constants from "./constants";
import { requestApiOption } from './utils';

class CardnadoApi {

    apiRequests = new Map<requestApiOption, Function>([
        ['getCards', this.getCards],
        ['reportCard', this.reportCard],
        ['addCard', () => { }]
    ]);

    public async getCards(): Promise<CardDetails[]> {
        let response = await fetch(`${constants.getCardsUrl}`, {
            method: 'GET',
        });
        return response.json();
    }

    public async reportCard(cardDetails: CardDetails): Promise<boolean> {
        const response = await fetch(constants.reportCardUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cardDetails)
        });
        return response.ok;
    }

    public async addCard(cardDetails: CardDetails) : Promise<boolean> {
        const response = await fetch(constants.reportCardUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cardDetails)
        });
        return response.ok;
    }
}

export { CardnadoApi }
