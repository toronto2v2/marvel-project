import './charList.scss';
import {useState, useEffect, useRef} from 'react';
import PropTypes from 'prop-types'; // ES6

import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/spinner';
import ErrorMessage from '../errorMessage/errorMessage';
import { Transition } from 'react-transition-group'


 
const CharList = (props) => {
    const [characters, setCharacters] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [charEnded, setCharEnded] = useState(false);
    const [animationToggle, setAnimationToggle] = useState(false);

    const {loading, error, getAllCharacters} = useMarvelService();

    useEffect(() => {
        onRequest(offset, true);
    }, [])

    const listItemActive = useRef([]);

    const activateListItem = (event ,i, id) => {

        if(event.key === 'Enter' || event.type === 'click'){
            props.onCharSelected(id)
            listItemActive.current.map(item => item.className = 'char__item')
            listItemActive.current[i].classList.add('char__item_selected');
        }

      };

    
    const onRequest = (offset, initial) => {
        setAnimationToggle(false);
        initial ? setNewItemLoading(false) : setNewItemLoading(true);
        getAllCharacters(offset)
            .then(onCharactersLoaded);

    }
    
    const onCharactersLoaded = (newCharacters) =>{
        let ended = false;
        if(newCharacters.length < 9){
            ended = true;
        }

        setCharacters(() => [...characters, ...newCharacters]);
        setNewItemLoading(newItemLoading => false);
        setOffset(offset => offset + 9);
        setCharEnded(charEnded => ended);
        setAnimationToggle(true);
        

    }
    
    const spinner = loading && !newItemLoading ? <Spinner/> : null;
    const errorMessage = error ? <ErrorMessage/> : null;
    let buttonStyle = newItemLoading ? {filter: 'grayscale(1)'} : {};
    charEnded ? buttonStyle.display = 'none': buttonStyle.display = 'block';


    return (
        <div className="char__list">
                {spinner}
                {errorMessage}
                <View  characters={characters} 
                       onCharSelected = {props.onCharSelected} 
                       activateListItem = {activateListItem} 
                       listItemActive = {listItemActive}
                       animationToggle = {animationToggle}/>
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

const View = ({characters, onCharSelected, activateListItem,listItemActive, animationToggle}) => {
    const reg = /image_not_available/g;

    const duration = 200;

    const defaultStyle = {
    transition: `all ${duration}ms ease-in-out`,
    opacity: 0,
    visibility: 'hidden'
    }

    const transitionStyles = {
    entering: { opacity: 1, visibility: 'visible'},
    entered:  { opacity: 1 ,visibility: 'visible'},
    exiting:  { opacity: 0 , visibility: 'hidden'},
    exited:  { opacity: 0, visibility: 'hidden'},
};
    
    const res = characters.map((item,i) => {
        return (
            <li className="char__item"
                ref={el => listItemActive.current[i] = el}
                tabIndex={0}
                key = {item.id}
                onKeyDown = {(e) => {activateListItem(e, i, item.id)}}
                onClick = {(e) => {onCharSelected(item.id);activateListItem(e,i,item.id)}}>
                <img src={item.thumbnail} 
                    style = {reg.test(item.thumbnail) ? {objectFit:'contain'} : null}  
                    alt={item.name}/>
                <div className="char__name">{item.name}</div>
            </li>
        )
    })

    return (
        <Transition in={animationToggle} timeout={duration}>
            {state => (<ul className='char__grid'
                style={{
                    ...defaultStyle,
                    ...transitionStyles[state]
                }}>
                {res}
            </ul>)}
        </Transition>
    )

}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired,
}

export default CharList; 