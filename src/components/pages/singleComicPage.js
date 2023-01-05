import { Helmet } from 'react-helmet';
import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/spinner';
import Page404 from './404';

import './singleComicPage.scss';
import xMen from '../../resources/img/x-men.png';

const SingleComicPage = (props) => {
    const {comicId} = useParams();
    const [comic, setComic] = useState(null);

    const {loading, error, getSingleComic, clearError} = useMarvelService();

    useEffect(() => {
        updateComic(comicId);
    }, [comicId])

    const updateComic = (comicId) => {
        clearError();
        
        getSingleComic(comicId)
        .then(onComicLoaded)
    }

    const onComicLoaded = (comic) => {
        console.log(comic);
        setComic(comic);
    }



    const errorMessage = error ? <Page404 backToWhat={'comics list'} to = '/comics'/> : null;
    const spinner = loading ? <Spinner/> : null;
    const content = !(loading || error || !comic) ? <View comic={comic} /> : null;
    return (
        <>
            {errorMessage}
            {spinner}
            {content}
        </>
    )
}

const View = ({comic}) => {
    const {title,description,thumbnail,pageCount,language,price} = comic;
    return(
        <div className="single-comic">
        <Helmet>
            <meta
                name="description"
                content={`${title} comics book`}
                />
            <title>{title}</title>
        </Helmet>
        <img src={thumbnail} alt={title} className="single-comic__img"/>
        <div className="single-comic__info">
            <h2 className="single-comic__name">{title}</h2>
            <p className="single-comic__descr">{description}</p>
            <p className="single-comic__descr">{pageCount}</p>
            <p className="single-comic__descr">{language}</p>
            <div className="single-comic__price">{price}</div>
        </div>
        <Link to='/comics' className="single-comic__back">Back to all</Link>
    </div>
    )
} 

export default SingleComicPage;