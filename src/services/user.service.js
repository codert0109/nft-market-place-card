import jwt from "jwt-decode";


function deleteToken() {
	localStorage.removeItem('user');
}

export const getUser = () => {
	let token = localStorage.getItem('user');

	if(!token) {
		return null;
	}

	const user = jwt(token);

	// let currentDate = new Date();

	// if (user.exp * 1000 < currentDate.getTime()) {
	//     deleteToken();
	//     return null;
	// } 
	return user;
}

export const logout = () => {
	deleteToken();
}


