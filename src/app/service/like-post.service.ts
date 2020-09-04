import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LikePostService {

  private API_URL = 'http://localhost:8080/like/post/'

  constructor(private http: HttpClient) { }

  newLikePost(likePost) {
    return this.http.post(this.API_URL + 'create', likePost)
  }

  findAllLikePost() {
    return this.http.get(this.API_URL)
  }

  unLikeAPost(id) {
    return this.http.delete(this.API_URL + 'delete/' + id)
  }
}
