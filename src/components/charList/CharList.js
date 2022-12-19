import './charList.scss';
import {Component} from 'react';
import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/spinner';
import ErrorMessage from '../errorMessage/errorMessage';

 
class CharList extends Component{

    state = {
        characters: null,
        loading: true,
        error: false,
    }

    marvelService = new MarvelService();

    updateCharacterList = () => {
 
    }

    componentDidMount(){
        this.marvelService
        .getAllCharacters()
        .then(this.onCharactersLoaded)
        .catch(this.onCharactersError)
    }
    onCharactersLoaded = (characters) =>{
        this.setState({characters ,loading: false, error: false})
    }

    onCharactersError = () => {
        this.setState({loading: false, error: true})
    }


    render() {
        const {characters, loading, error} = this.state;
        const {onCharSelected} = this.props;
        
        const spinner = loading ? <Spinner/> : null;
        const errorMessage = error ? <ErrorMessage/> : null;
        const content = !(loading || error) ?  <View characters={characters} onCharSelected = {onCharSelected}/> : null ;


        return (
            <div className="char__list">
                    {spinner}
                    {errorMessage}
                    {content}
                <button className="button button__main button__long">
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

export default CharList;