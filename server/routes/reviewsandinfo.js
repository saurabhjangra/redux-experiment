/* 
* @Author: Saurabh Jangra
* @Date:   2017-09-12
* @Last Modified by:   Saurabh Jangra
* @Last Modified time: 2017-09-12 04:47:21
*/

import reviews from '../controllers/reviewsandinfo';
export default [
    { method: 'GET', path: '/reviews', config: reviews.getAllReviews },
    { method: 'POST', path: '/reviews/create', config: reviews.addNewReview },
    { method: 'POST', path: '/reviews/comment', config: reviews.AddNewComment },
    { method: 'POST', path: '/reviews/article/views', config: reviews.AddReviewSeen },
    { method: 'POST', path: '/reviews/article/like', config: reviews.likeReview }
];
