import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { FetchCounrties } from './js/fetchCountries';

const DEBOUNCE_DELAY = 300;
const inputEl = document.querySelector('#search-box');
const listOfCountries = inputEl.nextElementSibling;
const countryIformation = listOfCountries.nextElementSibling;
const fetchCounrties = new FetchCounrties();

inputEl.addEventListener('input', debounce(handleSearchQuery, DEBOUNCE_DELAY));

function handleSearchQuery(e) {
  fetchCounrties.searchQuery = e.target.value.trim();
  if (fetchCounrties.searchQuery === '') {
    cleaListOfCountries();
    clearInfoCardOfCountry();
    return;
  }
  fetchCounrties
    .fetchResult()
    .then(data => {
      if (data.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        cleaListOfCountries();
        clearInfoCardOfCountry();
      }
      if (data.length > 1 && data.length <= 10) {
        listOfCountries.innerHTML = listRenderCountries(data);
        clearInfoCardOfCountry();
      }
      if (data.length === 1) {
        countryIformation.innerHTML = renderCountryInfo(data);
        cleaListOfCountries();
      }
    })
    .catch(error => {
      Notify.failure('Oops, there is no country with that name');
      cleaListOfCountries();
      clearInfoCardOfCountry();
    });
}

function listRenderCountries(arr) {
  const sortedCountries = [...arr].sort((a, b) =>
    a.name.common.localeCompare(b.name.common)
  );
  const markup = sortedCountries
    .map(
      ({ name, flags }) =>
        `<li class='country-item'>
        <img  src="${flags.svg}" alt="${flags.alt}" width='50' height='5'>
        <p>${name.common}</p>
        </li>`
    )
    .join('');
  return markup;
}

function renderCountryInfo(arr) {
  const cardMarkup = arr
    .map(
      ({ name, flags, capital, population, languages }) =>
        `<div>
  <div class='title-box'>
  <img src="${flags.svg}" alt="${flags.alt}"/>
  <h1 class='title'>${name.common}</h1>
  </div>
  <p class='card-description'><strong>Capital:</strong> ${capital}</p>
  <p class='card-description'><strong>Population:</strong> ${population}</p>
  <p class='card-description'><strong>Languages:</strong> ${Object.values(
    languages
  ).join(', ')}</p>
</div>`
    )
    .join('');

  return cardMarkup;
}

function cleaListOfCountries() {
  listOfCountries.innerHTML = '';
}

function clearInfoCardOfCountry() {
  countryIformation.innerHTML = '';
}
