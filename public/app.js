// élément html mis en variable
const input = document.querySelector('#name')
const button = document.querySelector('#button')
const liste = document.querySelector('#member-list')


// Au chargement du site on lance un fetch qui récupère la liste des Argonautes déja inscrit
// et on les affiches 
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

// Fonction qui permet de mettre à jour la liste des Argonautes lorsqu'on
// inscrit un autre Argonaute
function refreshListe(){

    document.querySelector('#errName').textContent = ''
    document.querySelector('#ok').textContent = ''
    input.value = ''

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




// Bouton "envoyé" mis en écoute
button.addEventListener('click', ()=>{

    // on met dans une variable le contenu de l'input 
    let name = input.value
    

    // gestion des erreurs 
    if (name === '') {
        document.querySelector('#errName').textContent = 'Veuillez renseigner un nom';
    } else if (name.lenght > 70) {
        document.querySelector('#errName').textContent = 'Nom non conforme (trop long)';
    } else if (name.match('<(|\/|[^\/>][^>]+|\/[^>][^>]+)>')) {
        document.querySelector('#errName').textContent = 'Nom non conforme ';
    } else if (name.match(/^[a-zA-Z]+$/)) {


        //Une fois vérifié si c'est bon on utilise fetch en POST pour envoyer les données au Backend 
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
            
            // gestion de la promesse
            if(data == true){
                refreshListe()
                document.querySelector('#ok').textContent = 'Argonaute inscrit !'
                setTimeout(() => {
                    document.querySelector('#ok').textContent = ''
                }, 2000);
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