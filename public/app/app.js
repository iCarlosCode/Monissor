const logarComGoogleBtn = document.getElementById('logarComGoogleBtn');
const deslogarDoGoogleBtn = document.getElementById('deslogarDoGoogleBtn');
const configsBtn = document.getElementById('configsBtn');
const addAluno = document.getElementById('addAluno');
const editAluno = document.getElementById('editAluno');
const removeAluno = document.getElementById('removeAluno');
const salvarAlunoBtn = document.getElementById('salvarAlunoNovoBtn');
const editAlunoModalDialog = document.getElementById('editAlunoModalDialog');
const removeAlunoModalDialogBtn = document.querySelector('.deletarTudo');

var desselecionarTudoBtn = document.getElementById('desselecionarTudoBtn');
const editarAlunoBtn = document.getElementById('editarAlunoBtn');
const nomeEditarAlunoInput = document.getElementById('nomeEditarAlunoInput');
const matriculaEditarAlunoInput = document.getElementById(
  'matriculaEditarAlunoInput'
);

const nomeAdicionarAlunoInput = document.getElementById(
  'nomeAdicionarAlunoInput'
);
const matriculaAdicionarAlunoInput = document.getElementById(
  'matriculaAdicionarAlunoInput'
);
const alunosLista1 = document.getElementById('alunosLista1');
const groupListMes = document.querySelectorAll('.list-group');
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

var itensSelecionadosListGroup = [];
var ultimoItemClicado;
var mesChamadaVirtual;
/// Sign in event handlers

logarComGoogleBtn.onclick = () => {
  auth.signInWithPopup(provider);
};

deslogarDoGoogleBtn.onclick = () => auth.signOut();

const db = firebase.firestore(); //Teste
let alunosRef;
let unsubscribe;

auth.onAuthStateChanged(user => {
  if (user) {
    //console.log(firebase)
    // Quando o usuário Logar essa parte será executada
    secaoPrincipal.hidden = false;
    secaoLogin.hidden = true;
    userDetails.innerHTML = `<h3>${user.displayName}!</h3> <p>User ID: ${user.uid}</p>`;
    configsBtn.src = user.photoURL;

    alunosRef = db.collection('alunos');
    /*setarAluno(user, alunosRef, 'Luiz Algusto', 2020123459);
    setarAluno(user, alunosRef, 'Inácio Estácio de Sá', 2020123460);
    setarAluno(user, alunosRef, 'Florisvalda Hortência Tulipa', 2020123463);*/
    salvarAlunoBtn.onclick = () => {
      salvarAluno(
        user,
        alunosRef,
        nomeAdicionarAlunoInput,
        matriculaAdicionarAlunoInput,
        [0, 0, 0, 0]
      );
      //attListGroup();
    };

    removeAlunoModalDialogBtn.onclick = () => {
      configurarBtnRemover(user, alunosRef);
    };
    editarAlunoBtn.onclick = () => {
      configurarBtnEditar(user, alunosRef);
    };
    editAlunoModalDialog.addEventListener('show.bs.modal', event => {
      nomeEditarAlunoInput.value = getNameISLG(itensSelecionadosListGroup[0]);
      matriculaEditarAlunoInput.value = getMatriculaISLG(
        itensSelecionadosListGroup[0]
      );
    });
    desselecionarTudoBtn.onclick = () => {
      configurarBtnDesselecionar();
    };
    console.log(removeAlunoModalDialogBtn);
    console.log(editarAlunoBtn);
    configurarSelecaoDosItensListGroup();
    buttonAdicionarFrequencia(user, alunosRef);
    buttonSubtrairFrequencia(user, alunosRef);

    // Pega os dados dos alunos cadastrados no servidor e exibe eles na tela
    exibirListaDeAlunos(user, alunosRef, alunosLista1, 0);
    exibirListaDeAlunos(user, alunosRef, alunosLista2, 1);
    exibirListaDeAlunos(user, alunosRef, alunosLista3, 2);
    unsubscribe = exibirListaDeAlunos(user, alunosRef, alunosLista4, 3);
  } else {
    //  Quando o usuário estiver deslogado essa parte será executada
    secaoPrincipal.hidden = true;
    secaoLogin.hidden = false;
    userDetails.innerHTML = '';
  }
});

