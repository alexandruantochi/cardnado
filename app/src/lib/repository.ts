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
        try {
            const response = await fetch(`${constants.getCardsUrl}`, {
                method: 'GET',
            });
            if (!response.ok) {
                console.error(`Failed to retrieve cards, status : ${response.status}.`);
            }
            return response.json();
        } catch (error) {
            console.error('Failed to retrieve cards', error);
            return Promise.resolve(null);
        }
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

    public async addCard(cardDetails: CardDetails): Promise<boolean> {
        const response = await fetch(constants.reportCardUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cardDetails)
        });
        return response.ok;
    }

    public async getLastUpdate(): Promise<Date> {
        try {
            const response = await fetch(constants.lastUpdateUrl);
            const data = await response.json();
            const isoDateString = data.date;
            const date = new Date(isoDateString);
            return date;
        } catch (error) {
            console.error('Error fetching last update from API:', error);
            return null;
        }
    }
}

export { CardnadoApi }
