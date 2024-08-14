import Popup from "./Popup.js";

export default class PopupWithConfirm extends Popup {
  constructor(popupSelector) {
    super(popupSelector);
    this._form = this._popup ? this._popup.querySelector(".modal__form") : null;
    this._submitButton = this._form
      ? this._form.querySelector(".modal__button")
      : null;
  }

  setAction(action) {
    this._handleSubmit = action;
  }

  setEventListeners() {
    super.setEventListeners();
    if (this._form) {
      this._form.addEventListener("submit", (evt) => {
        evt.preventDefault();
        this._handleSubmit();
      });
    }
  }

  open() {
    super.open();
    if (this._submitButton) {
      this._submitButton.textContent = "Yes";
    }
  }

  renderLoading(isLoading, loadingText = "Deleting...") {
    if (this._submitButton) {
      if (isLoading) {
        this._submitButton.textContent = loadingText;
      } else {
        this._submitButton.textContent = "Yes";
      }
    }
  }
}
