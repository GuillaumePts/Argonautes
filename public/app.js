const input = document.querySelector('#name')
const button = document.querySelector('#button')
const liste = document.querySelector('#member-list')

fetch('/liste')
.then(res => res.json())
.then((datas) => {

datas.forEach(el => {

    let div = document.createElement('div')
    div.classList.add('member-item')
    div.textContent = el.name
    liste.appendChild(div)

});
})


function refreshListe(){

    while (liste.firstChild) {
        liste.removeChild(liste.firstChild);
    }

    fetch('/liste')
    .then(res => res.json())
    .then((datas) => {

    datas.forEach(el => {

        let div = document.createElement('div')
        div.classList.add('member-item')
        div.textContent = el.name
        liste.appendChild(div)

    });
})

}





button.addEventListener('click', ()=>{


    let name = input.value
    

    if (name === '') {
        document.querySelector('#errName').textContent = 'Veuillez renseigner un nom';
    } else if (name.lenght > 70) {
        document.querySelector('#errName').textContent = 'Nom non conforme (trop long)';
    } else if (name.match('<(|\/|[^\/>][^>]+|\/[^>][^>]+)>')) {
        document.querySelector('#errName').textContent = 'Nom non conforme ';
    } else if (name.match(/^[a-zA-Z]+$/)) {

        let verifName = name

        let obj = {
            name : verifName
        }
        
        fetch('/add', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(obj)
        })
        .then(res => res.json())
        .then((data) => {
            
            if(data == true){
                refreshListe()
                document.querySelector('#ok').textContent = 'Argonaute inscrit !'
            }else{
                document.querySelector('#errName').textContent = data
            }
            
                
            
        })
        .catch(err =>{
            console.log(err);
        })


    } else {
        document.querySelector('#errName').textContent = 'Nom non conforme';
    }


})