import { useState, useEffect} from 'react';
import PropTypes from 'prop-types'; // ES6
import './charInfo.scss';
import useMarvelService from '../../services/MarvelService';
import CharFindForm from '../CharFindForm/CharFindForm';
import setContent from '../../utils/setContent';


function CharInfo (props) {
    const [char, setChar] = useState(null);

    const {getCharacter, process, setProcess} = useMarvelService();

    const updateChar = () => {
        const {charId} = props;
        if(!charId){
            return;
        }
        getCharacter(charId)
        .then(onCharLoaded)
        .then(() => setProcess('confirmed'))
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

    return (
        <div className="char__info-wrapper">
            <div className="char__info">

                {setContent(process, View, char)}
            </div>
            <CharFindForm/>

        </div>

    )
    
}

const View = ({data}) => {
    const {name, description, thumbnail,homepage,wiki, comics} = data;
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