import { useState, useEffect} from 'react';
import PropTypes from 'prop-types'; // ES6
import './charInfo.scss';
import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/spinner';
import ErrorMessage from '../errorMessage/errorMessage';
import Skeleton from '../skeleton/Skeleton';
import CharFindForm from '../CharFindForm/CharFindForm';


function CharInfo (props) {
    const [char, setChar] = useState(null);

    const {loading,error,getCharacter} = useMarvelService();

    const updateChar = () => {
        const {charId} = props;
        if(!charId){
            return;
        }
        getCharacter(charId)
        .then(onCharLoaded)
    }

    useEffect(() => {
        updateChar();
    }, [])

    useEffect(() => {
        updateChar();
    }, [props.charId])

    const onCharLoaded = (char) => {
        setChar(char);
    }



    const skeleton =  char || loading || error ? null : <Skeleton/>;
    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading ? <Spinner/> : null;
    const content = !(loading || error || !char) ? <View char={char} /> : null;

    return (
        <div className="char__info-wrapper">
            <div className="char__info">
                {skeleton}
                {errorMessage}
                {spinner}
                {content}
            </div>
            <CharFindForm/>

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