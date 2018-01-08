/* 
* @Author: Deepak Kumar Mishra
* @Date:   2016-12-02 
* @Last Modified by:   Deepak Kumar Mishra
* @Last Modified time: 2016-12-03 12:10
*/

import sightseeing from '../controllers/sightseeing';
export default [
	{ method: 'GET', path: '/sightseeing/autocomplete/{key}', config: sightseeing.Autocomplete },
	{ method: 'GET', path: '/sightseeing/search/{destinationId}', config: sightseeing.GetSearchResultByDestionId },
	{ method: 'GET', path: '/sightseeing/searchbyname/{destinationname}', config: sightseeing.GetSearchResultByDestionName },
	{ method: 'GET', path: '/sightseeing/getcategories/{destinationname}', config: sightseeing.GetCategoriesByDestionName },
	{ method: 'GET', path: '/sightseeing/productdetail/{productCode}', config: sightseeing.GetDetailByProductId },
	{ method: 'GET', path: '/sightseeing/product/reviews/{productCode}', config: sightseeing.GetProductReviewsByCode },
	{ method: 'GET', path: '/sightseeing/product/availability/{productCode}', config: sightseeing.GetProductAvailabilityDates },
	{ method: 'POST', path: '/sightseeing/product/availability/options/', config: sightseeing.GetProductOptions },
	{ method: 'POST', path: '/sightseeing/booking/book/', config: sightseeing.BookSightseeing },
	{ method: 'GET', path: '/sightseeing/destination/attractions/', config: sightseeing.GetSightseeingAttractions }
];
