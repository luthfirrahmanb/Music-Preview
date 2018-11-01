import React, { Component } from 'react';
import './App.css'
import { FormGroup, FormControl, InputGroup, Glyphicon } from 'react-bootstrap'
import Profile from './Profile';
import Gallery from './Gallery';

class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            query: '',
            tokens: '',
            artist: null,
            tracks: []
        }
    }

    search() {
        if (this.state.query === '') {
            alert('Can\'t Search blank Query')
        } else {
            const BASE_URL = 'https://api.spotify.com/v1/search?';
            let FETCH_URL = `${BASE_URL}q=${this.state.query}&type=artist&limit=1`;
            const ALBUM_URL = 'https://api.spotify.com/v1/artists/';
            let accessToken = this.state.tokens;

            let options = {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + accessToken
                },
                mode: 'cors',
                cache: 'default'
            };

            fetch(FETCH_URL, options)
                .then(response => response.json())
                .then(json => {
                    const artist = json.artists.items[0];
                    this.setState({ artist });

                    FETCH_URL = `${ALBUM_URL}${artist.id}/top-tracks?country=US&`
                    fetch(FETCH_URL, options)
                        .then(response => response.json())
                        .then(json => {
                            const { tracks } = json;
                            this.setState({ tracks });
                        })

                })
        }

    }

    render() {
        console.log(this.state.tokens)
        return (
            <div className="App">
                <div className="App-title">Music Preview</div>
                <FormGroup>
                    <InputGroup>
                        <FormControl
                            type="text"
                            placeholder="Input your Tokens"
                            value={this.state.tokens}
                            onChange={event => { this.setState({ tokens: event.target.value }) }}
                            onKeyPress={event => {
                                if (event.key === 'Enter') {
                                    this.setState({ tokens: event.target.value })
                                }
                            }}
                        />
                    </InputGroup>
                    <br />
                    <InputGroup>
                        <FormControl
                            type="text"
                            placeholder="Search for an artist"
                            value={this.state.query}
                            onChange={event => { this.setState({ query: event.target.value }) }}
                            onKeyPress={event => {
                                if (event.key === 'Enter') {
                                    this.search()
                                }
                            }}
                        />
                        <InputGroup.Addon onClick={() => this.search()}>
                            <Glyphicon glyph="search"></Glyphicon>
                        </InputGroup.Addon>
                    </InputGroup>
                </FormGroup>
                {
                    this.state.artist !== null
                        ?
                        <div>
                            <Profile
                                artist={this.state.artist}
                            />
                            <Gallery
                                tracks={this.state.tracks}
                            />
                        </div>
                        : <div></div>

                }
            </div>
        )
    }
}

export default App;