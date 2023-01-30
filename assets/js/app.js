class CreateItem{
    constructor(nome, email, hobby, trabalho){
        this.nome=nome
        this.email=email
        this.hobby=hobby
        this.trabalho=trabalho
    }

    validateCrud=()=>{
        for(let i in this){
            if(this[i] == undefined || this[i] == '' || this[i]==null){ // Verificar se tem algum campo em branco
                return false
            }
        }
        return true
    }
}

class BDCrud{
    constructor(){
        let id = localStorage.getItem('id')
        if(id == null || id == NaN){ // Trocar id de null para 0
            localStorage.setItem('id', 0)
        }
    }

    getNextID=()=>{ // Get next id in local storage
        let nextId = localStorage.getItem('id')
        return parseInt(nextId) + 1
    }

    recordData=(rec)=>{ // Record data
        let id = this.getNextID() // Get ID
        localStorage.setItem(`${id}`,JSON.stringify(rec)) // Form object with ID
        localStorage.setItem('id', id) // Set id
    }

    recoverData=()=>{ // Recover data
        let datas = [] // Array datas
        let id = localStorage.getItem('id') // Get id
        for(let x = 0; x <= id;x++){
            let data = JSON.parse(localStorage.getItem(x)) // View object
            if(data == null){
                continue
            }else{
                data.id=x // Set id in objects
                datas.push(data)
            }
        }
        return datas
    }

    searchData=(data)=>{ // Search data
        let datasFilt = []
        datasFilt = this.recoverData()
        // Filt
        for(let obj in data){
            if(data[obj] != ''){
                datasFilt=datasFilt.filter(d => d[obj] == data[obj])
            }
        }
        return datasFilt
    }

    removeData=(id)=>{ // Remove data 
        localStorage.removeItem(id)
    }
}

let bdCrud = new BDCrud()

let criarItem = ()=>{ // Criar novo dado
    modalCreated()
    $('#modalItem .modal-title').text('Criar novo dado') // Trocar texto
    $('#modalItem .buttonSave').on('click', ()=>{
        let nome = document.querySelector('#nameUser').value // Pegar valores do inputs
        let email = document.querySelector('#emailUser').value
        let hobby = document.querySelector('#hobbyUser').value
        let trabalho = document.querySelector('#trabalhoUser').value


        let dataCreate = new CreateItem(nome, email, hobby, trabalho) // Enviar para a classe CreateItem
        
        if(dataCreate.validateCrud()){ // Verificar se está validado corretamente
            modalSuccess()
            bdCrud.recordData(dataCreate)
            console.log(dataCreate.validateCrud())
        }else{
            modalDanger()
            console.log(dataCreate.validateCrud())
        }
    })
}

let excluirItems =()=>{
    removeItem()
    $('#modalItem .modal-title').text('Remover todos dados')
    $('#modalItem .buttonSave').on('click', ()=>{
        modalLoading()
        $('#modalItem .modal-body h3').text('Removendo todos dados')
        setTimeout(()=>{
            localStorage.clear()
            window.location.reload()
        },3500)
    })
}

let line = document.querySelector('.tableBody')
let loadData = ()=>{
    let datas = []
    datas = bdCrud.recoverData()


    datas.forEach((d)=>{
        let lineData = line.insertRow() // Criar linha (TR)
        for(let i = 0; i <= 5;i++){
            if(i==0){
                lineData.insertCell(i).innerHTML=`${d.id}` // Na coluna 0 insere o id
            }else if(i==1){
                lineData.insertCell(i).innerHTML=`${d.nome}` // Na coluna 1 insere o nome
            }else if(i==2){
                lineData.insertCell(i).innerHTML=`${d.email}` // Na coluna 2 insere o email
            }else if(i==3){
                lineData.insertCell(i).innerHTML=`${d.hobby}` // Na coluna 3 insere o hobby
            }else if(i==4){
                lineData.insertCell(i).innerHTML=`${d.trabalho}` // Na coluna 4 insere o trabalho
            }else if(i==5){
                let divButtons = document.createElement('div') // Criar div com a class row
                divButtons.className='row justify-content-around'

                let divButtonEdit = document.createElement('div')
                divButtonEdit.className='col-sm-4' // Div com a class col-sm-4
                let buttonEdit = document.createElement('button') // Criar botão
                buttonEdit.className='btn btn-warning text-white' // Class botões

                let divButtonRemove = document.createElement('div') // Criar div para ajustar os dois botões
                divButtonRemove.className='col-sm-4' // Div com a class col-sm-4
                let buttonRemove = document.createElement('button') // Criar botão
                buttonRemove.className="btn btn-danger text-white" // Class para botões

                divButtonRemove.appendChild(buttonEdit) // Adicionar botão na div
                divButtonEdit.appendChild(buttonRemove) // Adicionar botão na div
                divButtons.appendChild(divButtonRemove) // Adicionar div 
                divButtons.appendChild(divButtonEdit) // Adicionar div

                buttonEdit.innerHTML='<i class="fa-solid fa-pen"></i>' // Adiiconar icon
                buttonRemove.innerHTML='<i class="fa-solid fa-trash"></i>' // Adicionar icon

                buttonRemove.id=`dataItem${d.id}`
                buttonRemove.onclick=()=>{
                    removeItem()
                    $('#modalItem .buttonSave').on('click',()=>{
                        let id = buttonRemove.id.replace('dataItem','')
                        bdCrud.removeData(id)
                        modalLoading()
                        setTimeout(()=>{
                            window.location.reload()
                        },3300)
                    })
                }

                buttonEdit.id=`dataItem${d.id}`
                buttonEdit.onclick=()=>{
                    editItem()
                }
                lineData.insertCell(i).append(divButtons) // Mostrar botão

            }
        }  
    })
    $('.tableBody tr').addClass('row align-items-center') // Classe para posicionar verticalmente os dados
    $('.tableBody td').addClass('col-sm-2')
}

