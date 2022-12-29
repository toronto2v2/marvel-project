import './comicsList.scss';
import uw from '../../resources/img/UW.png';
import xMen from '../../resources/img/x-men.png';

import { useState, useEffect } from 'react';
import useMarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/errorMessage';
import Spinner from '../spinner/spinner';


const ComicsList = () => {
    const [offset, setOffset] = useState(0);
    const [comics, setComics] = useState([])
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [comicsEnded, setComicsEnded] = useState(false);



    const {loading, error, getAllComics} = useMarvelService();

    useEffect(() => {
        onRequest(offset, true);
    }, [])

    const onRequest = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true);
        getAllComics(offset)
            .then(onComicsUpdate);
            
    }

    const onComicsUpdate = (newComics) => {
        let ended = false;
        if(newComics.length < 8){
            ended = true;
        }

        setComics(() => [...comics, ...newComics ]);
        setNewItemLoading(newItemLoading => false);
        setOffset(offset => offset + 8);
        setComicsEnded(comicsEnded => ended);
    }

    const spinner = loading && !newItemLoading ? <Spinner/> : null;
    const errorMessage = error ? <ErrorMessage/> : null;

    let buttonStyle = newItemLoading ? {filter: 'grayscale(1)'} : {};
    comicsEnded ? buttonStyle.display = 'none': buttonStyle.display = 'block';
    return (
        <div className="comics__list">
            {spinner}
            {errorMessage}
            <View comics={comics}/>
            <button className="button button__main button__long"
                    onClick={ () => onRequest(offset)}
                    style = {buttonStyle}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

const View = ({comics}) => {
    const res = comics.map((item,i) => {
        return (
            <li className="comics__item"
                tabIndex={0}
                key = {i}>
                    <a href={item.link}>
                        <img src={item.thumbnail} alt={item.title} className="comics__item-img"/>
                        <div className="comics__item-name">{item.title}</div>
                        <div className="comics__item-price">{item.price}</div>
                    </a>
            </li>
        )
    })

    return(
        <ul className="comics__grid">
            {res}
        </ul>
    )
}   

export default ComicsList;