window.addEventListener('load', function () {
    const nameImput = document.querySelector('#inputNombre'),
        lastNameInput = document.querySelector('#inputApellido'),
        emailInput = document.querySelector('#inputEmail'),
        pass1Input = document.querySelector('#inputPassword'),
        pass2Input = document.querySelector('#inputPasswordRepetida'),
        submitButton = document.querySelector('button'),
        form = document.querySelector('form'),
        nameCor = document.querySelector('#nameCorrector'),
        lastCor = document.querySelector('#lastNameCorrector'),
        emailCor = document.querySelector('#emailCorrector'),
        passCor = document.querySelector('#passCorrector'),
        passRepeatCor = document.querySelector('#passRepeatCorrector');

    let name = false,
        lastName = false,
        email = false,
        pass = false,
        passMatch = false,
        validator;

    async function signUp(json) {
        let advicer = document.querySelector('.errorNoticer');
        const response = await postApi(json, `${baseUrl}/users`);
        let data = await response.json();
        if (response.ok) {
            window.location.href = "/ToDoApp/index.html";
        } else {
            advicer.innerText = data;
            advicer.style.fontSize = '.8rem';
        }
    }

    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        if (validator) {
            let user = {
                firstName: nameImput.value,
                lastName: lastNameInput.value,
                email: emailInput.value,
                password: pass1Input.value
            }
            signUp(user);
        }
    });

    function rectify(field, element, i) {
        if (i == 1) {
            !field ? element.style.cssText = 'font-size: .8rem;' : element.style.cssText = 'font-size: 0rem;';
        }
    }

    let check = () => {
        passMatch = passMatchChecker(pass1Input.value, pass2Input.value);
        validator = (name && lastName && email && pass && passMatch);
        validator ? submitButton.removeAttribute('disabled') : 0;
        !passMatch ? passRepeatCor.style.cssText = 'font-size: .8rem;' : passRepeatCor.style.cssText = 'font-size: 0rem;';
    }

    ['focus', 'keyup', 'blur'].forEach((event, i) => {
        nameImput.addEventListener(event, function (e) {
            name = validateString(this.value);
            rectify(name, nameCor, i);
        });

        lastNameInput.addEventListener(event, function (e) {
            lastName = validateString(this.value);
            rectify(lastName, lastCor, i);
        });

        emailInput.addEventListener(event, function (e) {
            email = validateEmail(this.value);
            rectify(email, emailCor, i);
        });

        pass1Input.addEventListener(event, function (e) {
            pass = validatePass(this.value);
            rectify(pass, passCor, i);
            rectify(passMatch, passRepeatCor, i);
        })

        pass2Input.addEventListener(event, function (e) {})

        submitButton.addEventListener('mouseover', () => check());

        document.querySelectorAll('input').forEach(input => input.addEventListener(event, () => check()));
    });
});