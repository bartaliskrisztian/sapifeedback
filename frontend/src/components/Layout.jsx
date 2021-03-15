import React from 'react';
import { Switch } from 'react-router-dom';
import { Container } from 'reactstrap';

function Layout(props) {


    return (
        <div className="layout">
            <Container>
                <Switch>
                    {props.children}
                </Switch>
            </Container>
        </div>
    );
}

export default Layout;