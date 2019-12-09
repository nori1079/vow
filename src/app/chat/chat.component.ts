import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

import { Comment, User } from '../class/chat';
// import { SessionService } from '../core/service/session.service'; // 削除
import { Store } from '@ngrx/store'; // 追加
import * as fromCore from '../core/store/reducers'; // 追加

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  public content = '';
  public comments: Observable<Comment[]>;
  public CURRENT_USER: User;

  // DI（依存性注入する機能を指定）
  constructor(
    private db: AngularFirestore,
    private store: Store<fromCore.State>) { // 追加
    this.store.select(fromCore.getSession) // 変更
      .subscribe(data => {
        this.CURRENT_USER = data.user;
      });
  }

  ngOnInit() {
    this.comments = this.db
      .collection<Comment>('comments', ref => {
        return ref.orderBy('date', 'asc');
      })
      .snapshotChanges()
      .pipe(
        map(actions => actions.map(action => {
          // 日付をセットしたコメントを返す
          const data = action.payload.doc.data() as Comment;
          const key = action.payload.doc.id;
          const COMMENT_DATE = new Comment(data.user, data.content);
          COMMENT_DATE.setData(data.date, key);
          return COMMENT_DATE;
        })));
  }

  // 新しいコメントを追加
  addComment(e: Event, comment: string) {
    e.preventDefault();
    if (comment) {
      this.db
        .collection('comments')
        .add(new Comment(this.CURRENT_USER, comment).deserialize());
      this.content = '';
    }
  }

  // 編集フィールドの切り替え
  toggleEditComment(comment: Comment) {
    comment.EDIT_FLAG = (!comment.EDIT_FLAG);
  }

  // コメントを更新する
  saveEditComment(comment: Comment) {
    this.db
      .collection('comments')
      .doc(comment.key)
      .update({
        content: comment.content,
        date: comment.date
      })
      .then(() => {
        alert('コメントを更新しました');
        comment.EDIT_FLAG = false;
      });
  }

  // コメントをリセットする
  resetEditComment(comment: Comment) {
    comment.content = '';
  }

  // コメントを削除する
  deleteComment(key: string) {
    this.db
      .collection('comments')
      .doc(key)
      .delete()
      .then(() => {
        alert('コメントを削除しました');
      });
  }

}
