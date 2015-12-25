var app = utils.$app();

app.$init(function (body) {

	// put stuff here to bootstrap the app

	// show loading image
	var spinner = app.$utils.$progress();
	spinner.start();

	// draw stuff behind it
	var ugly_div = document.createElement('div');
	ugly_div.setAttribute('style', 'background-color: #dc6; height:100px; width: 100px;');
	body.appendChild(ugly_div);

	// make call to backend and load data
	app.$utils.$post('http://127.0.0.1:1337',
		{},
		function (status, response, headers, statusText) {

		if (status > 0) {
			// use response data
			console.log('Response: ' + response);

			

			window.setTimeout(function () {

				// set to main state
				spinner.stop();
				app.$setState('main');

				app.$utils.$toast('Application loaded.');
			}, 5000);
		}

		// now tell EVERYONE!
		app.$emit('app-loaded', status);
	});

	// once data loaded - pull down loading stuff
	app.$on('app-loaded', function (data) {
		
		if (data < 0) {
			spinner.stop();

			window.setTimeout(function () {
				app.$utils.$toast('Failed to load application resources. Please close and try again.');
			}, 100);
		}

	});

});