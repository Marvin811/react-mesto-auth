import React from 'react';
import headerLogo from "../images/logo-mesto.svg";
import {Link, Route} from "react-router-dom";

function Header(props) {
    return (
        <header className="header">
            <img src={headerLogo} alt="Логотип Место" className="header__logo"/>
                <Route path="/sign-in">
                    <Link to='sign-up' className='header__link'>Регистрация</Link>
                </Route>
                <Route path="/sign-up">
                    <Link to='sign-in' className='header__link'>Войти</Link>
                </Route>
                <Route path='/'>
                    <p>{props.email}</p>
                </Route>
        </header>
    );
}

export default Header;