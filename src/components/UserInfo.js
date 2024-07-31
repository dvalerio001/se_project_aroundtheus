export default class UserInfo {
  constructor({ nameSelector, descriptionSelector }) {
    this._nameEl = document.querySelector(nameSelector);
    this._descriptionEl = document.querySelector(descriptionSelector);
  }

  getUserInfo() {
    return {
      title: this._nameEl.textContent,
      description: this._descriptionEl.textContent,
    };
  }

  setUserInfo({ title, description }) {
    this._nameEl.textContent = title;
    this._descriptionEl.textContent = description;
  }
}
