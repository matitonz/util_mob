(function (window) {
	'use strict'

	const TOAST_ID = 'utils-toast-outer';
	const OVERLAY_ID = 'utils-progress-overlay';
	const SPINNER_ID = 'utils-progress-spinner';
	const SPINNER_SRC = './lib/loading.gif';

	var app = {};


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
		
		if (spinner_gif) {
			body.removeChild(spinner_gif);
		}
		if (overlay_div) {
			body.removeChild(overlay_div);
		}

		console.log('progress stopped');
		progress_state = false;
	}

	function is_progress_running() {
		return progress_state;
	}


	var default_xhr_headers = {
		'X-Human': 'Hello human. You should work for us.'
		//'Access-Control-Allow-Origin': '*'
	};

	function http_xhr_util(method, data, url, callback, headers) {

		// validate the url and callback
		if (!url || typeof url !== 'string') { return false; }
		if (!callback || typeof callback !== 'function') { return false; }

		// get object
		var xhr = new window.XMLHttpRequest();

		xhr.open(method, url, true);
		xhr.timeout = 20000; 			// 20 sec timeout

		// set default headers
		for (var d in default_xhr_headers) {
			xhr.setRequestHeader(d, String(default_xhr_headers[d]));
		}

		// set headers from header object
		if (headers && typeof headers === 'Object') {
			for (var h in headers) {
				if (headers[h] !== undefined) {
					xhr.setRequestHeader(h, String(headers[h]));
				}
			}
		}

		xhr.onload = function requestLoaded() {
			var statusText = xhr.statusText || '';
			var response = xhr.responseText || xhr.response;
			var status = xhr.status;
			var headers = xhr.getAllResponseHeaders();
			if (headers) {
				headers = headers.split('\r');
			}

			// complete request
			callback(status, response, headers, statusText);
		}

		function requestError() {
			callback(-1, null, null, '');
		}

		xhr.ontimeout = requestError;
		xhr.onerror = requestError;
		xhr.onabort = requestError;

		xhr.send(data);
	}

	function http_get_util(url, callback, headers) {
		http_xhr_util('GET', null, url, function (status, response, headers, statusText) {
			// parse JSON for client
			if (status > 0) {
				var response = JSON.parse(response);
			}
			callback(status, response, headers, statusText);
		}, headers);
	}

	function http_post_util(url, post_object, callback, headers) {
		if (!post_object || typeof post_object !== 'object') { return false; }
		var data = JSON.stringify(post_object);
		http_xhr_util('POST', data, url, function (status, response, headers, statusText) {
			// parse JSON for client
			if (status > 0) {
				var response = JSON.parse(response);
			}
			callback(status, response, headers, statusText);
		}, headers);
	}

	function get_button_fragment(label, on_click, css) {
		if (!label || typeof label !== 'string') { return false; }
		if (!on_click || typeof on_click !== 'function') { return false; }

		var button = document.createElement('button');
		button.setAttribute('class', 'btn btn-primary');
		button.innerText = label;

		// if we have custom css - add it
		if (css) {
			switch (typeof css) {
				case 'string':
					// easy version - insert style string
					button.setAttribute('style', css);
					break;
				case 'object':
					// object version
					var css_string = '';
					for (var key in css) {
						css_string += key + ':' + css[key] + '; ';
					}
					button.setAttribute('style', css_string);
					break;
				default:
					break;
			}
		}

		// attach our function for onclick event
		button.addEventListener('click', on_click, false);

		// return button for insert
		return button;
	}

	function set_init_function(fun) {
		if (!fun || typeof fun != 'function') { throw new Error('Initialization function must be a function.'); }

		window.onload = function () {
			// get body ref
			var body = document.getElementsByTagName('body')[0];
			fun(body);
		};
	}

	var event_listener_object = {};

	function add_event_listner(e, fun) {
		if (!e || typeof e !== 'string') { throw new Error('Event name must be a string.'); }
		if (fun === undefined) { throw new Error('Please define an event listener.'); }

		// are we wiping the namespace clean
		if (fun === null) {
			event_listener_object[e] = [];
		}

		if (typeof fun == 'function') {
			if (typeof event_listener_object[e] != 'Array') {
				event_listener_object[e] = [];
			}
			event_listener_object[e].push(fun);
		}
	}

	function emit_event(e, event_object) {
		if (!e || typeof e !== 'string') { console.log('Event name must be a string.'); return false; }

		if (typeof event_listener_object[e] != 'Array') {
			for (var i = 0; i < event_listener_object[e].length; i++) {
				var fun = event_listener_object[e][i];
				fun(event_object);
			}
		}
	}


	var application_states = {};
	var current_application_state = null;

	function get_application_state() {
		return current_application_state;
	}

	function set_application_state(state_name) {
		if (typeof application_states[state_name] == 'function') {
			var body = document.getElementsByTagName('body')[0];
			body.innerHTML = '';
			application_states[state_name](body);
		}
		else {
			return false;
		}
	}

	function create_application_state(state_name, state_function) {
		if (!state_name || typeof state_name !== 'string') { throw new Error('State name must be a string.'); }
		if (!state_function || typeof state_function != 'function') { throw new Error('State function must be a function.'); }

		application_states[state_name] = state_function;
		return true;
	}

	// setup functions to be expoted with app object

	// work functions
	app.$init = set_init_function;			// (init_function)
	// app.$service = add_service_function;	// (function)						*** think more about this before adding it ***
	// events
	app.$on = add_event_listner;			// (event_name, listener_function) - ***if null is passed it will reset the event namespace***
	app.$emit = emit_event;					// (event_name, event_obj)
	// state controllers
	app.$getState = get_application_state;
	app.$setState = set_application_state;
	app.$createState = create_application_state;

	// attach object to window
	var utils = window.utils = {};

	// export external api's
	utils.$app = function () {		// $app -> $init, $service, $events, $emit, $on, $state [obj -> $getState, $setState, $createState]
		return app;
	};
	utils.$get = http_get_util;		// (url, callback, headers[opt])
	utils.$post = http_post_util;		// (url, post_object, callback, headers[opt])
	utils.$toast = toast;				// (message, timeout[opt])
	utils.$progress = function () { return { start: start_progress, stop: stop_progress, running: is_progress_running }; };
	utils.$button = get_button_fragment;	// (label, onclick_function, css[opt])
	utils.$dropdown = function () {alert('Dropdowns are not setup yet.');};

	// good idea ???
	app.$utils = utils;

}(window));