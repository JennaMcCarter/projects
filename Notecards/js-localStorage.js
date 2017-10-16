function setLocalStorage(key, value){
	if (typeof(Storage) !== "undefined") {
		//console.log("Code for localStorage/sessionStorage.");
		localStorage.setItem(key, value);
	} else {
		console.log("Sorry! No Web Storage support...");
	}
}


function getLocalStorage(key){
	if (typeof(Storage) !== "undefined") {
		return localStorage[key];
	} else {
		return null;
	}
}


function removeLocalStorage(key){
	if (typeof(Storage) !== "undefined") {
		localStorage.removeItem(key);
	} else {
		return null;
	}
}
