import React, {useState} from 'react';
import {Button, IconButton, TextField} from '@material-ui/core';
import InputLabel from '@material-ui/core/InputLabel';
import SearchIcon from '@material-ui/icons/Search';
import {searchApi} from './provider';
import Select from '@material-ui/core/Select';

function Movie(props) {
    const imdbLink = props.item.imdbId && props.item.imdbId.startsWith('tt')
        ? 'https://www.imdb.com/title/' + props.item.imdbId
        : 'https://www.imdb.com/find?q=' + encodeURI(props.item.title);
    return <div style={{margin: '10px', width: '160px'}}>
        <div>
            <a href={imdbLink} target="_blank" rel="noreferrer">
                <img src={props.item.poster} alt={props.item.id}/>
            </a>
        </div>
        <div>{props.item.title}</div>
    </div>;
}

function Movies(props) {
    return <div style={{display: 'flex', flexWrap: 'wrap'}}>
        {props.results && props.results.filter(item => props.contentType ? item.type === props.contentType : true)
            .map(item => {
                return <Movie item={item}/>;
            })}
        {!props.results && <div>no results</div>}
    </div>;
}

function App() {

    const [results, setResults] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [contentType, setContentType] = useState('');


    const search = () => {
        searchApi(searchText).then(results => {
            console.dir(results);
            setResults(results.data);
            setSearchText('');
        });
    }

    const onKeyDown = (e) => {
        if (e.keyCode === 13) {
            search();
        }
    }

    const changeContentType = (e) => {
        console.log(e.target.name);

        setContentType(e.target.value);
    }


    return (
        <div>
            <div className="search">

                <Select
                    displayEmpty
                    native
                    value={contentType}
                    onChange={changeContentType}
                    inputProps={{
                        name: 'contentType',
                        id: 'content-type',
                    }}
                >
                    <option value=''>All</option>
                    <option value='movie'>Movies</option>
                    <option value='series'>Series</option>
                </Select>
                <TextField id="standard-search" onChange={e => setSearchText(e.target.value)} onKeyDown={onKeyDown}
                           label="Search movie"
                           type="search"/>
                <IconButton aria-label="delete" onClick={search}>
                    <SearchIcon/>
                </IconButton>
            </div>
            <div className="results">
                <img style={{margin: '20px', height: '50px'}} src="https://upload.wikimedia.org/wikipedia/commons/5/5a/HBOGO.svg" alt="hbologo"/>
                <Movies results={results.hbo} contentType={contentType}/>
                <img style={{margin: '20px', height: '50px'}}
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/320px-Netflix_2015_logo.svg.png"
                    alt="netflixlogo"/>
                <Movies results={results.netflix} contentType={contentType}/>
            </div>
        </div>
    );
}

export default App;
