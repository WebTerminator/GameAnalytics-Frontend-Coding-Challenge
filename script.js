
class Model {
  constructor() {
    this.BASE_URL = 'https://api.themoviedb.org/3';
    this.APY_KEY = `api_key=4b04e5a207a38d712ac2460337479c38`;
    this.SEARCH_MOVIE_URL = `${this.BASE_URL}/search/movie?${this.APY_KEY}&language=en-US&page=1&include_adult=false`;
    this.SEARCH_MOVIES_TOP_RATED = `${this.BASE_URL}/movie/top_rated?${this.APY_KEY}&language=en-US&page=1`;
    this.SEARCH_MOVIES_UPCOMIMG = `${this.BASE_URL}/movie/upcoming?${this.APY_KEY}&language=en-US&page=1`;
    this.searchText = '';
    this.movies = [];
    this.fav_movies = [];
  }

  bindMoviesListChanged(callback) {
    this.onBindMoviesListChanged = callback;
  }

  updateSearchText(ev) {
    this.searchText = ev.target.value;
  }

  sortMoviesBy(sortBy) {
    this.movies.sort((a, b) => b[sortBy] - a[sortBy]);
    this.onBindMoviesListChanged(this.movies);
  }

  getUrl = searchInputValue => {
    let url;

    if (searchInputValue !== '') {
      url = `${this.SEARCH_MOVIE_URL}&query=${searchInputValue}`
    }
    else if (searchInputValue === 'upcoming') {
      url = `${this.SEARCH_MOVIES_UPCOMIMG}`
    }
    else {
      url = this.SEARCH_MOVIES_TOP_RATED
    }

    console.log(url)

    return url;
  }

  fethcMovies(url) {
    fetch(url)
      .then((response) => response.json())
      .then(data => {
        this.movies = data.results;
        this.sortMoviesBy('vote_average');
        this.onBindMoviesListChanged(data);
      })
  }

  handleSubmit(searchInput) {
    const searchInputValue = searchInput.value;
    const url = this.getUrl(searchInputValue);
    this.fethcMovies(url);
  }

  filterBy(e) {
    if (e.target.value === 'fav') {
      const local_fav_movies = JSON.parse(localStorage['fav-movies']);
      this.movies = this.movies.filter(movie => local_fav_movies.includes(movie.id))
      this.onBindMoviesListChanged(this.movies);
    }
    else if (e.target.value === 'upcoming') {
      const url = this.getUrl('upcoming');
      this.fethcMovies(url);
    }
  }
}

class View {
  constructor() {
    this.resultsHTML = document.getElementById("results")
    this.searchInput = document.getElementById("search_input");
    this.submitButton = document.getElementById("submit_trigger");
    this.sortyByVoteButton = document.getElementById("sort_by_vote");
    this.filterBy = document.getElementById("filter_by");
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
    this.resultsHTML.innerHTML = results.map(movie => this.setMovieHTML(movie))
  }
}

class Controller {
  constructor(model, view) {
    this.model = model
    this.view = view

    this.model.bindMoviesListChanged(this.onBindMoviesListChanged);
    this.view.bindSubmit(this.handleSubmit);
    this.view.bindSortByVote(this.handleBySortByVote);
    this.view.bindSetFavMovie(this.model.fav_movies);
    this.view.bindOnFilter(this.handleOnFilter);
  }

  handleSubmit = () => this.model.handleSubmit(this.view.searchInput);
  onBindMoviesListChanged = () => this.view.renderResults(this.model.movies);
  handleBySortByVote = () => this.model.sortMoviesBy('vote_count');
  handleOnFilter = e => this.model.filterBy(e, this.model.fav_movies);
}

const App = new Controller(new Model(), new View())