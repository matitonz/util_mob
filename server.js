const http = require('http');
const fs = require('fs');
const url = require('url');

const hostname = '127.0.0.1';
const port = 1337;

function readStaticFile(fileName, res) {

	fs.readFile(fileName, function (err, data) {
		console.log(fileName);
		if (err) { 
			return console.log('Error reading file: ' + JSON.stringify(err));
			res.writeHead(404, { 'Content-Type': 'text/html' });
			res.end('File Not Found');
		}

		res.setHeader('AppId', '123456');
		// res.writeHead(200, { 'Content-Type': 'text/html' });
		res.writeHead(200, {});
		res.end(data);
	});

}

http.createServer((req, res) => {
	
	var parts = url.parse(req.url);

	if (req.method == 'GET') {
		if (parts.pathname == '/') {
			readStaticFile('./app/home.html', res);
		}
		else {
			readStaticFile('.' + parts.pathname, res);
		}
	}
	else if (req.method == 'POST') {
		res.setHeader('AppId', '123456');
		res.writeHead(200, { 'Content-Type': 'text/json' });
		res.end(JSON.stringify({
			'Test': 'Hello from Node.js',
			'Two': 'Hello again from Node'
		}));
	}

}).listen(port, hostname, () => {

	console.log(`Server running at http://${hostname}:${port}/`);

});
