(function (window) {
	'use strict'

	const TOAST_ID = 'utils-toast-outer-div';
	const OVERLAY_ID = 'utils-progress-overlay-div';
	const SPINNER_ID = 'utils-progress-spinner-div';
	const SPINNER_SRC = './loading.gif';

	function remove_toast() {
		var toast_div = document.getElementById(TOAST_ID);
		var body = document.getElementsByTagName('body')[0];
		body.removeChild(toast_div);
	}

	function toast(text, time_interval) {
		// make sure we have text to work with
		if (!text) { return; }

		// set default for time_interval
		if (!time_interval || parseInt(time_interval, 10) < 0 || parseInt(time_interval, 10) > 10000) {
			var time_interval = 2500;	// two and a half secs
		}

		// get body element
		var body = document.getElementsByTagName('body')[0];

		// set size vars
		var window_height = window.innerHeight;
		var window_width = window.innerWidth;
		var toast_width = 300;
		var toast_height = 50;

		// create containing div
		var outer_div = document.createElement('div');
		outer_div.setAttribute('id', TOAST_ID);
		outer_div.setAttribute('style',
			'background-color:#333; position:absolute; opacity:0.6; padding:0; z-index:2000;' +
			'width:' + toast_width + 'px;' +
			'top:' + (window_height - toast_height - 50) + 'px; ' +
			'left:' + Math.round((window_width / 2) - (toast_width / 2)) + 'px;' +
			'border-radius: 15px; text-align:center;'
			);

		// create toast inner
		var toast_text = document.createElement('p');
		toast_text.setAttribute('style', 'color:#ffffff; margin: 0.6em; font-family:Arial;');
		toast_text.textContent = text;

		console.log(toast_text.width);
		console.log(toast_text.height);

		// append elements to body
		outer_div.appendChild(toast_text);
		body.appendChild(outer_div);

		// set timer to remove after specified time delay
		window.setTimeout(function () {
			remove_toast();
		}, time_interval);

	}

	var progress_state = false;

	function start_progress() {
		// if progress is already running - prevent duplicate
		if (progress_state) { return; }

		// get enviroment
		var window_height = window.innerHeight;
		var window_width = window.innerWidth;

		// get body element
		var body = document.getElementsByTagName('body')[0];

		// create overlay for screen
		var overlay = document.createElement('div');
		overlay.setAttribute('id', OVERLAY_ID);
		overlay.setAttribute('style',
			'background-color:#222; position:absolute; opacity:0.3; padding:0; z-index:1000; top:0; left:0; text-align:center;' +
			'height:' + window_height + 'px;' + 'width:' + window_width + 'px;'
			);
		body.appendChild(overlay);

		var spinner_gif = document.createElement('img');
		spinner_gif.setAttribute('id', SPINNER_ID);
		spinner_gif.setAttribute('src', SPINNER_SRC);
		spinner_gif.setAttribute('style',
			'position:absolute; z-index:1200; height:64px; width:64px; ' +
			'top:' + Math.round((window_height / 2) - 32) + 'px;' + 'left:' + Math.round((window_width / 2) - 32) + 'px;'
			);
		body.appendChild(spinner_gif);

		progress_state = true;
	}

	function stop_progress() {
		// test we are running
		if (!progress_state) { return; }
		
		var spinner_gif = document.getElementById(SPINNER_ID);
		var overlay_div = document.getElementById(OVERLAY_ID);
		var body = document.getElementsByTagName('body')[0];
		body.removeChild(spinner_gif);
		body.removeChild(overlay_div);

		console.log('progress stopped');
		progress_state = false;
	}

	function is_progress_running() {
		return progress_state;
	}

	var api = window.utils = {};

	// export external api's
	// api.$app = {};
	// api.$get = http_get_util;
	// api.$post = http_post_util;
	api.$toast = toast;
	api.$progress = function () {
		return { start: start_progress, stop: stop_progress, running: is_progress_running };
	};
	api.$button = {};
	api.$dropdown = {};

}(window));