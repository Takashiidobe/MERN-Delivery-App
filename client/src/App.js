import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import axios from "axios";


const listStyle = {
  fontSize: '18px',
  listStyleType: 'none'
}

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      latitude: "",
      longitude: "",
      error: false,
      results: []
    };
    this.logState = this.logState.bind(this);
    this.postLatLong = this.postLatLong.bind(this);
    this.fetchDeliveryData = this.fetchDeliveryData.bind(this);
  }

  logState() {
    console.log(this.state);
  }

  postLatLong() {
    axios({
      method: "post",
      url: "http://localhost:5000/api/items",
      headers: {
        "Content-type": "application/json"
      },
      data: {
        latitude: this.state.latitude,
        longitude: this.state.longitude
      }
    })
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      });
  }

  fetchDeliveryData() {
    axios({
      method: "get",
      url: "http://localhost:5000/api/results",
      headers: {
        "Content-type": "application/json"
      }
    })
      .then(res => {
        console.log(res);
        console.log(res.data[0].body.body);
        this.setState({
          results: res.data[0].body.body
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      position => {
        this.setState({
          latitude: position.coords.latitude.toFixed(2),
          longitude: position.coords.longitude.toFixed(2),
          error: null
        });
      },
      error => this.setState({ error: true }),
      //makes the function call high accuracy for 20 seconds at max
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 10000 }
    );
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <button onClick={this.logState}>Log State</button>
        {this.state.latitude.length > 0 &&
          this.state.longitude.length > 0 &&
          `Your location has been found!`}
        {this.state.error &&
          this.state.error === true &&
          `Sorry, we couldn't find your position`}

        <input type="text" name="latitude" value={this.state.latitude} />
        <input type="text" name="longitude" value={this.state.longitude} />
        <button onClick={this.postLatLong}>Post to back-end</button>

        <hr />
        <button onClick={this.fetchDeliveryData}>Fetch Delivery Data</button>
        <br />

        <div className="results" style={listStyle}>
          {this.state.results.length > 0 ? (
            <ul>
              {this.state.results.map((items, index) => (
                <li key={index} style={listStyle}>
                  name: {items.name}
                  <hr />
                  price: {items.price}
                  <hr />
                  rating: {items.rating}
                  <hr />
                  review count: {items.review_count}
                  <hr />
                  location:{" "}
                  {`${items.location.display_address[0]} ${items.location.display_address[1]}`}
                  <hr />
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    );
  }
}

export default App;
