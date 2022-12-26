import './charList.scss';
import {useState, useEffect, useRef} from 'react';
import PropTypes from 'prop-types'; // ES6

import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/spinner';
import ErrorMessage from '../errorMessage/errorMessage';

 
const CharList = (props) => {
    const [characters, setCharacters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [charEnded, setCharEnded] = useState(false);

    const marvelService = new MarvelService();

    useEffect(() => {
        onRequest();
    }, [])

    const listItemActive = useRef([]);

    const activateListItem = (event ,i) => {
        if(event.key === 'Enter' || event.type === 'click'){
            listItemActive.current.map(item => item.className = 'char__item')
            listItemActive.current[i].classList.add('char__item_selected');
        }

      };

    
    const onRequest = (offset) => {
        onCharlistLoading();
        marvelService
        .getAllCharacters(offset)
        .then(onCharactersLoaded)
        .catch(onCharactersError)
    }
    
    const onCharlistLoading = () => {
        setNewItemLoading(true)
    }

    const onCharactersLoaded = (newCharacters) =>{
        let ended = false;
        if(newCharacters.length < 9){
            ended = true;
        }

        setCharacters(() => [...characters, ...newCharacters]);
        setLoading( loading => false);
        setError(error => false);
        setNewItemLoading(newItemLoading => false);
        setOffset(offset => offset + 9);
        setCharEnded(charEnded => ended);
    }

    const onCharactersError = () => {
        setLoading( loading => false);
        setError(true);
    }

    
    const spinner = loading ? <Spinner/> : null;
    const errorMessage = error ? <ErrorMessage/> : null;
    const content = !(loading || error) ?  
            <View characters={characters} 
                  onCharSelected = {props.onCharSelected} 
                  activateListItem = {activateListItem} 
                  listItemActive = {listItemActive}/> 
            : null ;


    let buttonStyle = newItemLoading ? {filter: 'grayscale(1)'} : {};
    charEnded ? buttonStyle.display = 'none': buttonStyle.display = 'block';


    return (
        <div className="char__list">
                {spinner}
                {errorMessage}
                {content}
            <button 
                className="button button__main button__long"
                disabled = {newItemLoading}
                onClick = {() => onRequest(offset)}
                style = {buttonStyle}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
    
}

const View = ({characters, onCharSelected, activateListItem,listItemActive}) => {
    const reg = /image_not_available/g;
    
    const res = characters.map((item,i) => {
        return (
            <li className="char__item"
                ref={el => listItemActive.current[i] = el}
                tabIndex={0}
                key = {item.id}
                onKeyDown = {(e) => {onCharSelected(item.id);activateListItem(e,i)}}
                onClick = {(e) => {onCharSelected(item.id);activateListItem(e,i)}}>
                <img src={item.thumbnail} 
                     style = {reg.test(item.thumbnail) ? {objectFit:'contain'} : null}  
                     alt={item.name}/>
                <div className="char__name">{item.name}</div>
            </li>
        )
    })

    return (<ul className='char__grid'>
        {res}
    </ul>)

}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired,
}

export default CharList;