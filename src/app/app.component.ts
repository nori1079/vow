import { Component } from '@angular/core';
import { Comment } from './class/chat';
import { User } from './class/chat';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'vow';
  item: Observable<Comment>;
  public content = '';
  public comments = COMMENTS;
  public current_user = CURRENT_USER;

  constructor(db: AngularFirestore) {
    this.item = db
      .collection('comments')
      .doc<Comment>('item')
      .valueChanges();
  }

  addComment(comment: string) {
    if (comment) {
      this.comments.push(new Comment(this.current_user, comment));
    }
  }

}

const CURRENT_USER: User = new User(1, 'Tanaka Jiro')
const ANOTHER_USER: User = new User(2, 'Suzuki Taro')

const COMMENTS: Comment[] = [
  new Comment(ANOTHER_USER, 'Suzukiの１つ目のコメントです。'),
  new Comment(ANOTHER_USER, 'Suzukiの2つ目のコメントです。'),
  new Comment(CURRENT_USER, 'Tanakaの１つ目のコメントです。'),
  new Comment(ANOTHER_USER, 'Suzukiの3つ目のコメントです。'),
  new Comment(CURRENT_USER, 'Tanakaの2つ目のコメントです。')
];
