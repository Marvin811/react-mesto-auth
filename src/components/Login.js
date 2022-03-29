import React from "react";

function Login(props) {
    return (
        <section className='entrance'>
            <div className='entrance__container'>
                <h3 className='entrance__title'>Вход</h3>
                <form className='entrance__form'>
                    <input
                        className='entrance__input'
                        required
                        name='email'
                        type='text'
                        placeholder="Email"/>
                    <span className="entrance__error-visible" id="name-error"></span>
                    <input
                        className='entrance__input'
                        required
                        name='password'
                        type='text'
                        placeholder="Пароль"/>
                    <span className="entrance__error-visible" id="name-error"></span>
                    <button className="button entrance__save-button" type="submit">Войти</button>
                </form>
            </div>
        </section>
    )
}

export default Login