const baseUrl = 'https://ctd-todo-api.herokuapp.com/v1';

async function postApi(json, url) {
    return fetch(url, {
        method: 'POST',
        body: JSON.stringify(json),
        headers: {
            'Content-Type': 'application/json',
        }
    })
}

async function postApiSu(json, url) {
    return fetch(url, {
        method: 'POST',
        body: JSON.stringify(json),
        headers: {
            'Content-Type': 'application/json',
            authorization: localStorage.getItem('jwt')
        }
    })
}

async function getApi(url) {
    return fetch(url, {
        method: 'GET',
        headers: {
            authorization: localStorage.getItem('jwt')
        }
    })
}

async function putApi(url, json, id) {
    return fetch(url, {
        method: 'PUT',
        body: JSON.stringify(json),
        headers: {
            'Content-Type': 'application/json',
            id: id,
            authorization: localStorage.getItem('jwt')
        }
    })
}

async function deleteApi(url, id) {
    return fetch(url, {
        method: 'DELETE',
        headers: {
            id: id,
            authorization: localStorage.getItem('jwt')
        }
    })
}

function validateString(string) {
    const regex = new RegExp(/^[a-zA-Z\u00C0-\u00FF]*$/);
    return regex.test(string) && string.length > 3;
}

function validateEmail(email) {
    const regex = new RegExp(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/);
    return regex.test(email);
}

function normalizarEmail(email) {
    return email.trim();
}

function validatePass(pass) {
    const noValid = '_-'.split('');
    let valid = true;

    noValid.forEach(char => {
        pass.includes(char) ? valid = false : 0;
    })

    return valid && pass.length > 3;

}

function passMatchChecker(pass1, pass2) {
    return pass1 === pass2;
}