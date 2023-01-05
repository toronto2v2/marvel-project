import { useState, useEffect } from "react";
import { Formik, Field, Form , ErrorMessage} from 'formik';
import * as Yup from 'yup';
import useMarvelService from "../../services/MarvelService";
import { Link } from "react-router-dom";

import './CharFindForm.css';



const CharFindForm = () => {
    const [char, setChar] = useState(null);
    const {loading, error, getCharacterByName, clearError} = useMarvelService();

    const updateChar = (name) => {
        clearError();

        getCharacterByName(name)
        .then(onCharLoaded)
    } 

    const onCharLoaded = (char) => {
        setChar(char)
    }   

    const notFound = Array.isArray(char) && char.length === 0  ? <div className="charNotFound">The character was not found. Check the name and try again</div> : null;
    const firsView = !char || char.length === 0? <div className="validation__wrapper-error">
                                <ErrorMessage name="charName" component='div' className="errorValidate"/>
                            </div> 
                            : 
                            <div className="validation__wrapper-success">
                                <div className="succes__text">There is! Visit {char[0].name} page?</div>
                                <Link to={`/character/${char[0].id}`}>
                                    <button 
                                        className="button button__main button__main_gray">
                                        <div className="inner">to page</div>
                                    </button>
                                </Link>
                            </div>;
    return(
        <Formik 
        initialValues={{ charName: ''}}
        validationSchema={Yup.object({
            charName: Yup.string().required('This field is required').min( 2,'Name should be more than 2 letters')
          })}
        onSubmit={({charName}) => updateChar(charName)}>

        <Form className="char-search-form" onChange={e => e.target.value ? setChar(null) : null}>
            <label htmlFor="charName">Or find character by name</label>
            <div className="inner__wrapper">
                <Field name="charName" type="text" className='input__field' placeholder="Enter name"/>
                <button 
                    type='submit' 
                    className="button button__main"
                    disabled={loading}>
                    <div className="inner">find</div>
                </button>
            </div>
            {firsView}
            {notFound}
       </Form>
        
        </Formik>
    )
}

export default CharFindForm;