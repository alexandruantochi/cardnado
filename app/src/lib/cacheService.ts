import { availableStore } from "../../../common/cardValidator";
import { CardDetails } from "../../../common/models";
import { CardnadoApi } from "./repository";

const STORAGE_LAST_UPDATE = 'lastUpdate';
const STORAGE_CARDS = 'cards';
const MAX_CACHE_AGE_DAYS = 15;
const api: CardnadoApi = new CardnadoApi();

class CacheService {

    public async getCards(): Promise<CardDetails[]> {
        const upToDate = this.isCacheUpToDate();
        const fresh = this.isCacheFresh();
        const storedCards = localStorage.getItem(STORAGE_CARDS);
        let getLocation;
        if (this.shouldUpdateCache(await upToDate, fresh, storedCards)) {
            getLocation = 'API.';
            await this.update();
        } else {
            getLocation = 'local storage';
        }
    
        console.log(`Retrieved data from ${getLocation}`)
        return JSON.parse(localStorage.getItem(STORAGE_CARDS));
    }
    
    private saveCardsToLocalStorage(cards: CardDetails[]) {
        localStorage.setItem(STORAGE_CARDS, JSON.stringify(cards));
        this.setLastSavedDate();
    }
    
    private async update() {
        const cardDetails = api.getCards() || []; 
        this.saveCardsToLocalStorage(await cardDetails);
    }
    
    private shouldUpdateCache(upToDate: boolean, fresh: boolean, storedCards: string){
        return !upToDate || !fresh || !storedCards;
    }
    
    private setLastSavedDate() {
        localStorage.setItem(STORAGE_LAST_UPDATE, new Date().toISOString());
    }
    
    private getLastSavedDate(): Date | null {
        const lastRetrievalDateStr = localStorage.getItem(STORAGE_LAST_UPDATE);
        if (!lastRetrievalDateStr) {
            return null;
        }
        return new Date(lastRetrievalDateStr);
    }
    
    private async getLastApiUpdate(): Promise<Date> {
        // TODO: add endpoint to return last update date
        return Promise.resolve(new Date());
    }
    
    private async isCacheUpToDate(): Promise<boolean> {
        const lastSavedDate = this.getLastSavedDate();
        return Promise.resolve(true)
        // return await this.getLastApiUpdate() <= lastSavedDate;
    }
    
    private isCacheFresh(): boolean {
        const lastSavedDate = this.getLastSavedDate();
    
        if (!lastSavedDate) {
            return false;
        }
    
        const currentDate = new Date();
        const timeDiffInMilliseconds = currentDate.getTime() - lastSavedDate.getTime();
        const daysDifference = Math.floor(timeDiffInMilliseconds / (1000 * 60 * 60 * 24));
    
        return daysDifference < MAX_CACHE_AGE_DAYS;
    }
}

export { CacheService}
