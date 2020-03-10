export default class View {
  constructor() {
    this.resultsHTML = document.getElementById("results")
    this.searchInput = document.getElementById("search_input");
    this.submitButton = document.getElementById("submit_trigger");
    this.sortyByVoteButton = document.getElementById("sort_by_vote");
    this.filterBy = document.getElementById("filter_by");
    this.movies_length = document.getElementById("movies_length");
    this.BASE_URL = 'http://image.tmdb.org/t/p/w92//';
    this.fav_movies = []
  }

  handleOnChange() {
    this.searchInput.addEventListener('change', this.updateSearchText)
  }

  bindSubmit = handler =>
    this.submitButton.addEventListener('click', e => handler(e));

  bindSortByVote = handler =>
    this.sortyByVoteButton.addEventListener('click', () => handler());

  updateLocalStorage = movies =>
    localStorage.setItem('fav-movies', JSON.stringify(movies));

  bindSetFavMovie = () => {
    let { fav_movies, resultsHTML, updateLocalStorage } = this

    resultsHTML.addEventListener('click', e => {
      if (e.target && e.target.nodeName === 'IMG') {
        const id = e.target.dataset.id;
        const isNotFavMovie = !fav_movies.includes(id);

        if (isNotFavMovie) {
          fav_movies.push(parseInt(id));
          updateLocalStorage(fav_movies);
          e.target.src = './heart_green.svg';
        } else {
          fav_movies = fav_movies.filter(movieId => movieId !== id);
          updateLocalStorage(fav_movies);
          e.target.src = './heart.svg'
        }
      }
    })
  }

  bindOnFilter = handler =>
    this.filterBy.addEventListener('change', e => handler(e));

  getPosterUrl = movie =>
    movie.poster_path
      ? `${this.BASE_URL}${movie.poster_path}`
      : 'http://via.placeholder.com/92x138.png?text=poster';

  setMovieHTML(movie) {
    const { id, overview, release_date, title } = movie

    const date = release_date.substring(0, 4);
    const posterUrl = this.getPosterUrl(movie);
    const TEXT_LIMIT = 460;
    const description =
      overview.length > TEXT_LIMIT
        ? `${overview.substring(0, TEXT_LIMIT)}${' ...'}`
        : overview;

    return `
      <li>
        <img src=${posterUrl} />
        <div class="box_1">
          <h3>
            ${title} 
            <span>(${date})</span>
          </h3>
          <span class="info">${description}</span>
        </div>
        <div class="box_2">
          <img class="fav_icon" data-id="${id}" src="./heart.svg" />
          <button>More info</<button>
        </div>
      </li>`
  }

  renderResults(results) {
    this.movies_length.innerHTML = `<h4>Showing ${results.length} movies</h4>`;
    this.resultsHTML.innerHTML = results.map(movie => this.setMovieHTML(movie));
  }
}