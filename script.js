
class Model {
  constructor() {
    this.BASE_URL = 'https://api.themoviedb.org/3';
    this.APY_KEY = `api_key=4b04e5a207a38d712ac2460337479c38`;
    this.SEARCH_MOVIE_URL = `${this.BASE_URL}/search/movie?${this.APY_KEY}&language=en-US&page=1&include_adult=false`;
    this.SEARCH_MOVIES_TOP_RATED = `${this.BASE_URL}/movie/top_rated?${this.APY_KEY}&language=en-US&page=1`;
    this.searchText = '';
    this.movies = []
  }

  bindMoviesListChanged(callback) {
    this.onBindMoviesListChanged = callback;
  }

  updateSearchText(ev) {
    this.searchText = ev.target.value
  }

  sortMoviesBy(sortBy) {
    this.movies.sort((a, b) => b[sortBy] - a[sortBy])
    this.onBindMoviesListChanged(this.movies)
  }

  getUrl = searchInputValue =>
    searchInputValue === ''
      ? this.SEARCH_MOVIES_TOP_RATED
      : this.SEARCH_MOVIE_URL

  handleSubmit(searchInput) {
    const searchInputValue = searchInput.value
    const url = this.getUrl(searchInputValue)

    fetch(url)
      .then((response) => response.json())
      .then(data => {
        console.log(data)
        this.movies = data.results
        this.sortMoviesBy('vote_average')
        this.onBindMoviesListChanged(data)
      })
  }

}

class View {
  constructor() {
    this.resultsHTML = document.getElementById("results")
    this.searchInput = document.getElementById("search_input");
    this.submitButton = document.getElementById("submit_trigger");
    this.sortyByVoteButton = document.getElementById("sort_by_vote");
    this.BASE_URL = 'http://image.tmdb.org/t/p/w92//';
  }

  handleOnChange() {
    this.searchInput.addEventListener('change', this.updateSearchText)
  }

  bindSubmit = handler => {
    this.submitButton.addEventListener('click', e => handler(e))
  }

  bindSortByVote = handler => {
    this.sortyByVoteButton.addEventListener('click', () => handler())
  }

  setMovieHTML(movie) {
    const { overview, title } = movie

    return `
      <li>
        <img src=${this.BASE_URL}${movie.poster_path} />
        <div class="movie_info">
          <span class="info">${title}</span>
          <span class="info">${overview}</span>
        </div>
      </li>`
  }

  render(results) {
    this.resultsHTML.innerHTML = results.map(movie => this.setMovieHTML(movie))
  }
}

class Controller {
  constructor(model, view) {
    this.model = model
    this.view = view

    this.model.bindMoviesListChanged(this.onBindMoviesListChanged)
    this.view.bindSubmit(this.handleSubmit)
    this.view.bindSortByVote(this.handleBySortByVote)
  }

  handleSubmit = () => this.model.handleSubmit(this.view.searchInput)

  onBindMoviesListChanged = () => this.view.render(this.model.movies)

  handleBySortByVote = () => this.model.sortMoviesBy('vote_count')
}

const App = new Controller(new Model(), new View())