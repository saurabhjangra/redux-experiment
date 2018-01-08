/* 
* @Author: Saurabh Jangra
* @Date:   2017-09-06 
* @Last Modified by:   Saurabh Jangra
* @Last Modified time: 2017-09-06 04:40:21
*/

import enquiry from '../controllers/enquiry';
export default [
    { method: 'POST', path: '/enquiry', config: enquiry.addEnquiry },
];
