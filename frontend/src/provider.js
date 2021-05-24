import axios from 'axios';

const searchApi = title => {
    const url = '/search/'+title;
    return axios.get(url);
}

export {searchApi}