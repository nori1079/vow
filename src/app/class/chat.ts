import * as moment from 'moment';

export class User {
  uid: number;
  name: string;

  constructor(uid: number, name: string) {
    this.uid = uid;
    this.name = name;
  }

  deserialize() {
    return Object.assign({}, this);
  }
}

export class Comment {
  user: User;
  initial: string;
  content: string;
  date: number;
  key?: string;
  editflag?: boolean;

  constructor(user: User, content: string) {
    this.user = user;
    this.initial = user.name.slice(0, 1);
    this.content = content;
    this.date = +moment();
  }

  deserialize() {
    this.user = this.user.deserialize();
    return Object.assign({}, this);
  }

  // 取得した日付を反映し、更新フラグをつける
  setData(date: number, key: string): Comment {
    this.date = date;
    this.key = key;
    this.editflag = false;
    return this;
  }
}

export class Session { // 追加
  login: boolean;

  constructor() {
    this.login = false;
  }

  reset(): Session { // 追加
    this.login = false;
    return this;
  }
}
export class Password { // 追加
  email: string;
  password: string;
  passwordconfirmation: string;

  constructor() {
    this.email = '';
    this.password = '';
    this.passwordconfirmation = '';
  }

  reset(): void {
    this.email = '';
    this.password = '';
    this.passwordconfirmation = '';
  }
}
