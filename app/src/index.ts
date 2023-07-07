import { validateStore } from "../../common/cardValidator";
import { CardDetails } from "../../common/models";
import constants from "./constants";
import { resetInfo, setInfo } from "./utils";

declare var JsBarcode: any;
var currentCardNumber = '';
var reportCardButton;
var refreshButton;
var storeSelector;

function getStoreAndCard(): CardDetails {
    return {
        cardNumber: currentCardNumber,
        store: storeSelector.val() as string
    };
}

function setBarcodeWidth() {
    $('#barcode').attr('width', '100%');
}

function generateBarcode(store: string) {
    $.get(constants.getCardUrl, { "store": store })
        .done(function (data) {
            JsBarcode("#barcode", data.id);
            currentCardNumber = data.id;
            setBarcodeWidth();
            resetInfo();
        })
        .fail(function (data) {
            setInfo(data.responseJSON.message, 'warning');

        }).always(() => { refreshButton.removeClass('disabled'); });
}


function getCard() {
    setInfo('Please wait...', 'default');
    refreshButton.addClass('disabled');
    const store = storeSelector.val() as string;
    if (!validateStore(store)) {
        setInfo('Invalid store selected', 'warning');
    }
    generateBarcode(store);
}

function reportCard() {
    reportCardButton.addClass('disabled');
    setInfo('Please wait...', 'default');
    const cardDetails = getStoreAndCard();
    $.post(constants.reportCardUrl, JSON.stringify(cardDetails))
        .done(function () {
            getCard();
        })
        .fail(function (data) {
            setInfo(data.responseJSON.message, 'warning');
        }).always(() => { reportCardButton.removeClass('disabled'); });
}

$(function () {
    reportCardButton = $('#report-card');
    refreshButton = $('#refresh-card');
    storeSelector = $('#store-selector');
    getCard();
    storeSelector.on('change', function () {
        getCard();
    });
    refreshButton.on('click', () => { getCard(); });
    reportCardButton.on('click', () => { reportCard(); });
});




