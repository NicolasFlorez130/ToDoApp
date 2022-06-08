window.addEventListener('load', function () {
    const emailInput = document.querySelector('#inputEmail'),
        pass1Input = document.querySelector('#inputPassword'),
        submitButton = document.querySelector('button'),
        form = document.querySelector('form'),
        emailCor = document.querySelector('#emailCorrector'),
        passCor = document.querySelector('#passCorrector');

    let email = false,
        pass = false,
        validator;

    async function login(user) {
        let advicer = document.querySelector('.errorNoticer');
        const response = await postApi(user, `${baseUrl}/users/login`);
        let data = await response.json();
        if (response.ok) {
            localStorage.setItem('jwt', data.jwt);
            window.location.href = "/ToDoApp/mis-tareas.html";
        } else {
            advicer.innerText = data;
            advicer.style.fontSize = '.8rem';
        }
    }

    function rectify(field, element, i) {
        if (i == 1) {
            !field ? element.style.cssText = 'font-size: .8rem;' : element.style.cssText = 'font-size: 0rem;';
        }
    }

    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        if (validator) {
            let user = {
                email: emailInput.value,
                password: pass1Input.value
            }
            login(user);
        }
    });

    let check = () => {
        validator = (email && pass);
        validator ? submitButton.removeAttribute('disabled') : 0;
    }

    ['focus', 'keyup', 'blur'].forEach((event, i) => {

        emailInput.addEventListener(event, function (e) {
            email = validateEmail(this.value);
            rectify(email, emailCor, i);
        });

        pass1Input.addEventListener(event, function (e) {
            pass = validatePass(this.value);
            rectify(pass, passCor, i);
        })

        submitButton.addEventListener('mouseover', () => check());

        document.querySelectorAll('input').forEach(input => input.addEventListener(event, () => check()));

    });
});