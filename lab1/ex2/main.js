let btnFetch, btnAjax, tBody;
const SERVER = 'http://127.0.0.1:5500/ex2/students.json';

window.addEventListener('load', () => {
    btnAjax = document.getElementById('btnAjax');
    btnFetch = document.getElementById('btnFetch');
    tBody = document.getElementById('table-body');

    btnAjax.addEventListener('click', loadByAjax);
    btnFetch.addEventListener('click', loadByFetch);
});

function loadByAjax(){
    let xhr = new XMLHttpRequest();
    xhr.addEventListener('load', e => {
        if(xhr.readyState === 4 && xhr.status === 200){
            let json = xhr.response;
            let users = json.data;
            displayUsers(users);
            
        }
        else console.log(e);
    });
    xhr.open('GET', SERVER, true);
    xhr.responseType = 'json';
    xhr.send();
}

function loadByFetch(){
    fetch(SERVER)
        .then(kq => kq.json())
        .then(json => {
            let users = json.data;
            displayUsers(users);
        })
        .catch(e => console.log(e));
    
}

function displayUsers(users){
    tBody.innerHTML = '';

    users.forEach(u => {
        let tr = document.createElement('tr');
        let td1 = document.createElement('td');
        let td2 = document.createElement('td');
        let td3 = document.createElement('td');

        td1.innerHTML = u.id;
        td2.innerHTML = u.name;
        td3.innerHTML = u.age;

        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);

        tBody.appendChild(tr);
    });
}