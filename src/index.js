import './css/styles.css';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

const onInput = document.querySelector('input');
const countryList = document.querySelector('.country-list');
const countryCard = document.querySelector('.country-info');

onInput.addEventListener('input', debounce(countryInput, DEBOUNCE_DELAY))

function countryInput() {
    const searchCoutriesResult = onInput.value.trim();
    if (searchCoutriesResult === '') {
    return (countryList.innerHTML = ''), (countryCard.innerHTML = '');
  }
   
    fetchCountries(searchCoutriesResult)
        .then(data => {
            countryList.innerHTML = '';
            countryCard.innerHTML = '';
            if (data.length === 1) { countryCard.insertAdjacentHTML('beforeend', renderCountryCard(data))}
            else if (data.length > 10){notifyInfo()}
            else if (data.length > 1 && data.length <= 10) { countryList.insertAdjacentHTML('beforeend', renderCountryList(data)) }
        })
    .catch(error => notifyFailure());
    }
      
function renderCountryList(data) {
    const markup = data
        .map(({ name, flags }) => {
            return `
            <li class="country-list__item list">
                <img class="country-list__flag" src="${flags.svg}" alt="Flag of ${name.official}" width = 35 height = 35px>
                <h2 class="country-list__name">${name.official}</h2>
            </li>
            `;
        }).join('');
    return markup;
}

function renderCountryCard(data) {
    const markup = data
        .map(({ name, flags, capital, population, languages }) => {
            return `
            <li class="country-card__item list">
                <img class="country-list__flag" src="${flags.svg}" alt="Flag of ${name.common}" width = 100>
                <h2 class="country-list__name">${name.common}</h2>
                <p>Capital: ${capital}</p>
                <p>Population: ${population}</p>
                <p>Languages: ${Object.values(languages).join(', ')}</p>
            </li>
            `;
        }).join('');
    return markup;
}

function notifyInfo() {
    Notify.info('Too many matches found. Please enter a more specific name.')
}

function notifyFailure() {
    Notify.failure('QOops, there is no country with that name')
}