function setarAluno(user, collectionRef, nome, matricula, frequencia) {
  collectionRef
    .doc(`${user.uid}.A${matricula}`)
    .get()
    .then(doc => {
      let alunoExiste = doc.exists;

      if (!alunoExiste) {
        collectionRef
          .doc(`${user.uid}.A${matricula}`)
          .set({
            uid: user.uid,
            nome: nome,
            matricula: matricula,
            frequencia: frequencia,
          })
          .then(() => {
            if (alunoExiste) console.log('Editamos o aluno.');
            else console.log('Adicionamos o aluno.');
          })
          .catch(e => {
            console.error('Error adding document: ', e);
          });
      } else {
        console.log('Aluno existente');
      }
    })
    .catch(error => {
      console.log('Error getting document:', error);
    });
}

function removerAluno(user, collectionRef, matricula) {
  collectionRef
    .doc(`${user.uid}.A${matricula}`)
    .delete()
    .then(() => {
      console.log(`Deletamos aluno A${matricula}`);
    })
    .catch(error => {
      console.log('Error deletting document:', error);
    });
}

function editarAlunoFrequencia(user, collectionRef, matricula, frequencia) {
  collectionRef
    .doc(`${user.uid}.A${matricula}`)
    .update({
      frequencia: frequencia,
    })
    .then(() => {
      console.log('Editamos o aluno.');
    })
    .catch(error => {
      // Se der erro o documento provavelmente não existe.
      console.error('Error updating document: ', error);
    });
}

function salvarAluno(
  user,
  collectionRef,
  nameInput,
  matriculaInput,
  frequencia
) {
  setarAluno(
    user,
    collectionRef,
    nameInput.value,
    parseInt(matriculaInput.value),
    frequencia
  );
  nameInput.value = '';
  matriculaInput.value = '';
}

function getNameISLG(i) {
  return i.find('label')[0].innerHTML;
}

function getMatriculaISLG(i) {
  return parseInt(i.find('label')[1].innerHTML);
}

function getMesISLG(i) {
  return parseInt(`${i[0].id}`.slice(-1));
}

function removerItemSelecionado(value, index, arr) {
  // If the value at the current array index matches the specified value (2)
  if (getMatriculaISLG(value) === getMatriculaISLG(ultimoItemClicado)) {
    // Removes the value from the original array
    arr.splice(index, 1);
    return true;
  }
  return false;
}

function configurarSelecaoDosItensListGroup() {
  $('.list-group').on('contextmenu', '.list-group-item', function (event) {
    event.preventDefault();
    ultimoItemClicado = $(this);
    var mes = parseInt(`${$(this)[0].id}`.slice(-1));
    //console.log(mes)

    if (this.classList.contains('active')) {
      $(this).removeClass('active');
      itensSelecionadosListGroup.filter(removerItemSelecionado);
    } else {
      $(this).addClass('active'); //.siblings().removeClass('active');
      itensSelecionadosListGroup.push($(this));
    }

    console.log(itensSelecionadosListGroup);
    /*if (itensSelecionadosListGroup.length != 0) {
      console.log(getNameISLG(itensSelecionadosListGroup[0]));
      console.log(getMatriculaISLG(itensSelecionadosListGroup[0]));
      console.log(getMesISLG(itensSelecionadosListGroup[0]));
    }*/
    mudarEstadosDaInterfaceNaSelecao(itensSelecionadosListGroup.length, mes);
  });
}

function buttonAdicionarFrequencia(user, alunosRef){
  $('.list-group').on('click', '.ba', function (event) {
    event.preventDefault();
    var matricula = parseInt(`${$(this)[0].id}`.slice(0));
    var mes = parseInt(`${$(this)[0].id}`.slice(-1));
    var valorFrec = parseInt(`${$(this)[0].value}`);
    attFrequencia(user, alunosRef, matricula, mes, parseInt(valorFrec + 1));
  });
}

function buttonSubtrairFrequencia(user, alunosRef){
  $('.list-group').on('click', '.bd', function (event) {
    event.preventDefault();
    var matricula = parseInt(`${$(this)[0].id}`.slice(0));
    var mes = parseInt(`${$(this)[0].id}`.slice(-1));
    var valorFrec = parseInt(`${$(this)[0].value}`);
    if(valorFrec > 0){
      attFrequencia(user, alunosRef, matricula, mes, parseInt(valorFrec - 1));
    }
  });
}


