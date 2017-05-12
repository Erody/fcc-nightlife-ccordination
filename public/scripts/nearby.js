window.onload =  function() {
	const goingButtons = Array.from(document.getElementsByClassName('goingButton'));
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
	const phone = stripPhoneNumber(e.target.parentElement.getElementsByClassName('phoneNumber')[0].innerHTML);
	const name = e.target.parentNode.getElementsByClassName('barName')[0].innerHTML;
	const xhr = new XMLHttpRequest();
	const params = JSON.stringify({phone, name, user});

	xhr.open('POST', '/api/bars/indicateGoing');
	xhr.setRequestHeader("Content-type", "application/json; charset=utf-8");

	xhr.onload = function (event) {
		if (xhr.readyState === 4) {
			if (xhr.status === 200) {
				const status = JSON.parse(xhr.response).status;
				updateCount(e, status);
				updateVisuals(e, status);
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

function updateCount(e, status) {
	// immediately increment or decrement count by 1
	let goingAmount = e.target.parentElement.parentElement.getElementsByClassName('goingAmount')[0];
	let count = Number(goingAmount.innerHTML.split(' ')[0]);
	if(status === 'added') {
		count++;
	} else {
		count--;
	}
	goingAmount.innerHTML = `${count} going to this bar`;
}

function updateVisuals(e, status) {
	// add visual information
	e.target.classList.toggle('btn-success');
	if(status === 'added') {
		e.target.innerHTML = 'You are going to this bar';
	} else {
		e.target.innerHTML = 'Indicate you are going to this bar'
	}
}

