import { availableStore, getAvailableStores } from "../../common/cardValidator";
import { CardDetails } from "../../common/models";
import { CardnadoApi } from "./lib/repository";
import { resetInfo, setInfo, shuffle } from "./lib/utils";

declare var JsBarcode;

class Index {

    private cardDataPosition = {};
    private cardData = new Map<availableStore, string[]>();
    private reportCardButton;
    private refreshButton;
    private storeSelector;
    private api: CardnadoApi = new CardnadoApi();

    public async init() {
        setInfo('Please wait...', 'default');
        const allCards = this.api.getCards();

        this.reportCardButton = $('#report-card');
        this.refreshButton = $('#refresh-card');
        this.storeSelector = $('#store-selector');


        getAvailableStores().forEach(x => {
            this.cardDataPosition[x] = 0;
            this.cardData.set(x, []);
        });

        this.storeSelector.on('change', () => this.generateBarcode());
        this.refreshButton.on('click', () => this.nextCard());
        this.reportCardButton.on('click', () => this.reportCard());

        (await allCards).forEach(x => {
            this.cardData.get(x.store).push(x.cardNumber);
        });

        this.cardData.forEach(cardNumbers => shuffle(cardNumbers));

        resetInfo();
        this.generateBarcode();
    }

    private getCurrentStore(): availableStore {
        return this.storeSelector.val() as availableStore;
    }

    private getCurrentCardIndex(): number {
        return this.cardDataPosition[this.getCurrentStore()];
    }

    private getCurrentCard(): string {
        return this.cardData.get(this.getCurrentStore())[this.getCurrentCardIndex()];
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
            this.nextCard();
        } catch (Err) {
            console.log(Err.message);
        } finally {
            this.enableButtons();
        }
    }

    private generateBarcode(): void {
        JsBarcode("#barcode", this.getCurrentCard());
        $('#barcode').attr('width', '100%');
    }

    private nextCard() {
        this.cardDataPosition[this.getCurrentStore()]++;
        const cardListLength = this.cardData.get(this.getCurrentStore()).length;
        if (this.getCurrentCardIndex() >= cardListLength) {
            // TODO: request next page
            setInfo('You have reached the end of the list. Went back to the first card.', 'warning');
            this.cardDataPosition[this.getCurrentStore()] = 0;
        }
        this.generateBarcode();
    }

    private disableButtons() {
        [this.reportCardButton, this.refreshButton].forEach(x => x.addClass('disabled'));
    }

    private enableButtons() {
        [this.reportCardButton, this.refreshButton].forEach(x => x.removeClass('disabled'));
    }
}

$(function () {
    new Index().init();
});




