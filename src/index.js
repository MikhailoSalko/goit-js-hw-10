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
  fetchCounrties
    .fetchResult()
    .then(data => {
      if (data.length > 10) {
        cleanPreviouesCountries();
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      }
      if (data.length > 1 && data.length <= 10) {
        countryIformation.innerHTML = '';
        listOfCountries.innerHTML = listRenderCountries(data);
      }
      if (data.length === 1) {
        listOfCountries.innerHTML = '';
        countryIformation.innerHTML = renderCountryInfo(data);
      }
    })
    .catch(error => {
      if (fetchCounrties.searchQuery === '') {
        listOfCountries.innerHTML = '';
        return;
      }
      cleanPreviouesCountries();
      Notify.failure('Oops, there is no country with that name');
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
        <img  src="${flags.svg}" alt="${flags.alt}" width='50' heigth='5'>
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

function cleanPreviouesCountries() {
  listOfCountries.innerHTML = '';
  countryIformation.innerHTML = '';
}
