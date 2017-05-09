window.onload =  function() {
	const goingButtons = Array.from(document.getElementsByClassName('goingDisplay'));
	console.log('loaded');
	goingButtons.forEach(button => {
		//button.setAttribute('onclick', 'indicateGoing()')
		button.addEventListener('click', indicateGoing);
	})
};

function indicateGoing(e) {
	// isAuthenticated is passed down from express route to pug to this file
	if(!isAuthenticated) {
		console.log('not authenticated');
		return;
	}
	// find another way to do this.
	const phone = stripPhoneNumber(e.target.parentNode.getElementsByClassName('phoneNumber')[0].innerHTML);
	const name = e.target.parentNode.getElementsByClassName('barName')[0].innerHTML;
	const xhr = new XMLHttpRequest();
	const params = JSON.stringify({phone, name, user});

	xhr.open('POST', '/api/bars/indicateGoing');
	xhr.setRequestHeader("Content-type", "application/json; charset=utf-8");

	xhr.onload = function (e) {
		if (xhr.readyState === 4) {
			if (xhr.status === 200) {
				console.log(xhr.response);
			} else {
				console.error(xhr.statusText);
			}
		}
	};

	xhr.onerror = function (e) {
		console.error(xhr.statusText);
	};
	xhr.send(params);
}

function stripPhoneNumber(phoneNumber) {
	return phoneNumber.match(/\d+/g).join('');
}

