/* 
* @Author: Deepak Kumar Mishra
* @Date:   2016-12-02 
* @Last Modified by:   Deepak Kumar Mishra
* @Last Modified time: 2016-12-03 12:10
*/

import viator from '../controllers/viator';
export default [	
	{method: 'GET', path: '/viator/update/destinations', config: viator.UpdateDestionations},	
	{method: 'GET', path: '/viator/update/product', config: viator.UpdateProduct},	
	{method: 'GET', path: '/viator/update/categories', config: viator.UpdateCategoriesByDestinationId},	
	{method: 'GET', path: '/viator/update/attraction', config: viator.UpdateAttractionDestinationId},	
	{method: 'GET', path: '/viator/update/detailbyproductcode', config: viator.UpdateDetailByProductCode},	
	{method: 'GET', path: '/viator/update/reviews', config: viator.UpdateReviewByCode},	
];
