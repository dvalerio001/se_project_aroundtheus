import Popup from "./Popup.js";

export default class PopupWithImage extends Popup {
  open(data) {
    const popupImage = this._popup.querySelector(".modal__preview-image");
    const popupCaption = this._popup.querySelector(".modal__preview-caption");
    popupImage.src = data.link; // set the image's src and alt
    popupImage.alt = data.name;
    popupCaption.textContent = data.name; // set the caption's textContent
    super.open();
  }
}