let modalCreated = ()=>{ // Modal created
    $('#modalItem .modal-title').removeClass('text-uppercase') // Remover class uppercase
    $('#modalItem .modal-content').removeClass('bg-danger text-white bg-transparent') // Remover classes
    $('#modalItem .buttonClose').removeClass('bg-white text-dark') // Mudar cor do button
    

    $('#modalItem .modal-content').addClass('bg-white text-dark')

    $('#modalItem .modal-body h4').remove()
    $('#modalItem .modal-body .spinner-border').remove() // Remover spinner
    $('#modalItem .modal-body .text-danger').remove() // Remover texto "carregando"
    $('#modalItem .modal-body .text-success').remove() // Remover texto "carregando"
    $('#modalItem .modal-body h2.textAviso').remove() // Remover texto "insira os dados"
    $('#modalItem .btn-close').remove() // Remove button close
    $('#modalItem .modal-body .inputsGroup').remove() // Remove all inputs

    $('#modalItem').modal('show') // Editar modal
    createInputs() // Criar os inputs dinamicamente

    $('#modalItem .modal-header').show()
    $('#modalItem .modal-footer').show() // Mostrar botões

    // Buttons show
    $('#modalItem .buttonSave').show()
    $('#modalItem .buttonClose').show()

    // Button Close Format
    $('#modalItem .buttonClose').removeClass('btn-secondary')
    $('#modalItem .buttonClose').addClass('btn-danger')
    $('#modalItem .buttonClose').text('Cancelar')

    // Button save changes Format
    $('#modalItem .buttonSave').removeClass('btn-primary')
    $('#modalItem .buttonSave').addClass('btn-success')
    $('#modalItem .buttonSave').text('Salvar')
    $('#modalItem .buttonSave').on('click', ()=>{
        // Save in BD
    })
}

let createInputs = ()=>{ // Create inputs
    $('#modalItem .modal-body').append(`<div class="container inputsGroup"></div>`)
    for(let i = 0; i <= 4; i++){
        if(i == 1){
            $('#modalItem .modal-body .inputsGroup').append(`<div class="input-group"><span class="input-group-text" id="inputGroup-sizing-default">Nome</span><input type="text" class="form-control" id="nameUser" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default"</div>`)
        }else if(i==2){
            $('#modalItem .modal-body .inputsGroup').append(`<div class="input-group"><span class="input-group-text" id="inputGroup-sizing-default">E-Mail</span><input type="text" class="form-control" id="emailUser" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default"></div>`)
        }else if(i==3){
            $('#modalItem .modal-body .inputsGroup').append(`<div class="input-group"><span class="input-group-text" id="inputGroup-sizing-default">Hobby</span><input type="text" class="form-control" id="hobbyUser" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default"></div>`)
        }else if(i==4){
            $('#modalItem .modal-body .inputsGroup').append(`<div class="input-group"><span class="input-group-text" id="inputGroup-sizing-default">Trabalho</span><input type="text" class="form-control" id="trabalhoUser" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default"></div>`)
        }
    }
}

let editItem = ()=>{ // Edit item 
    modalCreated()
    $('#modalItem .modal-title').text('Editar dados') // Trocar texto
    $('#modalItem .buttonSave').on('click', ()=>{
        alert('Em desenvolvimento')
    })
}

let removeItem = ()=>{ // Remove item
    modalCreated()
    $('#modalItem .modal-body .inputsGroup').remove()
    $('#modalItem .modal-body').append('<h4>Você tem certeza disso?</h4>')
    $('#modalItem .modal-title').text('Excluir dados')
    $('#modalItem .buttonSave').text('Confirmar')
}

let modalLoading = ()=>{ // Modal Loading
    modalCreated()
    $('#modalItem .modal-body .inputsGroup').remove()
    $('#modalItem .modal-header').hide()
    $('#modalItem .modal-footer').hide() // Esconder botões
    $('#modalItem .modal-content').removeClass('bg-white')
    $('#modalItem .modal-content').addClass('bg-transparent')
    $('#modalItem .modal-body').append(`<div class="spinner-border text-danger" role="status"></div><h3 class="text-danger m-2 text-center">Removendo dados</h3>`) // Criar spinner
}

let modalSuccess = ()=>{ // Modal sucesso
    modalLoading()
    $('#modalItem .modal-body .text-danger').remove()
    $('#modalItem .modal-body').append(`<div class="spinner-border textAviso text-success" role="status"></div><h3 class="text-success m-2 text-center">Inserindo dados no sistema</h3>`) // Criar spinner
    setTimeout(()=>{
        window.location.reload()
    },4000)
}

let modalDanger = ()=>{ // Modal erro
    modalCreated()
    $('#modalItem .modal-body .inputsGroup').remove()
    $('#modalItem .modal-title').addClass('text-uppercase') // Adicionar classe uppercase
    $('#modalItem .modal-title').text('Erro')
    $('#modalItem .modal-body').append('<h2 class="text-center textAviso">Insira os dados corretamente, <br>e tente novamente</h2>')
    $('#modalItem .buttonSave').hide()
    $('#modalItem .modal-content').removeClass('bg-white text-dark')
    $('#modalItem .modal-content').addClass('bg-danger text-white') // Adicionar classes
    $('#modalItem .buttonClose').addClass('bg-white text-dark') // Mudar cor do button
    $('#modalItem .buttonClose').text('Fechar')
}