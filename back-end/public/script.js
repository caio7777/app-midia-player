var musicas = []
var audio = new Audio();
var musicaAtual = 0;


fetch('http://localhost:8080/read')
    .then(response => response.json())
    .then(data => {
        musicas = data.map(path => {
            let cleanedPath = path.replace(/C:\\Users\\caiob\\OneDrive\\Área de Trabalho\\intensivao_javascript\\back-end\\public\\musicas\\/g, '');
            return cleanedPath.replace(/\\/g, '/');
        });
        audio.src = musicas[musicaAtual];
    })
    .catch(error => console.error('Erro:', error));



// Atualização do controle deslizante conforme a música é reproduzida
audio.addEventListener('timeupdate', function () {
    
    linhaDoTempo.value = audio.currentTime;
    
});

// Alteração da posição na música quando o controle deslizante é movido
linhaDoTempo.addEventListener('input', function () {
    audio.currentTime = linhaDoTempo.value;

})



audio.onended = function () {
    musicaAtual++;
    if (musicaAtual >= musicas.length) {
        musicaAtual = 0;
    }
    audio.src = musicas[musicaAtual]
    document.getElementById('music-name').innerHTML = musicas[musicaAtual].replace(/musicas\/|\.mp3/g, '')
    audio.play();
};


const pause = document.getElementById('pause')
pause.addEventListener('click', () => {
    document.getElementById('pause').style.display = "none"
    document.getElementById('play').style.display = "initial"
})

const play = document.getElementById('play')
play.addEventListener('click', () => {

    document.getElementById('play').style.display = "none"
    document.getElementById('pause').style.display = "initial"
    document.getElementById('music-name').innerHTML = musicas[musicaAtual].replace(/musicas\/|\.mp3/g, '')
})


function next_track() {
    musicaAtual++;
    if (musicaAtual >= musicas.length) {
        musicaAtual = 0;
    }
    audio.src = musicas[musicaAtual]
    document.getElementById('music-name').textContent = musicas[musicaAtual].replace(/musicas\/|\.mp3/g, '')
    audio.play();
}

function back_track() {
    if (musicaAtual) {
        musicaAtual--;
        if (musicaAtual <= musicaAtual) {
            musicaAtual = 0;
        }
        audio.src = musicas[musicaAtual];
        audio.play();
        document.getElementById('music-name').innerHTML = musicas[musicaAtual].replace(/musicas\/|\.mp3/g, '')
    } else {
        console.log("Nenhuma música foi tocada ainda.");
    }

}

// Atualização do controle deslizante conforme a música é reproduzida

audio.addEventListener('loadedmetadata', function () {
    var linhaDoTempo = document.getElementById('linhaDoTempo');
    linhaDoTempo.max = audio.duration;

});

audio.addEventListener('timeupdate', function () {
    linhaDoTempo = document.getElementById('linhaDoTempo');
    linhaDoTempo.value = audio.currentTime.toString();
});



const show_list_music = document.querySelector('input[type="checkbox"]')

show_list_music.addEventListener('change', function () {
    var lista = document.getElementById('content_list_music')
    if (this.checked) {
        console.log(this.checked)
        document.getElementById('content_list_music').style.transform = "translate(0)"

        for (let index = 0; index < musicas.length; index++) {
            let ol = document.createElement("ol")
            let element_list = document.createElement('button')
            ol.setAttribute('id', 'lista_ol' + index)
            element_list.setAttribute('data-path', musicas[index])
            element_list.setAttribute('class', 'element-list')
            element_list.setAttribute('id', 'music_element' + index)
            let new_ = ol.appendChild(element_list)
            element_list.textContent = musicas[index]
            lista.appendChild(new_)

            element_list.addEventListener('click', function () {
                // Alterando a fonte do áudio para a música correspondente
                audio.src = this.getAttribute('data-path');
                // Começando a tocar a música
                audio.play();
                document.getElementById('content_list_music').style.overflowY = 'scroll'
                document.getElementById('pause').style.display = "initial"
                document.getElementById('play').style.display = "none"
                document.getElementById('music-name').textContent = this.getAttribute('data-path').replace(/musicas\/|\.mp3/g, '')

            });
        }

    } else {
        // Enquanto houver um elemento filho, remova-o
        function fecharContentListMusic() {
            var contentListMusic = document.getElementById("content_list_music");
            while (contentListMusic.firstChild) {
                contentListMusic.removeChild(contentListMusic.firstChild);
            }
        }
        fecharContentListMusic()
        document.getElementById('content_list_music').style.transform = "translate(-305px)"
        
    }

})



