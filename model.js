export default class Model {
  constructor() {
    this.BASE_URL = 'API_KEY';
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
