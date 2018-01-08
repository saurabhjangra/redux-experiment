/* 
* @Author: Deepak Kumar Mishra
* @Date:   2016-10-15 
* @Last Modified by:   Deepak Kumar Mishra
* @Last Modified time: 2016-12-01 11:45:46
*/

import auth from '../controllers/auth';
export default [
	{method: 'POST', path: '/login', config: auth.login},
	{method: 'POST', path: '/logout', config: auth.logout}
];
