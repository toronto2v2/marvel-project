import './SingleCharacterPage.css'
import { Helmet } from 'react-helmet';
import AppBanner from "../../appBanner/AppBanner";
import Spinner from '../../spinner/spinner';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useMarvelService from '../../../services/MarvelService';
import Page404 from '../404';
import { Link } from 'react-router-dom';


const SingleCharacterPage = (props) => {
    const {character} = useParams();
    const [char, setChar] = useState(null);

    const {loading, error, getCharacter, clearError} = useMarvelService();

    useEffect(() => {
        updateChar(character);
    }, [character])

    const updateChar = (char) => {
        clearError();
        
        getCharacter(char, true)
        .then(onCharLoaded)
    }

    const onCharLoaded = (char) => {
        setChar(char);
    }

    const errorMessage = error ? <Page404 backToWhat={'main page'} to = '/'/> : null;
    const spinner = loading ? <Spinner/> : null;
    const content = !(loading || error || !char) ? <View char={char} /> : null;

    return(
        <>
            <AppBanner/>
            {errorMessage}
            {spinner}
            {content}
        </>
    )
}
const View = ({char}) => {
    const {name,description,thumbnail} = char;
    return(
        <div className="single-char">
        <Helmet>
            <meta
                name="description"
                content={`Information about ${name}`}
                />
            <title>{name}</title>
        </Helmet>
        <img src={thumbnail} alt={name} className="single-char__img"/>
        <div className="single-char__info">
            <h2 className="single-char__name">{name}</h2>
            <p className="single-char__descr">{description}</p>
        </div>
        <Link to='/' className="single-char__back">Back to main page</Link>
    </div>
    )
} 
export default SingleCharacterPage;