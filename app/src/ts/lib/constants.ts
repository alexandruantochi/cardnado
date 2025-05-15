
import { commonConstants } from "../../../../common/constants";
const baseApiUrl = 'https://cardnado-api.azurewebsites.net/api/';

const constants = {
    addCardUrl : baseApiUrl + 'addcard',
    getCardUrl : baseApiUrl + 'getcard',
    getCardsUrl : commonConstants.blobStorageUrl + '/' + commonConstants.blobStorageCardsContainer + '/' + commonConstants.blobStorageCardData,
    reportCardUrl : baseApiUrl + 'reportCard',
    lastUpdateUrl : baseApiUrl + 'lastUpdate',
    infoSection: '#info-section'
}


export default constants;