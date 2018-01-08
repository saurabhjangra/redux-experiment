/* 
* @Author: Deepak Kumar Mishra
* @Date:   2016-10-15 
* @Last Modified by:   Deepak Kumar Mishra
* @Last Modified time: 2016-12-01 11:45:46
*/

import hotel from '../controllers/hotel';
export default [
    { method: 'GET', path: '/airport', config: hotel.getAirport },
    { method: 'GET', path: '/hotel/gethotelcity/{city}', config: hotel.getHotelCity },
    { method: 'GET', path: '/hotel/hotelsearch/{city}', config: hotel.getHotelSearch }

];
