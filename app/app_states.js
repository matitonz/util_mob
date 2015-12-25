var app = utils.$app();

app.$createState('main', function (body) {

	// create container for state
	var div = document.createElement('div');
	div.setAttribute('style', '');

	var btn_one = app.$utils.$button('First Button', function () {
		alert('Dont use alert boxes!');
	});
	div.appendChild(btn_one);

	var brk = document.createElement('br');
	div.appendChild(brk);

	var btn_two = app.$utils.$button('Second Button', function () {
		alert('Ive already told you.\n Dont use alert boxes!');
	});
	div.appendChild(btn_two);

	brk = document.createElement('br');
	div.appendChild(brk);

	var btn_three = app.$utils.$button('Third Button', function () {
		app.$setState('second');
	});
	div.appendChild(btn_three);

	brk = document.createElement('br');
	div.appendChild(brk);

	body.appendChild(div);

});

app.$createState('second', function (body) {

	//fssfdsd
	var div = document.createElement('div');
	div.setAttribute('style', '');

	var btn_one = app.$utils.$button('Back Button', function () {
		app.$setState('main');
	});
	div.appendChild(btn_one);

	var brk = document.createElement('br');
	div.appendChild(brk);

	var btn_three = app.$utils.$button('Forward Button', function () {
		app.$setState('third');
	});
	div.appendChild(btn_three);

	body.appendChild(div);

});

app.$createState('third', function (body) {

	//fsdf
	var div = document.createElement('div');
	div.setAttribute('style', '');

	var btn_one = app.$utils.$button('Home Button', function () {
		app.$setState('main');
	});
	div.appendChild(btn_one);

	body.appendChild(div);

});