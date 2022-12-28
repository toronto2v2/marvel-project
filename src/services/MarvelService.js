
import { useHttp } from "../hooks/http.hook";

const useMarvelService = () => {

    const {loading, request, error, clearError} = useHttp();

    const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    const _apiKey = 'apikey=3f78486c01f84cbc8db5c4360de52f37';
    const _baseOffset = 210;

    // getResourse = async (url) => {
    //     let res = await fetch(url);
    //     if(!res.ok){
    //         throw new Error(`Could not fetch ${url} status: ${res.status}`)
    //     }
    //     return await res.json();

    // }
    const getAllComics = async (offset) => {
        const res = await request(`${_apiBase}comics?limit=8&offset=${offset}&${_apiKey}`)
        return _transformComics(res.data.results)
    }

    const getAllCharacters = async(offset = _baseOffset) => {

        const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_transformCharacter)
    }

    const getCharacter = async (id) => {
       const res = await request(`${_apiBase}characters/${id}?&${_apiKey}`);
       return  _transformCharacter(res.data.results[0]);
    }


    const _transformComics = (comics) => {
        console.log(comics);
        return comics.map(item => {
            return {
                id: item.id,
                title: item.title,
                price: item.prices[0].price,
                thumbnail: item.thumbnail.path + '.' + item.thumbnail.extension,
                link: item.urls[0].url,
            }
        })
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

    return{loading, error, getAllCharacters, getCharacter, clearError, getAllComics}
}

export default useMarvelService;