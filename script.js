class Model {
  constructor() {
    this.URL = 'https://api.themoviedb.org/3/movie/top_rated?api_key=4b04e5a207a38d712ac2460337479c38&language=en-US&page=1';
    this.searchText = '';
    this.movies = []
  }

  updateSearchText(ev) {
    this.searchText = ev.target.value
  }

  handleSubmit = (evt) => {
    evt.preventDefault()

    fetch(this.URL)
      .then((response) => response.json())
      .then(data => console.log(data))

    this.movies = ['movie1', 'movie2']
  }

}

class View {
  constructor() {
    this.resultsHTML = document.getElementById("results")
    this.searchInput = document.getElementById("search_input");
    this.submitButton = document.getElementById("submit_button");
  }

  handleOnChange() {
    this.searchInput.addEventListener('change', this.updateSearchText)
  }

  bindSubmit = handler => {
    this.submitButton.addEventListener('click', e => { handler(e) })
  }

  setMovieHTML(movie) {
    return `<li>${movie}</li>`
  }

  render() {
    this.resultsHTML.innerHTML = results.map(movie => this.setMovieHTML(movie))
  }
}

class Controller {
  constructor(model, view) {
    this.model = model
    this.view = view

    this.view.bindSubmit(this.handleSubmit)
  }

  handleSubmit = e => this.model.handleSubmit(e)
}

const App = new Controller(new Model(), new View())