import Validator from '../common/cardValidator.js';

function submitCardNumber() {
  $('#alert').text('');
  $('#alert').removeClass('alert-danger');
  let cardNumber = $('#card-number').val();
  let store = $('#store-select').val();


  let validator = Validator.get(store);
  if(!validator && !validator(cardNumber)){
    console.log('Invalid card number or store');
  }


  console.log({ cardNumber, store });
  if (store === null) {
      $('#alert').text('Please select a store.');
      $('#alert').addClass('alert-danger');
  }

  $.post({
      url: "https://cardnado-api.azurewebsites.net/api/addcard",
      headers: { "Content-Type": 'application/json' },
      data: JSON.stringify({
          cardNumber: cardNumber,
          store: store
      })
  }).always(function (data, status) {
      if(data.status !== 201){
          $('#alert').addClass('alert-danger');
      } else {
          $('#alert').addClass('alert-light');
      }
      $('#alert').text(data.responseJSON.message);
  });
}

