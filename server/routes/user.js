/* 
* @Author: Deepak Kumar Mishra
* @Date:   2016-10-15 
* @Last Modified by:   Deepak Kumar Mishra
* @Last Modified time: 2016-12-01 11:45:46
*/

import users from '../controllers/users';
export default [
	{method: 'POST', path: '/users/register', config: users.createOne},
	{method: 'GET', path: '/users/{userEmail}', config: users.readOne},
	{method: 'PUT', path: '/users/{userId}', config: users.updateOne},
	{method: 'DELETE', path: '/users/{userId}', config: users.deleteOne},
	{method: 'GET', path: '/users', config: users.read}
];
