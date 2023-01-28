let elForm = document.querySelector('#form');
let descriptionBox = document.querySelector('#description-box');

let sound = document.createElement('audio');

// render data
function renderData(data) {
    descriptionBox.innerHTML = "";

    console.log(data);

    if (!data.title) {
        let arr = data[0].phonetics
        jsonObject = arr.map(JSON.stringify);

        uniqueSet = new Set(jsonObject);
        arr = Array.from(uniqueSet).map(JSON.parse);
        console.log(arr);
        for (let i = 0; i < arr.length; i++) {

            let description = document.createElement('div');
            description.classList.add('description');
            let wordCard = document.createElement('div');
            wordCard.classList.add('word-card');
            let word = document.createElement('h3');
            word.classList.add('word');
            word.textContent = `${data[0].word}  -  ${arr[i].text ? arr[i].text.split('/').join('') : "No data"}`
            let btn = document.createElement('button');
            btn.setAttribute('onclick', 'playSound()');
            btn.innerHTML = '<img src="./assets/images/volume-high.svg" alt="volume image">'

            wordCard.appendChild(word);
            wordCard.appendChild(btn);
            description.appendChild(wordCard)
            descriptionBox.appendChild(description);

            data[0].meanings[0].definitions.forEach(element => {

                let descriptionEl = document.createElement('p');
                descriptionEl.classList.add('example-title');
                descriptionEl.textContent = element.definition;
                description.appendChild(descriptionEl);

                if (element.example) {
                    let examples = document.createElement('p');
                    examples.classList.add('example');
                    examples.textContent = element.example;
                    description.appendChild(examples);
                }

            })
            let sounds = arr[i].audio;
            sound.setAttribute("src", `${sounds} `);
            sounds = "";
        }

    } else {
        descriptionBox.innerHTML = `
            < h2 class="error" > ${data.title}</h2 >
                `
    }
}

// sound
function playSound() {
    sound.play()
}


// find data
elForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let word = e.target[0].value.trim();
    if (word) {
        fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
            .then((response) => response.json())
            .then((data) => renderData(data))
            .catch((error) => console.error(error));
        e.target.reset();
    }
    else {
        alert('enter some text');
    }
})
