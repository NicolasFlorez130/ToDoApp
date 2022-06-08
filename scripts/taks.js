localStorage.getItem('jwt') ? 0 : window.location.href = "/index.html";

window.addEventListener('load', async function () {

    await getUserData();
    document.querySelector('.preloader').style.opacity = '0';
    setTimeout(() => {
        document.querySelector('.preloader').style.display = 'none';
    }, 400);

    const btnCerrarSesion = document.querySelector('#closeApp'),
        formCrearTarea = document.querySelector('.nueva-tarea');

    btnCerrarSesion.addEventListener('click', function () {
        localStorage.clear();
        window.location.href = "/ToDoApp/index.html";
    });

    formCrearTarea.addEventListener('submit', function (e) {
        e.preventDefault();
        let value = document.querySelector('#nuevaTarea').value;
        value = value.trim();
        if (value.length > 0) {
            createTask(value, false);
            getUserData()
        }
        this.reset();
    });

    async function getUserData() {
        let response = await getApi(`${baseUrl}/users/getMe`);
        const userData = await response.json();

        document.querySelector('#userName').innerText = `${userData.firstName} ${userData.lastName}`

        response = await getApi(`${baseUrl}/tasks`);
        const userTasks = await response.json();

        ['terminadas', 'pendientes'].forEach(word => document.querySelector(`.tareas-${word}`).innerHTML = '');

        userTasks.forEach(task => {

            const tarea = document.createElement('li');

            if (!task.completed) {

                tarea.innerHTML = `<button class="change" id="${task.id}">
                                    <i class="fa-regular fa-circle"></i></button>
                                   <div class="descripcion">
                                    <p class="nombre"></p>
                                    <p class="timestamp">${task.createdAt.slice(0, 10).replaceAll('-', '/')}</p>
                                   </div>`

            } else {

                tarea.innerHTML = `<div class="hecha">
                                    <i class="fa-regular fa-circle-check"></i>
                                   </div>
                                    <div class="descripcion">
                                     <p class="nombre"></p>
                                     <div class="cambios-estados">
                                      <button class="change incompleta" id="${task.id}"><i class="fa-solid fa-rotate-left"></i></button>
                                      <button class="borrar" id="${task.id}"><i class="fa-regular fa-trash-can"></i></button>
                                     </div>
                                    </div>`
            }

            tarea.childNodes[2].childNodes[1].innerText = task.description;
            tarea.className = 'tarea';
            
            document.querySelector(`.tareas-${task.completed ? 'terminadas' : 'pendientes'}`).appendChild(tarea);
        });

        document.querySelector('#cantidad-finalizadas').innerText = document.querySelectorAll('.tareas-terminadas .tarea').length;

        document.querySelectorAll('.change').forEach(async function (button) {
            button.addEventListener('click', async function () {
                let json;
                if (button.classList.contains('incompleta')) {
                    json = {
                        description: button.parentNode.parentNode.childNodes[1].innerText,
                        completed: false
                    }

                    button.parentNode.parentNode.childNodes[1].innerText = 'Restaurando...'
                } else {

                    json = {
                        description: button.nextElementSibling.childNodes[1].innerText,
                        completed: true
                    }

                    button.nextElementSibling.childNodes[1].innerText = 'Archivando...'
                }

                await editTask(json, button.id);
                getUserData();
            });
        })

        document.querySelectorAll('.borrar').forEach(async function (button) {
            button.addEventListener('click', async function () {
                button.parentNode.parentNode.childNodes[1].innerText = 'Eliminando...'
                await deleteTask(button.id);
                getUserData();
            })
        })
    }

    async function editTask(json, id) {
        const response = await putApi(`${baseUrl}/tasks/${id}`, json, id);
        const data = await response.json();
        return data;
    }

    async function createTask(desc, done) {
        const response = await postApiSu({
            "description": desc,
            "completed": done
        }, `${baseUrl}/tasks`)
        const data = await response.json();
    }

    async function deleteTask(id) {
        const response = await deleteApi(`${baseUrl}/tasks/${id}`, id),
            data = await response.json();
    }

    let count = 0;
    setInterval(() => {
        count == 60 ? getUserData() : 0;
        count++;
    }, 1000);

});