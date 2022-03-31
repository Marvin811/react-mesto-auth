import React from "react";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import { useState } from "react";
import Api from "../utils/Api";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import ImagePopup from "./ImagePopup";
import DeleteCardPopup from "./DeleteCardPopup";
import { Redirect, Route, Switch, useHistory } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import ProtectedRoute from "./ProtectedRoute";
import InfoTooltip from "./InfoTooltip";

import * as Auth from "../utils/Auth";

function App() {
  const [currentUser, setCurrentUser] = useState({});
  const [currentCard, setCurrentCard] = useState([]);

  const history = useHistory();
  const [loggedIn, setLoggetIn] = useState(false);
  const [email, setEmail] = useState("");

  const [cardToDelete, setCardToDelete] = useState();

  const [selectorCard, setSelectorCard] = useState(null);

  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isDeleteCardPopupOpen, setIsDeleteCardPopupOpen] = useState(false);
  const [isInfoTooltip, setInfoTooltip] = useState(false);

  const handleEditAvatarClick = () => setIsEditAvatarPopupOpen(true);
  const handleEditProfileClick = () => setIsEditProfilePopupOpen(true);
  const handleAddPlaceClick = () => setIsAddPlacePopupOpen(true);
  const handleLoggedIn = () => setLoggetIn(true);

  const handleCardClick = (card) => setSelectorCard(card);

  const closeAllPopups = () => {
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setSelectorCard(false);
    setIsEditProfilePopupOpen(false);
    setIsDeleteCardPopupOpen(false);
    setInfoTooltip(false);
  };


  React.useEffect(() => {
    Promise.all([Api.getCards(), Api.getUserInfo()])
    .then(([card, res]) => {
      setCurrentCard(card);
      setCurrentUser(res);
    })
    .catch((err) => console.log(err))
  }, []);

  

  React.useEffect(() => {
    tokenCheck();
  }, [history]);

  const handleCardLike = (card) => {
    // Снова проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some((i) => i._id === currentUser._id);

    // Отправляем запрос в API и получаем обновлённые данные карточки
    Api.changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCurrentCard((state) =>
          state.map((c) => (c._id === card._id ? newCard : c))
        );
      })
      .catch((err) => console.log(`Ошибка в App.js при лайке карточки ${err}`));
  };
  const handleCardDelete = (card) => {
    // Отправляем запрос в API и получаем обновлённые данные карточки
    Api.deleteCard(card._id)
      .then(() => {
        setCurrentCard((state) => {
          return state.filter((i) => i._id !== card._id);
        });
      })
      .catch((err) => console.log(`Ошибка в App.js при лайке карточки ${err}`));
  };
  const handleUpdateUser = (currentUser) => {
    Api.setUserInfo({ name: currentUser.name, info: currentUser.about })
      .then((user) => setCurrentUser(user))
      .catch((err) =>
        console.log(
          `Ошибка в App.js при редактировании информации о user ${err}`
        )
      );

    setIsEditProfilePopupOpen(false);
  };
  const handleUpdateAvatar = (updateAvatar) => {
    Api.editAvatar(updateAvatar)
      .then((avatar) => setCurrentUser(avatar))
      .catch((err) =>
        console.log(`Ошибка в App.js при обновлении аватара ${err}`)
      );

    setIsEditAvatarPopupOpen(false);
  };
  const handleAddPlaceSubmit = (obj) => {
    Api.addCard({ name: obj.name, link: obj.link })
      .then((newCard) => setCurrentCard([newCard, ...currentCard]))
      .catch((err) =>
        console.log(`Ошибка в App.js при дабовление карточки ${err}`)
      );

    setIsAddPlacePopupOpen(false);
  };
  const handleCardToDelete = (card) => {
    setIsDeleteCardPopupOpen(true);
    setCardToDelete(card);
  };
  // const handleRegister = (password, email) => {
  //     return Auth.register(password, email)
  //         .catch(err => {
  //             console.log(err)
  //         })
  // }
  function handleInfoTooltip(result) {
    setInfoTooltip(true)
  }


  function tokenCheck() {
    if (localStorage.getItem("token")) {
      const jwt = localStorage.getItem("token");
      Auth.getContent(jwt).then((res) => {
        if (res) {
          handleLoggedIn();
          setEmail(res.email);
          history.push("/");
        }
      });
    }
  }

  function handleRegister(password, email) {
    return Auth.register(password, email).then(() => {
      // error
      history.push("/sign-in");
    });
  }

  function handleLogin(email, password) {
    return Auth.authorize(email, password).then((data) => {
      if (data.token) {
        setEmail(email);
        localStorage.setItem("token", data.token);
        handleLoggedIn();
        handleInfoTooltip(false)
        history.push("/");
      }
    })
    .catch(err => {
      console.log(err)
      handleInfoTooltip(false);
    })
  }
  function handleSignOut() {
    localStorage.removeItem("token");
    setLoggetIn(false);
    setEmail("");
    history.push("/sign-in");
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <div className="page__container">
          <Header email={email} onSignOut={handleSignOut} />
          <Switch>
            <Route path="/sign-in">
              <Login onLogin={handleLogin} />
            </Route>

            <Route path="/sign-up">
              <Register onRegister={handleRegister} />
            </Route>

            <ProtectedRoute
              exact
              path="/"
              loggedIn={loggedIn}
              component={Main}
              onEditProfile={handleEditProfileClick}
              onAddPlace={handleAddPlaceClick}
              onEditAvatar={handleEditAvatarClick}
              onCardClick={handleCardClick}
              cards={currentCard}
              onCardLike={handleCardLike}
              onCardDelete={handleCardToDelete}
            />

            <Route>
              {loggedIn ? <Redirect to="/" /> : <Redirect to="/sign-in" />}
            </Route>
          </Switch>

          <Footer />

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

          <InfoTooltip result={isInfoTooltip} onClose={closeAllPopups} />

          <ImagePopup card={selectorCard} onClose={closeAllPopups} />
        </div>
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
