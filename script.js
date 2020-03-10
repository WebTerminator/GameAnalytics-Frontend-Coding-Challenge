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