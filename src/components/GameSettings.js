import React from 'react';
import { updateRoundsMax } from '../Firebase/index';
import { Link } from 'react-router-dom';

export default class GameSettings extends React.Component {
  constructor() {
    super();
    this.state = {
      rounds: 0,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(evt) {
    this.setState({
      [evt.target.name]: evt.target.value,
    });
  }

  handleSubmit() {
    const gameId = window.localStorage.getItem('gameId');
    const { rounds } = this.state;
    updateRoundsMax(gameId, rounds);
  }
  render() {
    return (
      <div className="background-div flex-cont-column">
        <h1>How Many Rounds?</h1>
        <select
          className="input-form"
          name="round"
          value={this.state.round}
          onChange={this.handleChange}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={15}>15</option>
          <option value={20}>20</option>
          <option value={25}>25</option>
        </select>
        <Link to="/create">
          <button onClick={this.handleSubmit}>Join Game</button>
        </Link>
      </div>
    );
  }
}
