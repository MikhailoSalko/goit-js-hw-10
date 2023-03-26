import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;
const inputEl = document.querySelector('#search-box');
const listOfCountries = inputEl.nextElementSibling;
const countryIformation = listOfCountries.nextElementSibling;
console.log(listOfCountries);
console.log(countryIformation);

inputEl.addEventListener(
  'input',
  debounce(handleCountrySearch, DEBOUNCE_DELAY)
);
let name = '';

function handleCountrySearch(e) {
  name = e.target.value;
  // console.log(name);
  return fetch(`https://restcountries.com/v3.1/name/${name}`)
    .then(responce => {
      return responce.json();
    })
    .then(data => console.log({ data }));
}
