import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {UserService} from '../service/user.service';
import {PostService} from '../service/post.service';
import {CommentService} from '../service/comment.service';
import {IUser} from '../model/iuser';
import {IComment} from '../model/IComment';
import {NgForm} from '@angular/forms';
import {ILikePost} from '../model/ILikePost';
import {LikePostService} from '../service/like-post.service';
import {TokenStorageService} from '../service/signin-signup/token-storage.service';
import {LikeCommentService} from '../service/like-comment.service';
import {ILikeComment} from '../model/ILikeComment';

@Component({
  selector: 'app-comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.css']
})
export class CommentListComponent implements OnInit {

  constructor(private userService: UserService,
              private postService: PostService,
              private likeCommentService: LikeCommentService,
              private tokenStorage: TokenStorageService,
              private commentService: CommentService) { }

  ngOnInit(): void {
    this.getCommentList()
  }

  @Input() postId;
  commentList: IComment[];
  comment: IComment;

  getCommentList() {
    this.commentService.getCommentByPostId(this.postId).subscribe(
      commentList => {
        this.commentList = <IComment[]> commentList;
        for (let i = 0; i < this.commentList.length; i++) {
          this.userService.findUserById(this.commentList[i].commenterId).subscribe(
            res => {
              let commenter = <IUser> res;
              this.commentList[i].commenterName = commenter.userName;
              this.commentList[i].commenterAvatar = commenter.userAvatar;
            })
        }
      }
    )
  }

  deleteComment(commentId: number) {
    this.commentService.deleteComment(commentId).subscribe(
      res => this.getCommentList()
    )
  }

  addNewComment(value) {
    this.getCommentList();
  }

  likeComment = {
    id: null,
    commentId: null,
    likerId: null,
  };

  commentLiked: boolean = false;
  likedCommentList: ILikeComment[];

  likeAComment(i) {
    this.likeComment.commentId = this.commentList[i].commentId;
    this.likeComment.likerId = this.tokenStorage.getUser().id;
    this.likeCommentService.newLikeComment(this.likeComment).subscribe(
      res => {
        this.commentLiked = true;
        this.checkCommentLikedStatus(i);
      }
    );
  }

  unLikeAComment(j) {
    this.likeCommentService.findAllLikeComment().subscribe(
      res => {
        this.likedCommentList = <ILikeComment[]> res;
        for (let i = 0; i < this.likedCommentList.length; i++) {
          if (this.likedCommentList[i].likerId === this.tokenStorage.getUser().id && this.likedCommentList[i].commentId === this.commentList[j].commentId) {
            this.likeCommentService.unLikeAComment(this.likedCommentList[i].id).subscribe();
          }
        }
      }
    )
  }

  checkCommentLikedStatus(i) {
    // this.commentList[i].commentLike = 0;
    // this.commentLiked = false;
    // this.likeCommentService.findAllLikeComment().subscribe(
    //   res => {
    //     this.likedCommentList = <ILikeComment[]> res;
    //     for (let j = 0; j < this.likedCommentList.length; j++) {
    //       if (this.likedCommentList[j].commentId === this.commentList[i].commentId) {
    //         this.commentList[i].commentLike++;
    //         if (this.likedCommentList[j].likerId === this.tokenStorage.getUser().id) {
    //           this.commentLiked = true;
    //         }
    //       }
    //     }
    //   }
    // )
  }
}
