export class FetchCounrties {
  constructor() {
    this.searchQuery = '';
  }
  fetchResult() {
    const params = 'name,capital,population,languages,flags';
    const BASE_URL = 'https://restcountries.com/v3.1';

    return fetch(`${BASE_URL}/name/${this.searchQuery}?fields=${params}`).then(
      response => {
        if (!response.ok) {
          throw new Error(response.status);
        }
        return response.json();
      }
    );
  }
}
