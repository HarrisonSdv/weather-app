import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Home from './Home';
import Closer from './Closer';
import Error from './Error'
import Load from './Load'

class IndexComponent extends React.Component {

    render(){
        return(
            <div> 
                <BrowserRouter>
                    <Switch>    
                        <Route exact path="/" component={Home} />
                        <Route exact path="/search/:id" render={props=> <Closer {...props} /> } />
                        <Route exact path="/Loading" component={Load} />
                        <Route path="/*" component={Error} />
                    </Switch>
                </BrowserRouter>
            </div>
        )
    }
}

export default IndexComponent;
