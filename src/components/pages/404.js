import { Helmet } from "react-helmet"
import ErrorMessage from "../errorMessage/errorMessage"
import { Link } from "react-router-dom"


const Page404 = ({backToWhat, to}) => {
    return(
        <div>
        <Helmet>
            <meta
                name="Not Found"
                content={`Page not found`}
                />
            <title>Not Found</title>
        </Helmet>
            <ErrorMessage/>
            <p style={{'textAlign': 'center', 'fontWeight': 'bold','fontSize': '24px'}}>Page doesn’t exist</p>
            <Link style={{'display': 'block', 'textAlign': 'center', 'fontWeight': 'bold', 'fontSize': '24px', 'marginTop':'30px'}}
                to = {to} >Back to {backToWhat}</Link>
        </div>
    )
}

export default Page404;