import './css/styles.css';
import Notiflix from 'notiflix';
import { PixabayAPI } from './pixabay';
import createGalleryCards from './templates/gallery-card.hbs';

const searchFormEl = document.querySelector('.search-form');
const galleryListEl = document.querySelector('.gallery');
const loadMoreBtnEl = document.querySelector('.load-more');

const pixabayAPI = new PixabayAPI();

const onSearchFormSubmit = async event => {
  event.preventDefault();

  loadMoreBtnEl.classList.remove('is-hidden');

  const searchQuery = event.currentTarget.elements['searchQuery'].value.trim();

  pixabayAPI.q = searchQuery;

  if (!pixabayAPI.q) {
    Notiflix.Notify.warning(
      `The field cannot be empty. Please enter a search query`
    );
    event.currentTarget.elements['searchQuery'].value = '';
    loadMoreBtnEl.classList.add('is-hidden');
    return;
  }

  try {
    const { data } = await pixabayAPI.fetchPhotos();

    if (!data.hits.length) {
      Notiflix.Notify.failure(`Images not found!`);
      return;
    }

    galleryListEl.innerHTML = createGalleryCards(data.hits);
    Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images`);

    if (data.totalHits <= pixabayAPI.page * pixabayAPI.perPage) {
      loadMoreBtnEl.classList.add('is-hidden');
    }
  } catch (err) {
    console.log(err);
  }
};

const onLoadMoreBtnClick = async () => {
  pixabayAPI.page += 1;

  try {
    const { data } = await pixabayAPI.fetchPhotos();

    if (data.totalHits <= pixabayAPI.page * pixabayAPI.perPage) {
      loadMoreBtnEl.classList.add('is-hidden');
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    }

    galleryListEl.insertAdjacentHTML(
      'beforeend',
      createGalleryCards(data.hits)
    );
  } catch (err) {
    console.log(err);
  }
};

searchFormEl.addEventListener('submit', onSearchFormSubmit);
loadMoreBtnEl.addEventListener('click', onLoadMoreBtnClick);
