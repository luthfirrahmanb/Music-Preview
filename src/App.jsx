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
            artist: null,
            tracks: []
        }
    }

    search() {
        const BASE_URL = 'https://api.spotify.com/v1/search?';
        let FETCH_URL = `${BASE_URL}q=${this.state.query}&type=artist&limit=1`;
        const ALBUM_URL = 'https://api.spotify.com/v1/artists/';
        let accessToken = 'BQBQeBuhpHMrWCwoEy4Ona-c-vYmbQDzIqp9zIwGYbDI-k6LGRbg101afA-wQXXtgh2KnOS0leiRpvY6Uo8fdqbVP-HjlYoaxF093d69YZgIPHZjy6-GKUAWXt0zwZ7u3TRZ9QLnsvW4FJhJyrvIBeKC2RIAKdZKNBM5gdwcgaYdRt3Fcaw&refresh_token=AQAJFGpx_-wLkhHc8_BiIFNfOcvxLuI095A5ESj5DWLReCvwV3szBTE8l0RxoPZdsGDYBVRc4u0lhWLJLyxU1k4O0ORJE9eteKhGqHy7oXNcyCXVn_hl-IBgqy7J3HTh6JI';

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
                console.log('artist', artist);
                this.setState({ artist });

                FETCH_URL = `${ALBUM_URL}${artist.id}/top-tracks?country=US&`
                fetch(FETCH_URL, options)
                    .then(response => response.json())
                    .then(json => {
                        console.log('artist top track', json);
                        const { tracks } = json;
                        this.setState({ tracks });
                    })

            })

    }

    render() {
        return (
            <div className="App">
                <div className="App-title">Music master</div>
                <FormGroup>
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