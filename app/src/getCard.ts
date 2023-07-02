import { validateStore } from "../../common/cardValidator";
import constants from "./constants";
import { resetInfo, setInfo } from "./utils";

declare var JsBarcode: any;

function setBarcodeWidth() {
    $('#barcode').attr('width', '100%');
}

function generateBarcode(store: string) {
    $.get(constants.getCardUrl, { "store": store })
        .done(function (data) {
            console.log(data.id);
            JsBarcode("#barcode", data.id);
            setBarcodeWidth();
            resetInfo();
        })
        .fail(function (data) {
            setInfo(data.responseJSON.message, 'warning');

        }).always(() => { $('#get-card').removeClass('disabled'); });
}

function getCard() {
    setInfo('Please wait...', 'default');
    $('#get-card').addClass('disabled');
    const store = $(constants.store).val() as string;
    console.log(store);
    if (!validateStore(store)) {
        setInfo('Invalid store selected', 'warning');
    }
    generateBarcode(store);
}

export { getCard };