import { availableStore, getAvailableStores } from "../../../common/cardValidator";
import { AllCardsData, CardDetails } from "../../../common/models";
import { CardnadoApi } from "./lib/repository";
import { getDomElement, resetInfo, setInfo, shuffle } from "./lib/utils";

declare var JsBarcode: (arg0: string, arg1: string) => void;

class Index {

    private cardDataPosition = {};
    private cardData : AllCardsData;
    private reportCardButton: HTMLButtonElement;
    private refreshButton: HTMLButtonElement;
    private storeSelector: HTMLSelectElement;
    private api: CardnadoApi = new CardnadoApi();

    public async init() {
        setInfo('Please wait...', 'default');
        const allCards = this.api.getCards();

        this.reportCardButton = getDomElement('#report-card') as HTMLButtonElement;
        this.refreshButton = getDomElement('#refresh-card') as HTMLButtonElement;
        this.storeSelector = getDomElement('#store-selector') as HTMLSelectElement;

        this.storeSelector.addEventListener('change', () => this.generateBarcode());
        this.refreshButton.addEventListener('click', () => this.nextCard(false));
        this.reportCardButton.addEventListener('click', () => this.reportCard());


        this.cardData = await allCards;
        getAvailableStores().forEach(x => {
            this.cardDataPosition[x] = 0;
            shuffle(this.cardData[x]);
        });

        resetInfo();
        this.generateBarcode();
    }

    private getCurrentStore(): availableStore {
        return this.storeSelector.value as availableStore;
    }

    private getCurrentCardIndex(): number {
        return this.cardDataPosition[this.getCurrentStore()];
    }

    private getCurrentCard(): string {
        return this.cardData[this.getCurrentStore()][this.getCurrentCardIndex()];
    }

    private async reportCard() {
        setInfo('Please wait...', 'default');
        this.disableButtons();

        const cardDetails: CardDetails = {
            cardNumber: this.getCurrentCard(),
            store: this.getCurrentStore()
        }

        try {
            await this.api.reportCard(cardDetails);
            setInfo(`Reported, new card generated.`, 'success');
            this.nextCard(true);
        } catch (Err) {
            console.log(Err.message);
        } finally {
            this.enableButtons();
        }
    }

    private generateBarcode(): void {
        JsBarcode("#barcode", this.getCurrentCard());
        var barcode = getDomElement('#barcode') as SVGSVGElement;
        barcode.setAttribute('width', '100%');
    }

    private nextCard(keepInfo: boolean) {
        this.cardDataPosition[this.getCurrentStore()]++;
        const cardListLength = this.cardData[this.getCurrentStore()].length;

        if (!keepInfo) {
            resetInfo();
        }

        if (this.getCurrentCardIndex() >= cardListLength) {
            setInfo('You have reached the end of the list. Went back to the first card.', 'warning');
            this.cardDataPosition[this.getCurrentStore()] = 0;
        }

        this.generateBarcode();
    }

    private disableButtons(): void {
        [this.reportCardButton, this.refreshButton].forEach(button => {
            button.classList.add('disabled');
        });
    }

    private enableButtons(): void {
        [this.reportCardButton, this.refreshButton].forEach(button => {
            button.classList.remove('disabled');
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Index().init();
});