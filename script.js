
class Model {
  constructor() {
    this.URL = 'https://api.themoviedb.org/3/movie/top_rated?api_key=4b04e5a207a38d712ac2460337479c38&language=en-US&page=1';
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

  handleSubmit = (evt) => {
    evt.preventDefault()

    fetch(this.URL)
      .then((response) => response.json())
      .then(data => {
        this.movies = data.results
        this.sortMoviesBy('vote_average')


        this.onBindMoviesListChanged(data)
      })

    // this.movies = ['movie1', 'movie2']
  }

}

class View {
  constructor() {
    this.resultsHTML = document.getElementById("results")
    this.searchInput = document.getElementById("search_input");
    this.submitButton = document.getElementById("submit_trigger");
    this.sortyByVoteButton = document.getElementById("sort_by_vote")
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
        <span class="info">${title}</span>
        <span class="info">${overview}</span>
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

  handleSubmit = e => this.model.handleSubmit(e)

  onBindMoviesListChanged = () => this.view.render(this.model.movies)

  handleBySortByVote = () => this.model.sortMoviesBy('vote_count')
}

const App = new Controller(new Model(), new View())