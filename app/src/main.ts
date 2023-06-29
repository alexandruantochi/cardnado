import validator from '../../common/cardValidator';
import axios from 'axios';

export function addCard(): string {
    const store = $('#store').val() as string;
    const cardNumber = $('#card-number').val() as string;
    const valid = validator(store, cardNumber)
    $('#alert').text('it woasdrks!');
    axios.get('http://www.gooog.com').then(res => { console.log('ok')});
    return 'asd';
}


