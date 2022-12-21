import './charList.scss';
import {Component} from 'react';
import PropTypes from 'prop-types'; // ES6

import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/spinner';
import ErrorMessage from '../errorMessage/errorMessage';

 
class CharList extends Component{

    state = {
        characters: [],
        loading: true,
        error: false,
        newItemLoading: false,
        offset: 210,
        charEnded: false,
    }

    marvelService = new MarvelService();
    
    onRequest = (offset) => {
        this.onCharlistLoading();
        this.marvelService
        .getAllCharacters(offset)
        .then(this.onCharactersLoaded)
        .catch(this.onCharactersError)
    }
    
    onCharlistLoading = () => {
        this.setState({
            newItemLoading: true,
        })
    }

    componentDidMount(){
        this.onRequest();
    }

    onCharactersLoaded = (newCharacters) =>{
        let ended = false;
        if(newCharacters.length < 9){
            ended = true;
        }

        this.setState(({characters, offset}) => ({
            characters: [...characters, ...newCharacters],
            loading: false, 
            error: false, 
            newItemLoading: false,
            offset: offset + 9,
            charEnded: ended,

        }))
    }

    onCharactersError = () => {
        this.setState({loading: false, error: true})
    }


    render() {
        const {characters, loading, error,newItemLoading, offset, charEnded} = this.state;
        const {onCharSelected} = this.props;
        
        const spinner = loading ? <Spinner/> : null;
        const errorMessage = error ? <ErrorMessage/> : null;
        const content = !(loading || error) ?  <View characters={characters} onCharSelected = {onCharSelected}/> : null ;


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
                    onClick = {() => this.onRequest(offset)}
                    style = {buttonStyle}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

const View = ({characters, onCharSelected}) => {
    const reg = /image_not_available/g;
    
    const res = characters.map(item => {
        return (
            <li className="char__item"
                key = {item.id}
                onClick = {() => onCharSelected(item.id)}>
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