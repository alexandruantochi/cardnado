import constants from "./constants";
import { getRandomInt } from "../../../../common/utils";

type infoType = 'warning' | 'success' | 'default';
type alertClasses = 'alert alert-warning' | 'alert alert-success' | 'alert';
type requestApiOption = 'getCards' | 'reportCard' | 'addCard';

const alertClassMapping = new Map<infoType, string[]>([
    ['warning', ['alert', 'alert-warning']],
    ['success', ['alert', 'alert-success']],
    ['default', ['alert']]
]);

function setInfo(text: string, infoType: infoType): void {
    const info = getDomElement(constants.infoSection) as HTMLDivElement;
    info.textContent = text;
    info.className = '';
    info.classList.add(...alertClassMapping.get(infoType));
}

function resetInfo() {
    setInfo('', 'default');
}

function shuffle(cardNumbers: string[]): void {
    let currentIndex = cardNumbers.length;
    while (currentIndex !== 0) {
        currentIndex--;
        let randomIndex = getRandomInt(currentIndex);
        if (randomIndex === currentIndex) {
            continue;
        }
        let aux = cardNumbers[currentIndex];
        cardNumbers[currentIndex] = cardNumbers[randomIndex];
        cardNumbers[randomIndex] = aux;
        
    }
}

function getDomElement(selector: string) : Element | null {
  return document.querySelector(selector);
}


export { setInfo, resetInfo, shuffle, getDomElement, requestApiOption }