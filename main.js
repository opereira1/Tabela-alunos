const KEY_BD = '@usuariosestudo'


var listaRegistros = {
    ultimoIdGerado:0,
    usuarios:[]
}


var FILTRO = ''


function gravarBD(){
    localStorage.setItem(KEY_BD, JSON.stringify(listaRegistros) )
}

function lerBD(){
    const data = localStorage.getItem(KEY_BD)
    if(data){
        listaRegistros = JSON.parse(data)
    }
    desenhar()
}


function pesquisar(value){
    FILTRO = value;
    desenhar()
}


function desenhar(){
    const tbody = document.getElementById('listaRegistrosBody')
    if(tbody){
        var data = listaRegistros.usuarios;
        if(FILTRO.trim()){
            const expReg = eval(`/${FILTRO.trim().replace(/[^\d\w]+/g,'.*')}/i`)
            data = data.filter( usuario => {
                return expReg.test( usuario.nome ) || expReg.test( usuario.Matricula )
            } )
        }
        data = data
            .sort( (a, b) => {
                return a.nome < b.nome ? -1 : 1
            })
            .map( usuario => {
                return `<tr>
                        <td>${usuario.id}</td>
                        <td>${usuario.nome}</td>
                        <td>${usuario.Matricula}</td>
                        <td>${usuario.nota1}</td>
                        <td>${usuario.nota2}</td>
                        <td>${usuario.nota3}</td>
                        <td>
                            <button onclick='vizualizar("cadastro",false,${usuario.id})'>Editar</button>
                            <button class='vermelho' onclick='perguntarSeDeleta(${usuario.id})'>Deletar</button>
                        </td>
                    </tr>`
            } )
        tbody.innerHTML = data.join('')
    }
}

function insertUsuario(nome, Matricula, nota1, nota2, nota3){
    const id = listaRegistros.ultimoIdGerado + 1;
    listaRegistros.ultimoIdGerado = id;
    listaRegistros.usuarios.push({
        id, nome, Matricula, nota1, nota2, nota3
    })
    gravarBD()
    desenhar()
    vizualizar('lista')
}

function editUsuario(id, nome, Matricula){
    var usuario = listaRegistros.usuarios.find( usuario => usuario.id == id )
    usuario.nome = nome;
    usuario.Matricula = Matricula;
    gravarBD()
    desenhar()
    vizualizar('lista')
}

function deleteUsuario(id){
    listaRegistros.usuarios = listaRegistros.usuarios.filter( usuario => {
        return usuario.id != id
    } )
    gravarBD()
    desenhar()
}

function perguntarSeDeleta(id){
    if(confirm('Quer deletar o registro de id '+id)){
        deleteUsuario(id)
    }
}


function limparEdicao(){
    document.getElementById('nome').value = ''
    document.getElementById('Matricula').value = ''
    document.getElementById('nota1').value = ''
    document.getElementById('nota2').value = ''
    document.getElementById('nota3').value = ''
    document.getElementById('Media').value = ''
}

function vizualizar(pagina, novo=false, id=null){
    document.body.setAttribute('page',pagina)
    if(pagina === 'cadastro'){
        if(novo) limparEdicao()
        if(id){
            const usuario = listaRegistros.usuarios.find( usuario => usuario.id == id )
            if(usuario){
                document.getElementById('id').value = usuario.id
                document.getElementById('nome').value = usuario.nome
                document.getElementById('Matricula').value = usuario.Matricula
                document.getElementById('nota1').value = usuario.nota1
                document.getElementById('nota2').value = usuario.nota2
                document.getElementById('nota3').value = usuario.nota3
            }
        }
        document.getElementById('nome').focus()
    }
}



function submeter(e){
    e.preventDefault()
    const data = {
        id: document.getElementById('id').value,
        nome: document.getElementById('nome').value,
        Matricula: document.getElementById('Matricula').value,
        Nota1: document.getElementById('nota1').value,
        Nota2: document.getElementById('nota2').value,
        nota3: document.getElementById('nota3').value,
    }
    if(data.id){
        editUsuario(data.id, data.nome, data.Matricula, data.nota1, data.nota2, data.nota3)
    }else{
        insertUsuario( data.nome, data.Matricula, data.nota1, data.nota2, data.nota3)
    }
}


window.addEventListener('load', () => {
    lerBD()
    document.getElementById('cadastroRegistro').addEventListener('submit', submeter)
    document.getElementById('inputPesquisa').addEventListener('keyup', e => {
        pesquisar(e.target.value)
    })

})

class Aluno {

    nome;
  
    Matricula;
  
    nota1;
  
    nota2;
  
    nota3;
  
     constructor(nome, Matricula, n1, n2, n3) {
  
       this.nome = nome;
  
       this.Matricula = Matricula;
  
       this.nota1 = n1;
  
       this.nota2 = n2;
  
       this.nota3 = n3;
  
    }
  
     exibeInfo() {
  
       return `Aluno: ${this.nome} - mat: ${this.Matricula}
  
      Notas: N1: ${this.nota1} - N2: ${this.nota2} - N3: ${this.nota3}
  
      Média:${this.calculaMedia()} 
  
      `;
  
    }
  
     calculaMedia() {
  
       return ((this.nota1 + this.nota2 + this.nota3) / 3).toFixed(2);
  
    }
    
  }