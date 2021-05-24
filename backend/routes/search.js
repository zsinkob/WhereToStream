const express = require('express');
const router = express.Router();
const axios = require("axios");
const querystring = require('querystring');


const getAccessToken = () => {
    return axios.post('https://unogs.com/api/user', querystring.stringify({user_name: Date.now()}))
        .then(data => data.data.token.access_toke);
}

const searchNetflix2 = title => {
    const searchUrl = 'https://unogs.com/api/search?limit=20&offset=0&countrylist=334&country_andorunique=and&start_year=&end_year=&start_rating=&end_rating=&genrelist=&type=&audio=&subtitle=&audiosubtitle_andor=&person=&filterby=&orderby=&query='
        + encodeURI(title)
    return getAccessToken()
        .then(token => {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Referer: 'https://unogs.com',
                    Referrer: 'http://unogs.com'
                }
            };
            return axios.get(searchUrl, config).then(data => {
                console.log(data.data.results);
                return data.data.results?.map(item => {
                    return {
                        title: item.title,
                        source: 'netflix',
                        poster: item.img,
                        year: item.year,
                        type: item.vtype,
                        id: item.id,
                        imdbId: item.imdbid
                    }
                });
            });
        }).catch(function (error) {
            console.error(error);
        });
}

const mapHboType = {'1': 'movie', '2': 'series'}

const searchHbo = title => {
    const url = 'https://huapi.hbogo.eu/v8/Search/json/HUN/COMP/' + encodeURI(title) + '/0/0/0/0/0/3/0';
    return axios.get(url)
        .then(data => {
            const items = data.data.Container[0].Contents.Items;
            return items.map(item => {
                console.dir(item);
                const image = 'https://cdn.hbogo.eu/images/' + item.ImageIdentifier + '/160_229.jpg';
                return {
                    source: 'hbo',
                    //title: item.OriginalName + ' (' + item.EditedName + ')',
                    title: item.OriginalName,
                    poster: image,
                    type: mapHboType[item.ContentType],
                    id: item.Id
                };
            });
        })
}

router.get('/:title', async function (req, res, next) {
    const hboTitles = await searchHbo(req.params.title);
    const netflixTitles = await searchNetflix2(req.params.title);
    const titles = {hbo: hboTitles, netflix: netflixTitles};
    console.dir(titles);
    res.status(200).set('Access-Control-Allow-Origin', '*').json(titles);
});

module.exports = router;