function mudarEstadosDaInterfaceNaSelecao(n, index) {
  if (n == 0) {
    navBarTitulo.innerHTML = 'Relatório Monitoria';
    ativacao = true;
  } else if (n == 1) {
    navBarTitulo.innerHTML = `${n} item selecionado`;
    ativacao = false;
  }

  var buttonsPadrão = document.querySelectorAll('.buttonsPadrão');
  var buttonsExtra = document.querySelectorAll('.buttonsExtra');
  var buttonsAbas = document.querySelectorAll('.linhaAbas');

  for (b = 0; b < buttonsPadrão.length; b++) {
    buttonsPadrão[b].hidden = !ativacao;
  }
  for (b = 0; b < buttonsExtra.length; b++) {
    buttonsExtra[b].hidden = ativacao;
  }
  for (b = 0; b < buttonsAbas.length; b++) {
    buttonsAbas[b].hidden = !ativacao;
    buttonsAbas[index].hidden = false;
  }
  addAluno.hidden = !ativacao;
  if (n > 1) {
    buttonsExtra[1].hidden = !ativacao;
    navBarTitulo.innerHTML = `${n} itens selecionados`;
  }
}

function configurarBtnRemover(user, alunosRef) {
  itensSelecionadosListGroup.forEach(i => {
    removerAluno(user, alunosRef, getMatriculaISLG(i));
  });
  itensSelecionadosListGroup = [];
  mudarEstadosDaInterfaceNaSelecao(0, 0);
}

function configurarBtnDesselecionar() {
  ultimoItemClicado.siblings().removeClass('active');
  ultimoItemClicado.removeClass('active');
  mudarEstadosDaInterfaceNaSelecao(0, getMesISLG(ultimoItemClicado));
  itensSelecionadosListGroup = [];
}

function configurarBtnEditar(user, alunosRef) {
  alunosRef
    .doc(`${user.uid}.A${getMatriculaISLG(itensSelecionadosListGroup[0])}`)
    .get()
    .then(doc => {
      console.log(doc.data().frequencia);
      setarAluno(
        user,
        alunosRef,
        nomeEditarAlunoInput.value,
        parseInt(matriculaEditarAlunoInput.value),
        doc.data().frequencia
      );
      removerAluno(
        user,
        alunosRef,
        getMatriculaISLG(itensSelecionadosListGroup[0])
      );
      itensSelecionadosListGroup = [];
      mudarEstadosDaInterfaceNaSelecao(0, 0);
    });
}

function exibirListaDeAlunos(user, collectionRef, listGroup, frequenciaIndex) {
  unsubscribe = collectionRef
    .where('uid', '==', user.uid)
    .onSnapshot(querySnapshot => {
      const items = querySnapshot.docs.map(doc => {
        return `<a href="#" id="${doc.data().matricula}-${frequenciaIndex}"  
        class="list-group-item list-group-item-action flex-column align-items-start">
            <!--Dados aluno-->
            <div style="float: left; margin-left: 10px;">
              <span class="material-symbols-outlined">person</span>
              <label " class= "user name ${
                doc.data().matricula
              }" style="vertical-align: top; max-width: 350px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${
          doc.data().nome
        }</label>
              <br>
              <span class="material-symbols-outlined">money</span>
              <label class= "user matricula ${
                doc.data().uid
              }" style="vertical-align: top;">${doc.data().matricula}</label>
            </div>
            
            <!--Botão-->
            
            <div class="btn-group" role="group" aria-label="Basic example" style="float: right; margin-right: 10px; margin-top: 10px;">
                <button type="button" id="${doc.data().matricula}-BD${frequenciaIndex}" value="${doc.data().frequencia[frequenciaIndex]}" class="btn btn-primary bd">-</button>
                <button type="button" class="btn btn-primary">${
                  doc.data().frequencia[frequenciaIndex]
                }</button>
                <button type="button" id="${doc.data().matricula}-BA${frequenciaIndex}" value="${doc.data().frequencia[frequenciaIndex]}" class="btn btn-primary ba">+</button>
            </div>
          </a>`;
      });
      listGroup.innerHTML = items.join('');
    });
  return unsubscribe;
}

function attFrequencia(user, alunosRef, matricula, mes, valorFrec){
  alunosRef
    .doc(`${user.uid}.A${matricula}`)
    .get()
    .then(doc => {
      var frequencia = doc.data().frequencia;
      frequencia[mes] = valorFrec;
      editarAlunoFrequencia(user, alunosRef, matricula, frequencia);
    });
}