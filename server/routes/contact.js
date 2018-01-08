/* 
* @Author: Saurabh Jangra
* @Date:   2017-09-06 
* @Last Modified by:   Saurabh Jangra
* @Last Modified time: 2017-09-06 04:40:21
*/

import contact from '../controllers/contact';
export default [
    { method: 'POST', path: '/contact', config: contact.addContact },
];
