/* 
* @Author: Deepak Kumar Mishra
* @Date:   2016-10-15 
* @Last Modified by:   Deepak Kumar Mishra
* @Last Modified time: 2016-11-22 18:13:46
*/
// babel-register is used to enable the later require module pre-complied with babel (so it can read import, export, async, await, decorator, etc)
require('babel-core/register');
// separate require the server. (we cannot use ES7 syntax inline with babel-register.)
require('./server/server');
