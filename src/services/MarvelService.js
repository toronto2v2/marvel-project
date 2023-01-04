
import { useHttp } from "../hooks/http.hook";

const useMarvelService = () => {

    const {loading, request, error, clearError} = useHttp();

    const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    const _apiKey = 'apikey=3f78486c01f84cbc8db5c4360de52f37';
    const _baseOffset = 210;

    
    const getAllComics = async (offset) => {
        const res = await request(`${_apiBase}comics?limit=8&offset=${offset}&${_apiKey}`)
        return res.data.results.map(_transformComics);
    }

    const getSingleComic = async (id) => {
        const res = await request(`${_apiBase}comics/${id}?${_apiKey}`)
        return _transformComics(res.data.results[0])
    }

    const getAllCharacters = async(offset = _baseOffset) => {

        const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_transformCharacter)
    }

    const getCharacter = async (id) => {
       const res = await request(`${_apiBase}characters/${id}?&${_apiKey}`);
       return  _transformCharacter(res.data.results[0]);
    }



    const getCharacterByName = async (name) => {
        let string;
        if(name.indexOf(' ') === -1){
            string = `${_apiBase}characters?name=${name}&${_apiKey}`
        }else{
            string = `${_apiBase}characters?name=${name.replace(/ /g, '%20')}&${_apiKey}`
        }
        const res = await request(string);
        return _transformCharacter(res.data.results[0])
    }


    const _transformComics = (comics) => {
        return {
            id: comics.id,
            title: comics.title,
            price: comics.prices[0].price ? comics.prices[0].price + '$' : 'NOT AVAILABLE',
            thumbnail: comics.thumbnail.path + '.' + comics.thumbnail.extension,
            pageCount: comics.pageCount ? comics.pageCount + ' pages' : 'No any data about pages quantity',
            description: comics.description ? comics.description : 'Description are not available',
            language: comics.textObjects[1] ? comics.textObjects[1].language : 'No data about langeages'
        }
    }

    const _transformCharacter = (char) => {
        return {
            id: char.id,
            name: char.name,
            description: char.description ? `${char.description.slice(0, 210)}...` : 'There is no description for this character',
            thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            comics: char.comics.items
        }
    }

    return{loading, error, getAllCharacters, getCharacter, clearError, getAllComics,getSingleComic,getCharacterByName}
}

export default useMarvelService;