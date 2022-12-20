import { Component } from 'react';
import './charInfo.scss';
import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/spinner';
import ErrorMessage from '../errorMessage/errorMessage';
import Skeleton from '../skeleton/Skeleton';


class CharInfo extends Component {
    
    state = {
        char: null,
        loading: false,
        error: false,
    }

    marvelService = new MarvelService();

    updateChar = () => {
        const {charId} = this.props;
        if(!charId){
            return;
        }

        this.onCharLoading();

        this.marvelService
        .getCharacter(charId)
        .then(this.onCharLoaded)
        .catch(this.onError)
    }

    componentDidMount() {
        this.updateChar();
    }
    componentDidUpdate(prevProps, prevState){
        if(this.props.charId !== prevProps.charId){
            this.updateChar();
        }
    }

    onCharLoaded = (char) => {
        this.setState({char, loading: false, error: false});
    }

    onCharLoading = () => {
        this.setState({loading: true,})
    }

    onError = () =>{
        this.setState({ loading: false, error: true});
    }

    render () {
        const {char, loading,error} = this.state;
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

export default CharInfo;