import constants from "./constants";

type infoType = 'warning' | 'success' | 'default';
type alertClasses = "alert alert-warning" | "alert alert-success" | "alert";

const alertClassMapping = new Map<infoType, alertClasses>([
    ['warning', 'alert alert-warning'],
    ['success', 'alert alert-success'],
    ['default', 'alert']
]);

function setInfo(text: string, infoType: infoType) {
    const info = $(constants.alert);
    info.text(text);
    info.removeClass().addClass(alertClassMapping.get(infoType));
}

function resetInfo() {
    setInfo('', 'default');
}

export { setInfo, resetInfo }