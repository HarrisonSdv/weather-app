import React from 'react'
import './Error.css'

class Error extends React.Component{


    render(){
        return(
            <div id="error">
                <h1>You encounter an error</h1>
                <h1>you can go back to home by clicking this <span id="link" onClick={(event)=>this.props.history.push('/')}>Link</span> </h1>

                <img src={process.env.PUBLIC_URL + '/Error.png'} alt="error"></img>
            </div>
        )
    }
}

export default Error;