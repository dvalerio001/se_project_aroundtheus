export default class Popup {
  constructor(popupSelector) {
    this._popup = document.querySelector(popupSelector);
    if (!this._popup) {
      console.warn(`Popup element with selector "${popupSelector}" not found.`);
    }
    this._handleEscClose = this._handleEscClose.bind(this);
  }

  open() {
    if (this._popup) {
      this._popup.classList.add("modal_opened");
      document.addEventListener("keydown", this._handleEscClose);
    }
  }

  close() {
    if (this._popup) {
      this._popup.classList.remove("modal_opened");
      document.removeEventListener("keydown", this._handleEscClose);
    }
  }

  _handleEscClose(evt) {
    if (evt.key === "Escape") {
      this.close();
    }
  }

  setEventListeners() {
    if (this._popup) {
      this._popup.addEventListener("mousedown", (evt) => {
        if (
          evt.target.classList.contains("modal_opened") ||
          evt.target.classList.contains("modal__close")
        ) {
          this.close();
        }
      });
    }
  }
}
