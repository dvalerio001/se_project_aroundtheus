import Popup from "./Popup.js";

export default class PopupWithConfirm extends Popup {
  constructor(popupSelector) {
    super(popupSelector);
    this._form = this._popup.querySelector(".modal__form");
    this._submitButton = this._form.querySelector(".modal__button");
  }

  setAction(action) {
    this._handleSubmit = action;
  }

  setEventListeners() {
    super.setEventListeners();
    this._form.addEventListener("submit", (evt) => {
      evt.preventDefault();
      this._handleSubmit();
    });
  }

  open() {
    super.open();
    if (this._submitButton) {
      this._submitButton.textContent = "Yes";
      this._submitButton.disabled = false;
      this._submitButton.classList.remove("modal__button_disabled");
    }
  }

  renderLoading(isLoading, loadingText = "Deleting...") {
    if (this._submitButton) {
      if (isLoading) {
        this._submitButton.textContent = loadingText;
        this._submitButton.disabled = true;
      } else {
        this._submitButton.textContent = "Yes";
        this._submitButton.disabled = false;
      }
    }
  }
}
