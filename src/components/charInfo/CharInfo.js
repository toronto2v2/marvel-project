import { useState, useEffect} from 'react';
import PropTypes from 'prop-types'; // ES6
import './charInfo.scss';
import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/spinner';
import ErrorMessage from '../errorMessage/errorMessage';
import Skeleton from '../skeleton/Skeleton';


function CharInfo (props) {
    const [char, setChar] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);



    const marvelService = new MarvelService();

    const updateChar = () => {
        const {charId} = props;
        if(!charId){
            return;
        }

        onCharLoading();

        marvelService
        .getCharacter(charId)
        .then(onCharLoaded)
        .catch(onError)
    }

    useEffect(() => {
        updateChar();
    }, [])

    useEffect(() => {
        updateChar();
    }, [props.charId])

    const onCharLoaded = (char) => {
        setChar(char);
        setLoading(loading => false);
        setError(error => false);
    }

    const onCharLoading = () => {
        setLoading(loading => true)
    }

    const onError = () =>{
        setLoading(loading => false);
        setError(error => true);
    }


    const skeleton =  char || loading || error ? null : <Skeleton/>;
    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading ? <Spinner/> : null;
    const content = !(loading || error || !char) ? <View char={char} /> : null;

    return (
        <div className="char__info">
            {skeleton}
            {errorMessage}
            {spinner}
            {content}
        </div>
    )
    
}

const View = ({char}) => {
    const {name, description, thumbnail,homepage,wiki, comics} = char;
    const reg = /image_not_available/g;

    return (
        <>
            <div className="char__basics">
                <img src={thumbnail} alt={name} style = {reg.test(thumbnail) ? {objectFit:'contain'} : null}/>
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">
                {description}
            </div>
            <div className="char__comics">{comics.length ? 'Comics:' : <h4>Comics about this character are not found</h4>}</div>

            <ul className="char__comics-list">

                <ComicsList comics = {comics}/>

            </ul>
        </>
    )
}

const ComicsList = ({comics}) => {
    return comics.map((item,i) => {
        if(i > 9) return null

        return(
            
            <li key = {i} className="char__comics-item">
                {item.name}
            </li>
        )
    })

   
}

CharInfo.propTypes = {
    charId: PropTypes.number,
}
export default CharInfo;