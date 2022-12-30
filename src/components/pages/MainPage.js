import { useState } from "react";
import CharList from "../charList/CharList";
import CharInfo from "../charInfo/CharInfo";
import RandomChar from "../randomChar/RandomChar";
import ErrorBoundary from "../errorBoundary/errorBoundary";
import decoration from '../../resources/img/vision.png';


const MainPage = () => {

    const [selectedChar, setChar] = useState(null);

    const onCharSelected = (id) => {
        setChar(id);
    }




    return(
        <>
            <ErrorBoundary>
                <RandomChar/>
            </ErrorBoundary>

            <div className="char__content">

                <ErrorBoundary>
                    <CharList onCharSelected = {onCharSelected}/>
                </ErrorBoundary>

                <ErrorBoundary>
                    <CharInfo charId = {selectedChar}/>
                </ErrorBoundary>

            </div>

            <img className="bg-decoration" src={decoration} alt="vision"/>
        </>
    )
}

export default MainPage;