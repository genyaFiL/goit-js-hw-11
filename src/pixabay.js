import axios from 'axios';

export class PixabayAPI {
  #BASE_URL = `https://pixabay.com/api/`;
  #API_KEY = `35146088-80a4d626fff1b76f162acdc4c`;

  #BASE_PARAMS = {
    image_type: `photo`,
    orientation: `horizontal`,
    safesearch: `true`,
    per_page: 12,
  };

  q = null;
  page = 1;

  fetchPhotos() {
    return axios.get(`${this.#BASE_URL}?key=${this.#API_KEY}&`, {
      params: {
        q: this.q,
        ...this.#BASE_PARAMS,
        page: this.page,
      },
    });
  }

  get perPage() {
    return this.#BASE_PARAMS.per_page;
  }
}
