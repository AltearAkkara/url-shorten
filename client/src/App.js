import React from 'react';
import axios from 'axios';
import './App.css';

export class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { shortenURL: '', originalURL: '', urlCode: '' };
  }
  mySubmitHandler = (event) => {
    event.preventDefault();
    this.getShorter(this.state.originalURL);
  }
  myChangeHandler = (event) => {
    this.setState({ originalURL: event.target.value });
  }
  getShorter = (url) => {
    axios.post(`https://localhost:5000/shortener`,
      {
        "originalUrl": url
      })
      .then(res => {
        this.setState({ shortenURL: res.data.shortUrl, urlCode: res.data.urlCode });
      });
  }
  getResultButton = () => {
    const a = 'sss';
    return (
      <button className="result">
        <a className="short-url" target="_blank" rel="noopener noreferrer" href={this.state.shortenURL}>
          {this.state.shortenURL}
        </a>
      </button>
    );
  }
  render() {
    return (
      <main>
        <section className="form-section">
          <h1 className="page-title">URL Shortener</h1>
          <form className="url-form" onSubmit={this.mySubmitHandler}>
            <input className="url-input" type="url" placeholder="Paste in a link to shorten it"
              required name="url" onChange={this.myChangeHandler} />
            <button type="submit" className="submit-button">Shorten!</button>
          </form>
        </section>
        <section className="result-section">
          {(this.state.shortenURL !== '') && this.getResultButton()}
        </section>
      </main>
    );
  }
}

