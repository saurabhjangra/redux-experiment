/* 
* @Author: Deepak Kumar Mishra
* @Date:   2016-10-15 
* @Last Modified by:   Deepak Kumar Mishra
* @Last Modified time: 2016-12-01 11:45:46
*/

export default {
	// see the plugin hapi-authorization, here is config to enable role based acl
	// roles available for users
	roles: ['ADMIN', 'USER', 'GUEST'],
	// enable hierachy, inherientance of user roles
	hierarchy: true,
	// lower index have higher access right
	roleHierarchy: ['ADMIN', 'USER', 'GUEST']
};
