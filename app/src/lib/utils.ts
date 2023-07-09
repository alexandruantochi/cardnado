import constants from "./constants";
import { getRandomInt } from "../../../common/utils";

type infoType = 'warning' | 'success' | 'default';
type alertClasses = 'alert alert-warning' | 'alert alert-success' | 'alert';
type requestApiOption = 'getCards' | 'reportCard' | 'addCard';

const alertClassMapping = new Map<infoType, alertClasses>([
    ['warning', 'alert alert-warning'],
    ['success', 'alert alert-success'],
    ['default', 'alert']
]);

function setInfo(text: string, infoType: infoType): void {
    const info = $(constants.infoSection);
    info.text(text);
    info.removeClass().addClass(alertClassMapping.get(infoType));
}

function resetInfo() {
    setInfo('', 'default');
}

function shuffle(cardNumbers: string[]): void {
    let currentIndex = cardNumbers.length - 1;
    while (currentIndex !== 0) {
        let randomIndex = getRandomInt(currentIndex);
        if (randomIndex === currentIndex) {
            continue;
        }
        let aux = cardNumbers[currentIndex];
        cardNumbers[currentIndex] = cardNumbers[randomIndex];
        cardNumbers[randomIndex] = aux;
        currentIndex--;
    }
}


export { setInfo, resetInfo, shuffle, requestApiOption }