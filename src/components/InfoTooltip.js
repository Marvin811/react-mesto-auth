import React from "react";

function infoTooltip(props) {
    return(
        <section>
            <div>
                <img/>
                <h2></h2>
                <button
                    className="popup__close-button button "
                    aria-label="Кнопка закрытия"
                    type="button"
                    onClick={props.onClose}/>
            </div>
        </section>
    )
}

export default infoTooltip