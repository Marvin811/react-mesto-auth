import React from "react";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import {useState} from "react";
import Api from "../utils/Api";
import {CurrentUserContext} from "../contexts/CurrentUserContext";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import ImagePopup from "./ImagePopup";
import DeleteCardPopup from "./DeleteCardPopup";

function App() {
    const [currentUser, setCurrentUser] = useState({});
    const [currentCard, setCurrentCard] = useState([]);
    const [cardToDelete, setCardToDelete] = useState()

    const [selectorCard, setSelectorCard] = useState(null)

    const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
    const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
    const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
    const [isDeleteCardPopupOpen, setIsDeleteCardPopupOpen] = useState(false);

    const handleEditAvatarClick = () => setIsEditAvatarPopupOpen(true);
    const handleEditProfileClick = () => setIsEditProfilePopupOpen(true);
    const handleAddPlaceClick = () => setIsAddPlacePopupOpen(true);


    const handleCardClick = (card) => setSelectorCard(card);

    const closeAllPopups = () => {
        setIsAddPlacePopupOpen(false);
        setIsEditAvatarPopupOpen(false);
        setSelectorCard(false);
        setIsEditProfilePopupOpen(false);
        setIsDeleteCardPopupOpen(false)
    }

    React.useEffect(() => {
        Api.getCards()
            .then(card => {
                setCurrentCard(card)
            })
            .catch(err => console.log(`Ошибка в app.js при запросе getCards ${err}`))
    }, []);


    ///Получение данных пользователя/карточки
    React.useEffect(() => {
        Api.getUserInfo()
            .then(res => {
                setCurrentUser(res)
            })
            .catch(err => console.log(`Ошибка в App.js при запросе getUserInfo ${err}`))
    }, []);

    const handleCardLike = (card) => {
        // Снова проверяем, есть ли уже лайк на этой карточке
        const isLiked = card.likes.some(i => i._id === currentUser._id);

        // Отправляем запрос в API и получаем обновлённые данные карточки
        Api.changeLikeCardStatus(card._id, !isLiked)
            .then((newCard) => {
                setCurrentCard((state) => state.map((c) => c._id === card._id ? newCard : c));
            })
            .catch(err => console.log(`Ошибка в App.js при лайке карточки ${err}`))
    }
    const handleCardDelete = (card) => {
        // Отправляем запрос в API и получаем обновлённые данные карточки
        Api.deleteCard(card._id)
            .then(() => {
                setCurrentCard((state) => {
                    return state.filter((i) => i._id !== card._id)
                })
            })
            .catch(err => console.log(`Ошибка в App.js при лайке карточки ${err}`))
    }
    const handleUpdateUser = (currentUser) => {

        Api.setUserInfo({name: currentUser.name, info: currentUser.about})
            .then(user => setCurrentUser(user))
            .catch(err => console.log(`Ошибка в App.js при редактировании информации о user ${err}`))

        setIsEditProfilePopupOpen(false);
    }
    const handleUpdateAvatar = (updateAvatar) => {

        Api.editAvatar(updateAvatar)
            .then(avatar => setCurrentUser(avatar))
            .catch(err => console.log(`Ошибка в App.js при обновлении аватара ${err}`))

        setIsEditAvatarPopupOpen(false);
    }
    const handleAddPlaceSubmit = (obj) => {
        Api.addCard({name: obj.name, link: obj.link})
            .then((newCard) => setCurrentCard([newCard, ...currentCard]))
            .catch(err => console.log(`Ошибка в App.js при дабовление карточки ${err}`))

        setIsAddPlacePopupOpen(false);
    }
    const handleCardToDelete = (card) => {
        setIsDeleteCardPopupOpen(true)
        setCardToDelete(card)
    }


    return (
        <CurrentUserContext.Provider value={currentUser}>
            <div className="page">
                <div className="page__container">
                    <Header/>
                    <Main
                        onEditProfile={handleEditProfileClick}
                        onAddPlace={handleAddPlaceClick}
                        onEditAvatar={handleEditAvatarClick}
                        onCardClick={handleCardClick}
                        cards={currentCard}
                        onCardLike={handleCardLike}
                        onCardDelete={handleCardToDelete}
                    />
                    <Footer/>
                </div>

                <EditProfilePopup
                    isOpen={isEditProfilePopupOpen}
                    onClose={closeAllPopups}
                    onUpdateUser={handleUpdateUser}
                />

                <EditAvatarPopup
                    isOpen={isEditAvatarPopupOpen}
                    onClose={closeAllPopups}
                    onUpdateAvatar={handleUpdateAvatar}
                />

                <AddPlacePopup
                    isOpen={isAddPlacePopupOpen}
                    onClose={closeAllPopups}
                    onAddCard={handleAddPlaceSubmit}
                />

                <DeleteCardPopup
                    isOpen={isDeleteCardPopupOpen}
                    onClose={closeAllPopups}
                    onDeleteCard={() => handleCardDelete(cardToDelete)}
                />


                <ImagePopup
                    card={selectorCard}
                    onClose={closeAllPopups}
                />
            </div>
        </CurrentUserContext.Provider>
    );
}

export default App;
