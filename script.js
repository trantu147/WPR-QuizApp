// // TODO(you): Write the JavaScript necessary to complete the assignment.
let idQuiz = null;
let chosenAns = {};

async function getAPI() {
    let response = await fetch('https://wpr-quiz-api.herokuapp.com/attempts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.json();
}

async function getSubmitAPI() {
    let response = await fetch(`https://wpr-quiz-api.herokuapp.com/attempts/${idQuiz}/submit`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "answers": chosenAns
        })
    });
    return response.json();
}


function onStartButton() {
    getAPI().then(function (data) {
        idQuiz = data._id
        const attemptQuiz = document.getElementById('attempt-quiz')
        // create question form
        data.questions.map((key, index) => {
            const numberQues = document.createElement('h2')
            numberQues.textContent = `Question ${index + 1} of 10`
            numberQues.setAttribute('class', 'question-tag')
            attemptQuiz.appendChild(numberQues)
            const ques = document.createElement('p')
            ques.textContent = key.text
            ques.setAttribute('class', 'question')
            attemptQuiz.appendChild(ques)
            // create answer form 
            const answer_form = document.createElement('form')
            answer_form.setAttribute('id', key._id)
            const answer = document.createElement('div')
            answer.setAttribute('id', 'ans-container')
            answer_form.appendChild(answer)
            attemptQuiz.appendChild(answer_form)
            key.answers.map((keys, id) => {
                // create answer to choose
                const ans_option = document.createElement('label')
                ans_option.setAttribute('class', 'radio-container')
                answer.appendChild(ans_option)
                const input = document.createElement('input')
                input.setAttribute('type', 'radio')
                input.setAttribute('id', `${id + 1}`)
                input.setAttribute('name', 'choice')
                input.setAttribute('value', id)
                input.setAttribute('onchange', 'chosenBox(this)')
                ans_option.appendChild(input)

                const ans_text = document.createElement("lable")
                ans_text.setAttribute('class', 'ans-text')
                ans_text.textContent = keys
                ans_text.setAttribute('for', `${id + 1}`)
                ans_option.appendChild(ans_text)

            })

        })
        // submit box + button
        const submit_box = document.createElement('div');
        submit_box.setAttribute('id', 'submit-box');
        const submit_button = document.createElement('button');
        submit_button.setAttribute('id', 'submit-button');
        submit_button.textContent = 'Submit your answers';
        submit_button.setAttribute('onclick', 'onSubmitButton()')
        submit_box.appendChild(submit_button);
        attemptQuiz.appendChild(submit_box);

    })

}

const startButton = document.querySelector('#start-button');
// on start button event
startButton.addEventListener('click', (e) => {
    onStartButton();
    const intro = document.getElementById('introduction')
    intro.setAttribute('class','hidden')
})

// on answer click event
function chosenBox(value) {
    let prev = null;
    let prevParent = null;
    let parentAll = ""

    let tempt = value.parentElement.parentElement
    if (tempt === parentAll) {
        prevParent.setAttribute("class", "radio-container")
    } else {
        prevParent = value.parentElement
        const a = value.parentElement.parentElement.childNodes
        Object.keys(a).map(function (key, index) {
            a[index].setAttribute("class", "radio-container");
        })
        prevParent.setAttribute("class", "radio-container active")
    }
    prev = value;
    prevParent = value.parentElement
    parentAll = prevParent.parentElement
    if (value.checked == true) {
        prevParent = value.parentElement
        prevParent.setAttribute("class", "radio-container active")
        parentAll = prevParent.parentElement.parentElement
        chosenAns[parentAll.id] = parseInt(value.value) 
    }
}

// on submit button event
function onSubmitButton() {
    const atttemtQUiz = document.getElementById('attempt-quiz')
    atttemtQUiz.setAttribute('class', 'hidden');
    getSubmitAPI().then(function (data) {
        const reviewQuiz = document.getElementById('review-quiz')
        let correct_ans = {}
        correct_ans = data.correctAnswers
        // create question form
        data.questions.map((key, index) => {
            const numberQues = document.createElement('h2')
            numberQues.textContent = `Question ${index + 1} of 10`
            numberQues.setAttribute('class', 'question-tag')
            reviewQuiz.appendChild(numberQues)
            const ques = document.createElement('p')
            ques.textContent = key.text
            ques.setAttribute('class', 'question')
            reviewQuiz.appendChild(ques)

            const answer_form = document.createElement('form')
            answer_form.setAttribute('id', key._id)
            const answer = document.createElement('div')
            answer.setAttribute('id', 'ans-container')
            answer_form.appendChild(answer)
            reviewQuiz.appendChild(answer_form)
            idQues = key._id
            key.answers.map((keys, id) => {
                // create result label for answer
                const lable_ans = document.createElement('div')
                lable_ans.textContent = "Your answers"
                lable_ans.setAttribute('class', 'ans-tag')
                const lable_corr_ans = document.createElement('div')
                lable_corr_ans.textContent = "Correct answers"
                lable_corr_ans.setAttribute('class', 'ans-tag')
            
                // create answer form
                const ans_option = document.createElement('label')
                ans_option.setAttribute('class', 'radio-container noHover')
                answer.appendChild(ans_option)
                const input = document.createElement('input')
                input.setAttribute('type', 'radio')
                input.setAttribute('id', `${id + 1}`)
                input.setAttribute('name', 'choice')
                input.setAttribute('value', id)
                input.setAttribute('onchange', 'chosenBox(this)')
                input.disabled = true

                // check whether the answer is chosen or not
                if (chosenAns[idQues] !== id) {
                    if (correct_ans[idQues] === id) {
                        ans_option.setAttribute('class', 'radio-container active')
                        ans_option.appendChild(lable_corr_ans)
                    }
                } else {
                    input.checked = true
                    ans_option.setAttribute('class', "radio-container wrong")
                    // check whether the answer is correct or not
                    if (chosenAns[idQues] === correct_ans[idQues]) {
                        ans_option.setAttribute('class', 'radio-container correct')
                        ans_option.appendChild(lable_corr_ans)
                    } else {
                        ans_option.appendChild(lable_ans)
                    }
                }
                ans_option.appendChild(input)
                const ans_text = document.createElement("lable")
                ans_text.setAttribute('class', 'ans-text')
                ans_text.textContent = keys
                ans_text.setAttribute('for', `${id + 1}`)
                ans_option.appendChild(ans_text)
            })
        })
        //result box + try again button
        const resultBox = document.createElement('div')
        resultBox.setAttribute('id', 'result-box')
        reviewQuiz.appendChild(resultBox)
        const result_text  = document.createElement('h2')
        result_text.setAttribute('id', 'result-text')
        result_text.textContent = 'Result:'
        resultBox.appendChild(result_text)
        const mark = document.createElement('p')
        mark.setAttribute('id', 'mark')
        mark.textContent = `${data.score}/10`
        resultBox.appendChild(mark)
        const percent = document.createElement('p')
        percent.setAttribute('id', 'percentage')
        percent.textContent = `${(data.score*10)}%`
        resultBox.appendChild(percent)
        const feedback = document.createElement('p')
        feedback.textContent = data.scoreText
        resultBox.appendChild(feedback)
        const tryAgainButton = document.createElement('button')
        tryAgainButton.setAttribute('id', 'try-again-button')
        tryAgainButton.textContent = 'Try again'
        
        //try again
        resultBox.appendChild(tryAgainButton)
        tryAgainButton.addEventListener('click', (e) => {
            location.reload();
            document.body.scrollIntoView()
        })
        
    })
}

