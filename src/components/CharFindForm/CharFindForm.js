import { useState } from "react";
import { Formik, Field, Form , ErrorMessage} from 'formik';
import * as Yup from 'yup';
import useMarvelService from "../../services/MarvelService";
import Spinner from '../spinner/spinner';


import './CharFindForm.css'



const CharFindForm = () => {
    const [char, setChar] = useState(null);
    const {loading,error,getCharacterByName, clearError} = useMarvelService();

    const updateChar = (name) => {
        clearError();

        getCharacterByName(name)
        .then(onCharLoaded)
    } 

    const onCharLoaded = (char) => {
        setChar(char)
    }   
    return(
        <Formik 
        initialValues={{ charName: ''}}
        validationSchema={Yup.object({
            charName: Yup.string().required('This field is required').min( 2,'Name should be more than 2 letters')
          })}
        onSubmit={({charName}) => updateChar(charName)}>

        <Form>
            <label htmlFor="charName">enter name</label>
            <Field name="charName" type="text" />
            <ErrorMessage name="charName"/>
    
            <button className="submit__btn" type="submit">Submit</button>
       </Form>
        
        </Formik>
    )
}

export default CharFindForm;