const ws = require('nodejs-websocket');// 引入ws模块
const fs = require('fs'); // 引入fs模块
require('shelljs/global');
console.log('开始建立连接...');
fs.mkdir('./servers', function (error) {

});
fs.exists('./servers/servers.json', function (exists) {
	if (!exists) {
		// do something 
		fs.writeFile('./servers/servers.json', "{}", function (err) {
			if (err) {
				throw err;
			}
		});
	}
});
const server = ws.createServer(function (conn) {
	conn.on('text', function (str) {
		// 写入文件内容（如果文件不存在会创建一个文件）
		fs.writeFile('./servers/servers.json', str, function (err) {
			if (err) {
				throw err;
			} else {
				// Async call to exec()
				//将文件夹加入版本管理svn add servers
				//提交文件夹'svn commit -m "" -N --no-unlock servers'
				//提交文件夹下的指定文件'svn commit -m "" -N --no-unlock .\\servers\\servers.json';
				var cmd = 'svn commit -m "" -N --no-unlock .\\servers.\\servers.json';
				exec(cmd, function (status, output) {
					//console.log('Exit status:', status);
					//console.log('Program output:', output);
					//SVN自动提交，提交后返回修改
					conn.send("修改成功");
				});
			}
		});
	});
	conn.on('close', function (code, reason) {
		console.log('关闭连接');
	});
	conn.on('error', function (code, reason) {
		console.log('异常关闭');
	});
}).listen(777);
console.log('777WebSocket建立完毕');