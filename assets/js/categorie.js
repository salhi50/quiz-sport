/* Categorie Script */

let alphabet = [];
for(let i = 0; i < 26; i++) {
    alphabet.push(String.fromCharCode(97 + i));
}


let levelsNum = ['الأولى','الثانية','الثالثة','الرابعة','الخامسة','السادسة',
'السابعة','الثامنة', 'التاسعة'];

// Create the quiz class
class quiz {
    constructor(question , answers, correct , quizType, imgPath = null) {
        Object.assign(this, {question, answers, correct, quizType});
        this.imgPath = quizType === 'img' ? imgPath : null;
    }

    checkEquality(answer) {
        let { correct:corr } = this;
        if(Array.isArray(answer)) {
            let cond1 = corr.length === answer.length;
            let cond2 = true;
            for(let i = 0; i < corr.length; i++) {
                if(!corr.includes(answer[i])) {
                    cond2 = false;
                    break;
                }
            }
            return cond1 && cond2;
        }else {
            return corr === answer;
        }
    }
}

// Create the stage class

class stage {
    constructor(num, element, quizs = [], stageName) {
        this.stageName = stageName;
        this.name = 'stage'+num;
        this.stats = {
            stars: 0,
            completed: false,
            wrongAnswers: 0,
            rightAnswers: 0
        };
        this.element = element;
        this.quizs = quizs;
    }
}

// Create stages function

function createStages(element) {
    let arr = [];
    for(let i = 1; i <= 9; i++) {
        arr.push(new stage(i, element, [], 'المرحلة'+' '+levelsNum[i - 1]));
    }
    return arr;
}

// Create the main categorie class

class categorie {
    constructor(name, element) {
        this.categorieName = name;
        this.totalStars = 0;
        this.element = element;
        this.stages = createStages(element);
    }
}

// Create the main categories elements

let arrElCategories = [
    new categorie('رياضة', 'sport')
]

/* 
============
Content
=============
*/

// Get the target section 

let targetSection = arrElCategories
                  .map(e => document.querySelector('.'+e.element))
                  .filter(e => e !== null)[0];

// Get the target categorie

let targetCategorie = arrElCategories.filter(e => {
    return targetSection.classList.contains(e.element)
})[0];

// Updata page title

document.title = `قسم ${targetCategorie.categorieName} - ثقافتي`;

// Add class of stage to all of the stages elements

let stagesItems = targetSection.querySelectorAll('.stage-item');
stagesItems.forEach((e, i) => {
    e.classList.add(targetCategorie.stages[i].name);
});

// Get Data stored and update stages stats

let initialLoc = localStorage.getItem(targetCategorie.element);
if(initialLoc) {
   let res = JSON.parse(initialLoc);
   for(let i = 0; i < 9; i++) {
    targetCategorie.stages[i].stats = res[i];
   }
}

// Get and update the global Data
// 
let globalData = {stars: 0, wrongAnswers: 0, rightAnswers: 0};
let catgs = [];

arrElCategories.forEach(e => {
    let loc = localStorage.getItem(e.element);
    if(loc) {
        catgs.push(JSON.parse(loc));
    };
});

function getSpecificDataFromLS(d) {
    return catgs.map(e => e.map(el => el[d])
                           .reduce((a,b) => a+b,0))
                           .reduce((a,b) => a+b,0);
} 

if(catgs.length) {
    for(let i in globalData) {
        globalData[i] = getSpecificDataFromLS(i);
    }
}

localStorage.setItem('global-data', JSON.stringify(globalData));

// Replace the section title
replaceBasicDataAfterReload();
function replaceBasicDataAfterReload() {
    let { categorieName } = targetCategorie;
    let catTitleEl = targetSection.querySelector('.categorie-title');
    catTitleEl.innerText = categorieName;
}

// Start data changing

const startBtnsStages = targetSection.querySelectorAll('.stage-btn-start');
const quizSection = document.querySelector('.quiz');
const main = document.querySelector('main');
const loader = document.querySelector('.loading');

startBtnsStages.forEach((e, i) => {
    e.addEventListener('click', function() {
        if(i === 0) {
            prepareQuiz(0); 
        }else {
            if(targetCategorie.stages[i - 1].stats.completed) {
                prepareQuiz(i);
            }
        }  
    })
})

const quizLabel = quizSection.querySelector('.quiz-stage-label span');
const quizQuestion = quizSection.querySelector('.quiz-question');

function prepareQuiz(indx) {
    let { quizs , stageName} = targetCategorie.stages[indx];
    loader.classList.remove('d-none');
    setTimeout(() => {
        loader.classList.add('d-none');
        [main].forEach(e => e.classList.add('d-none'));
        quizSection.classList.remove('d-none');
    } , 2000);

    quizLabel.innerText = stageName;

    getQuestionsAndAnswers(ranOrder(quizs), targetCategorie.stages[indx]);
}

// Get questions and Answers depend type

let questionTypes = {
    muni: {
        inputType: 'radio'
    },
    multi: {
        inputType: 'checkbox'
    },
    img: {
        inputType: 'radio'
    }
}

const answersContainer = quizSection.querySelector('.quiz-answers');
const subAnswerBtn = quizSection.querySelector('.btn-submit-answer');

let active = 0;
let numRightAns = 0;
let numWrongAns = 0;

function getQuestionsAndAnswers(arr, stage) {
    // get current quiz
    let currQuiz = arr[active];
    // check if it a img quiz type
    let imgContainer = document.querySelector('.quiz-img-container');
    if(imgContainer) {
        answersContainer.parentElement.removeChild(imgContainer);
    }
    if(currQuiz.quizType === 'img') {
        let div = document.createElement('div');
        div.classList.add('quiz-img-container');
        div.innerHTML = `<img src="${currQuiz.imgPath}" alt="Quiz image" class="quiz-img">`;
        answersContainer.parentElement.insertBefore(div, answersContainer);
    }

    let inputType = questionTypes[currQuiz.quizType].inputType;

    // question
    quizQuestion.innerText = currQuiz.question;

    // replace answers
    answersContainer.innerHTML = '';
    let arrAns = [];
    for(let i = 0; i < Object.keys(currQuiz.answers).length; i++) {
        let li = document.createElement('li');
        li.classList.add('quiz-answer');
        li.innerHTML = `
        <input type="${inputType}" class="quiz-input form-check-input" name="answer" id="${alphabet[i]}">
        <label for="${alphabet[i]}" class="quiz-label">${currQuiz.answers[alphabet[i]]}</label>
        <i class="fa fa-check answer-icon-result right-icon"></i>
        <i class="fa fa-times answer-icon-result wrong-icon"></i>
        `
        arrAns.push(li);
    }
    ranOrder(arrAns).forEach(e => answersContainer.appendChild(e));

    // Submit functionnality
    let selectedInputs;
    const inputs = [...quizSection.querySelectorAll('.quiz-answer input')];
    inputs.forEach(e => {
        e.addEventListener('change', () => {
            selectedInputs = inputs.filter(inp => inp.checked);
            if(selectedInputs.length) {
                subAnswerBtn.disabled = false;
            }else subAnswerBtn.disabled = true;
        })
    });
    subAnswerBtn.addEventListener('click', submitFunc);
    function submitFunc() {
        let typeSub = this.dataset.status;
        if(typeSub === 'check') {
            checkAnswer(currQuiz, inputs);
            this.dataset.status = 'submit';
            this.innerText = 'المتابعة';
        }else if (typeSub === 'submit') {
            active++;
            quizSection.scrollTo(0,0);
            updateProgressQuiz();
            if(active > arr.length - 1) {
                showResult(stage);
            }
            else {
                this.dataset.status = 'check';
                this.innerText = 'تحقق';
                this.disabled = true;
                subAnswerBtn.removeEventListener('click', submitFunc);
                getQuestionsAndAnswers(arr, stage);
            }
        }
        inputs.forEach(e => {
            e.classList.add('invisible');
            e.disabled = true;
            e.parentElement.style.pointerEvents = 'none';
        })
    }
}

// Update the progress quiz

function updateProgressQuiz() {
    const quizProgress = document.querySelector('.quiz-progress .main-progress');
    quizProgress.style.width = `${(active * 100) / 10}%`;
}

// Close quiz section

const closeQuiz = document.querySelector('.close-quiz');
closeQuiz.addEventListener('click', function() {
    if(active > 0) {
        let closeValidation = confirm('هل تود حقا الانسحاب؟'+'\n'+'ستخسر كل ماأنجزته في هذه المرحلة');
        if(closeValidation) location.reload();
    }else if(active === 0) {
        location.reload();
    }
})

// Function to check the answer

function checkAnswer(curr, inpts) {
    let answersSelected = inpts
                          .filter(e => e.checked)
                          .map(e => e.id);
    let checkAnswer = curr.checkEquality(answersSelected);
    // If the answer is correct
    if(checkAnswer) {
        numRightAns++;
        activeSoundEffect('/sounds/right.mp3');
        showAnswerCheckMsg('correct-answer-msg');
        inpts.filter(e => e.checked).forEach(one => {
            one.parentElement.classList.add('true');
        });
    //  Wrong answer
    }else {
        numWrongAns++;
        activeSoundEffect('/sounds/wrong.mp3');
        showAnswerCheckMsg('wrong-answer-msg');
        // get right answers
        let rightAns = inpts.filter(e => {
            return curr.checkEquality(e.id) || curr.correct.includes(e.id);
        });
        rightAns.forEach(e => e.parentElement.classList.add('true'));
        // get wrong answers
        let checkedAns = inpts.filter(e => e.checked);
        let wrongAns;
        if(Array.isArray(curr.correct)) {
            wrongAns = checkedAns.filter(e => !curr.correct.includes(e.id));
        }else {
            wrongAns = checkedAns;
        }
        wrongAns.forEach(e => e.parentElement.classList.add('false'));
    }
}


// Get quiz result

const quizResultEl = document.querySelector('.quiz-result');
const wrongAnswersStageEl = quizResultEl.querySelector('.final-result-wrong-answers');
const rightAnswersStageEl = quizResultEl.querySelector('.final-result-right-answers');
const finalStageStars = quizResultEl.querySelector('.final-stage-score');
const updateStatsBtn = quizResultEl.querySelector('.submit-final-answer');

function showResult(stage) {
    answersContainer.innerHTML = '';
    quizSection.classList.add('d-none');
    quizResultEl.classList.remove('d-none');

    quizResultEl.classList.add(`${numRightAns >= 5 ? 'passed' : 'inpassed'}`);

    if(stage.stats.completed) {
        quizResultEl.classList.remove('passed', 'inpassed');
    }

    wrongAnswersStageEl.innerText = numWrongAns;
    rightAnswersStageEl.innerText = numRightAns;
    finalStageStars.innerText = numRightAns;

    // Update the stage stats

    updateStatsBtn.addEventListener('click', () => {
        updateStage();

        // resetStageSection();
    });

    function updateStage() {
        const { stats: {stars} } = stage;

        stage.stats.stars = Math.max(stars, numRightAns);
        stage.stats.completed = stage.stats.stars >= 5;

        stage.stats.wrongAnswers = 10 - stage.stats.stars;
        stage.stats.rightAnswers = stage.stats.stars;
        
        localStorage.setItem(targetCategorie.element, JSON.stringify(targetCategorie.stages.map(e => e.stats)));

        location.reload();

        updateStatsBtn.removeEventListener('click', updateStage);
    }
}


// Show right message
function showAnswerCheckMsg(cls) {
    let div = document.createElement('div');
    div.classList.add('answer-msg', cls);
    div.innerText = cls.includes('wrong') ? 'إجابة خاطئة' : 'إجابة صحيحة';
    document.body.appendChild(div);
    setTimeout(() => div.classList.add('active'),0);
    setTimeout(() => div.classList.remove('active'), 2010);
    setTimeout(() => div.remove(), 2500);
}

// Active sound effect
function activeSoundEffect(path) {
    let sound = document.createElement('audio');
    sound.setAttribute('src', path);
    document.body.appendChild(sound);
    sound.play();
    setTimeout(() => sound.remove(), 2000);
}

// Function to get random order

function ranOrder(arr) {
    return arr.sort(() => .5 - Math.random());
}


/* 
====================
Start replacing data
====================
*/

const categorieStatusEL = targetSection.querySelector('.categorie-status');
const categorieStarsEl = targetSection.querySelector('.categorie-stars');
const stagesStarsEls = targetSection.querySelectorAll('.stage-stars');

let totalStagesStars = targetCategorie.stages.map(e => e.stats.stars).reduce((a,b) => a + b, 0);

// Total stage stars
categorieStarsEl.innerText = totalStagesStars;

// Stages stars
stagesStarsEls.forEach((e,i) => {
    e.innerText = targetCategorie.stages[i].stats.stars;
});

// Categorie status
categorieStatusEL.innerText = totalStagesStars >= 90 ? 'مكتمل' : 'غير مكتمل';

// completed stages and incomplete

const btnStageStart = [...targetSection.querySelectorAll('.stage-btn-start')];
for(let i = 1; i <= 8; i++) {
    let checkStageBefore = targetCategorie.stages[i - 1].stats.completed
    btnStageStart[i].disabled = !checkStageBefore;
    if(checkStageBefore) {
        stagesItems[i].classList.remove('not-allowed');
    }
}

// total right and wrong answers 

const totalStatsWrongAnswersEl = targetSection.querySelector('.categorie-wrong-answers');
const totalStatsrightAnswersEl = targetSection.querySelector('.categorie-right-answers');
const totalStatsAnswersEl = targetSection.querySelector('.categorie-total-answers');

totalStatsrightAnswersEl.innerText = targetCategorie.stages.map(e => e.stats.rightAnswers).reduce((a,b) => a + b, 0);
totalStatsWrongAnswersEl.innerText = targetCategorie.stages.map(e => e.stats.wrongAnswers).reduce((a,b) => a + b, 0);
totalStatsAnswersEl.innerText = Number(totalStatsWrongAnswersEl.innerText) + Number(totalStatsrightAnswersEl.innerText);

// Update progress bar

const progressLevel = targetSection.querySelector('.progress-categorie .main-progress');

progressLevel.style.width = `${(totalStagesStars * 100) / 90}%`;

/* 
==============
Start adding quizs
==============
*/

// Sport questions
let sportCategorie = {
    name: 'sport',
    stage1: [
        new quiz('أي بلد فاز بأول كأس عالم في عام ١٩٣٠؟', {
            a: 'الأرجنتين',
            b: 'إيطاليا',
            c: 'البرازيل',
            d: 'أوروجواي'
        }, 'd', 'muni'),
        new quiz('أي بلد فاز بأكبر عدد من بطولات كأس العالم؟', {
            a: 'ألمانيا',
            b: 'إيطاليا',
            c: 'البرازيل',
            d: 'الأرجنتين'
        }, 'c', 'muni'),
        new quiz('قضى ميسي مسيرته المهنية الكاملة في برشلونة ، ولكن ما هو فريقه عندما كان تلميذ؟', {
            a: 'نيولز أولد بويز',
            b: 'ريال مدريد',
            c: 'سبورتنج',
            d: 'برشلونة'
        }, 'a', 'muni'),
        new quiz('أي فريق برتغالي لعب له رونالدو قبل التوقيع مع مانشستر يونايتد؟', {
            a: 'ريال مدريد',
            b: 'سبورتينغ لشبونة',
            c: 'إيه سي ميلان',
            d: 'يوفنتوس'
        }, 'b', 'muni'),
        new quiz('ماهو الرقم الذي يلعب به ميسي حاليا؟', {
            a: '7',
            b: '10',
            c: '19',
            d: '30'
        }, 'd', 'muni'),
        new quiz('ماهو الفريق الأكثر فوزا بدوري أبطال أوربا؟', {
            a: 'ريال مدريد',
            b: 'برشلونة',
            c: 'بايرن ميونخ',
            d: 'تشيلسي'
        }, 'a', 'muni'),
        new quiz('متى غادر الحارس ايكر كاسياس نادي ريال مدريد؟', {
            a: '2020',
            b: '2018',
            c: '2015',
            d: '2016'
        }, 'c', 'muni'),
        new quiz('ساعد رونالدو البرتغال على الفوز بالبطولة الأوروبية في أي عام؟', {
            a: '2018',
            b: '2022',
            c: '2016',
            d: '2017'
        }, 'c', 'muni'),
        new quiz('من هو اللاعب الوحيد الذي فاز بدوري أبطال أوروبا مع ثلاثة أندية مختلفة؟', {
            a: 'كريستيانو رونالدو',
            b: 'كلارنس سيدورف',
            c: 'فرانسيسكو خينتو',
            d: 'ليونيل ميسي'
        }, 'b', 'muni'),
        new quiz('من اللاعب الذي يحمل الرقم القياسي لعدد مرات المشاركة في دوري أبطال أوروبا؟', {
            a: 'كريستيانو رونالدو',
            b: 'ايكر كاسياس',
            c: 'جاريث باري',
            d: 'ليونيل ميسي'
        }, 'b', 'muni')
    ],
    stage2: [
        new quiz('ماهو العدد القياسي للكرات الذهبية الذي فاز به ميسي؟', {
            a: '5',
            b: '6',
            c: '10',
            d: '4'
        }, 'b', 'muni'),
        new quiz('من فاز بالكرة الذهبية سنة 2018؟', {
            a: 'ليونيل ميسي',
            b: 'لوكا مودريتش',
            c: 'كريستيانو رونالدو'
        }, 'b', 'muni'),
        new quiz('ماهي السنوات التي فاز فيها كريستيانو رونالدو بالكرة الذهبية؟', {
            a: '2009',
            b: '2014',
            c: '2016',
            d: '2017',
            e: '2012',
            f: '2015'
        }, ['b','c','d'], 'multi'),
        new quiz('متى كانت النسخة الأولى من كأس أمم أوروبا؟', {
            a: '1980',
            b: '1960',
            c: '1955',
            d: '1985'
        }, 'b', 'muni'),
        new quiz('من هي المنتخبات الأكثر فوزًا بكأس أمم أوروبا؟', {
            a: 'ألمانيا',
            b: 'بلجيكا',
            c: 'إسبانيا',
            d: 'البرتغال'
        }, ['a','c'], 'multi'),
        new quiz('أي من هذه المنتخبات لم يفز بكأس أمم أوروبا من قبل', {
            a: 'الدنمارك',
            b: 'بلجيكا',
            c: 'اليونان'
        }, 'b', 'muni'),
        new quiz('احتاج كريستيانو رونالدو 27 مباراة لتسجيل أول أهدافه في دوري أبطال أوروبا', {
            a: 'صحيح',
            b: 'خطأ'
        }, 'a', 'muni'),
        new quiz('من الاعب الدي لعب بالأرقام 7 و 17 و 28 و 9 في مسيرته؟', {
            a: 'رونالدينيو',
            b: 'ديفيد بيكهام',
            c: 'كريستيانو رونالدو',
            d: 'كيليان مبابي'
        }, 'c', 'muni'),
        new quiz('ما هو الفريق الذي فاز بالدوري الممتاز الأول؟', {
            a: 'تشيلسي',
            b: 'برشلونة',
            c: 'مانشستر يونايتد',
            d: 'ليفربول'
        }, 'c', 'muni'),
        new quiz('من هو اللاعب الذي سجل أكبر عدد من الأهداف في مسابقة كأس العالم واحدة؟', {
            a: 'كريستيانو رونالدو',
            b: 'جوست فونتين',
            c: 'زين الدين زيدان',
            d: 'مارادونا'
        }, 'b', 'muni')
    ],
    stage3: [
        new quiz('اسم النادي؟', {
            a: 'برشلونة',
            b: 'ليفربول',
            c: 'يوفنتوس',
            d: 'بورتو'
        }, 'a', 'img','/imgs/clubs/barca.svg'),
        new quiz('اسم النادي؟', {
            a: 'بارما',
            b: 'إيه سي ميلان',
            c: 'يوفنتوس',
            d: 'تشيلسي'
        }, 'b', 'img','/imgs/clubs/milan.svg'),
        new quiz('اسم النادي؟', {
            a: 'فالنسيا',
            b: 'إيه سي ميلان',
            c: 'بوروسيا دورتموند',
            d: ' إشبيلية'
        }, 'd', 'img','/imgs/clubs/sevilla.png'),
        new quiz('اسم النادي؟', {
            a: 'أتلتيكو مدريد',
            b: 'بايرن ميونخ',
            c: 'بوروسيا دورتموند',
            d: 'ريال مدريد'
        }, 'a', 'img','/imgs/clubs/atletico.svg'),
        new quiz('اسم النادي؟', {
            a: 'أندرلخت',
            b: 'بايرن ميونخ',
            c: 'هامبورغ',
            d: 'شالكه 04'
        }, 'd', 'img','/imgs/clubs/shalka.svg'),
        new quiz('اسم النادي؟', {
            a: 'يوفنتوس',
            b: 'بايرن ميونخ',
            c: 'مارسيليا',
            d: 'باريس سان جيرمان'
        }, 'c', 'img','/imgs/clubs/marselia.svg'),
        new quiz('اسم النادي؟', {
            a: 'سيلتا فيغو',
            b: 'بايرن ميونخ',
            c: 'روما',
            d: 'ملقا'
        }, 'a', 'img','/imgs/clubs/celta.svg'),
        new quiz('اسم النادي؟', {
            a: 'لنس',
            b: 'تروا',
            c: 'ليل',
            d: 'مونبلييه'
        }, 'c', 'img','/imgs/clubs/lille.svg'),
        new quiz('اسم النادي؟', {
            a: 'غلطة سراي',
            b: 'مارسيليا',
            c: 'ماغديبورغ',
            d: 'مونبلييه'
        }, 'a', 'img','/imgs/clubs/galata.svg'),
        new quiz('اسم النادي؟', {
            a: 'غلطة سراي',
            b: 'شتوتغارت',
            c: 'فياريال',
            d: 'فيورنتينا'
        }, 'c', 'img','/imgs/clubs/villa.svg')
    ],
    stage4: [
        new quiz('في أي عام تأسس نادي برشلونة؟', {
            a: '1900',
            b: '1899',
            c: '1920',
            d: '1910'
        }, 'b', 'muni'),
        new quiz('متى تأسس نادي ريال مدريد لكرة القدم؟', {
            a: '1902',
            b: '1901',
            c: '1900',
            d: '1905'
        }, 'a', 'muni'),
        new quiz('من كان أفضل هداف ريال مدريد على الإطلاق؟', {
            a: 'رودريغو',
            b: 'بنزيمة',
            c: 'راؤول غونزالس',
            d: 'كريستيانو رونالدو'
        }, 'c', 'muni'),
        new quiz('من هو الرقم 20 في نادي ريال مدريد حاليا (2022) ؟', {
            a: 'ماريانو',
            b: 'هازارد',
            c: 'فينيسيوس جونيور',
            d: 'أسينسيو'
        }, 'c', 'muni'),
        new quiz('من هو رئيس نادي برشلونة الحالي (2022) ؟', {
            a: 'ريمون كاروسكو',
            b: 'خوان لابورتا',
            c: 'ساندرو روسيل',
            d: 'جوزيب بارتوميو'
        }, 'b', 'muni'),
        new quiz('يعد أحد أكبر الأحداث الرياضية في إسبانيا، ماذا يُطلق عليه؟', {
            a: 'كرة القدم للسيدات',
            b: 'كأس السوبر الإسباني',
            c: 'كأس الملك الإسباني',
            d: 'الكلاسيكو'
        }, 'd', 'muni'),
        new quiz('أي عام أصبح برشلونة أول فريق إسباني يفوز بالثلاثية القارية؟', {
            a: '2010',
            b: '2009',
            c: '2007',
            d: '2008'
        }, 'b', 'muni'),
        new quiz('من كتب نشيد نادي برشلونة؟', {
            a: 'مانويل فالس',
            b: 'جوزيب ماريا',
            c: 'جاومي بيكاس '
        }, ['c','b'], 'multi'),
        new quiz('من هو حارس ريال مدريد الرئيسي حاليا؟', {
            a: 'لونين',
            b: 'سيزار سانشيز',
            c: 'كيلور نافاس ',
            d: 'كورتوا '
        }, 'd', 'muni'),
        new quiz('إسم المنظمة؟', {
            a: 'الاتحاد الأوروبي لكرة القدم ',
            b: 'اتحاد أمريكا الجنوبية لكرة القدم',
            c: 'اتحاد أوقيانوسيا لكرة القدم',
            d: 'الاتحاد الدولي لكرة القدم '
        }, 'd', 'img','/imgs/org/fifa.png')
    ],
    stage5: [
        new quiz('من هو اللاعب الذي حصل على جائزة أفضل لاعب كرة قدم في أوروبا عام 1998؟', {
            a: 'مارادونا',
            b: 'جاريث باري',
            c: 'السير ستانلي ماثيوز',
            d: 'زين الدين زيدان'
        }, 'd', 'muni'),
        new quiz('فازت ثلاث دول بكأس العالم مرتين. ما هم؟', {
            a: 'الأوروغواي',
            b: 'فرنسا',
            c: 'برتغال',
            d: 'الأرجنتين'
        }, ['a','b','d'], 'multi'),
        new quiz('ما هو أكثر الأندية تحقيقًا للقب البطولة السعودية؟', {
            a: 'الاتحاد',
            b: 'الهلال',
            c: 'النصر',
            d: 'الفتح'
        }, 'b', 'muni'),
        new quiz('كم عدد الأندية التي لعبت في الدوري الممتاز الأول؟', {
            a: '20',
            b: '22',
            c: '18',
            d: '19'
        }, 'b', 'muni'),
        new quiz('سوف تستضيف ثلاث دول مختلفة كأس العالم 2026. ما هم؟', {
            a: 'المكسيك',
            b: 'الولايات المتحدة الأمريكية',
            c: 'كندا',
            d: 'البرازيل',
            e: 'أوروغواي'
        }, ['a','b','c'], 'multi'),
        new quiz('برصيد 260 هدفًا، من هو أفضل هدافي الدوري الإنجليزي على الإطلاق؟', {
            a: 'آلان شيرر',
            b: 'إيرلينج هالاند',
            c: 'هاري كين',
            d: 'إيفان طوني'
        }, 'a', 'muni'),
        new quiz('في أي سنة اعتزل رونالدو قبل أن يغير قراره؟', {
            a: '2020',
            b: '2021',
            c: '2016',
            d: '2019'
        }, 'c', 'muni'),
        new quiz('ما هو أكبر ملعب لكرة قدم في العالم؟', {
            a: 'ملعب ملبورن للكريكيت',
            b: 'ملعب رونجرادو الأول من مايو',
            c: 'كامب نو',
            d: 'ملعب البنك الوطني الأول'
        }, 'b', 'muni'),
        new quiz('متى تم استخدام ضربات الجزاء للمرة الأولى؟', {
            a: '1903',
            b: '1902',
            c: '1900',
            d: '1901'
        }, 'c', 'muni'),
        new quiz('ما هي الدولة التي أُقيمت بها بطولة كأس العالم لأول مرة؟', {
            a: 'فرنسا',
            b: 'سويسرا',
            c: 'البرازيل',
            d: 'أورجواي'
        }, 'd', 'muni')
    ],
    stage6: [
        new quiz('إسم الاعب؟', {
            a: 'نيمار',
            b: 'سيرجيو راموس',
            c: 'إدين هازارد',
            d: 'ليونيل ميسي'
        }, 'd', 'img','/imgs/Players/messi.jpg'),
        new quiz('إسم الاعب؟', {
            a: 'هاري كين',
            b: 'إيسكو',
            c: 'محمد صلاح',
            d: 'روبرت ليفاندوفسكي'
        }, 'c', 'img','/imgs/Players/salah.jpg'),
        new quiz('إسم الاعب؟', {
            a: 'مارسيلو',
            b: 'أوزيل',
            c: 'نجولو كانتي',
            d: 'ديلي آلي'
        }, 'b', 'img','/imgs/Players/ozil.jpg'),
        new quiz('إسم الاعب؟', {
            a: 'لوكا مودريتش',
            b: 'كريستيانو رونالدو',
            c: 'كاسيميرو',
            d: 'سيرجيو أجويرو'
        }, 'b', 'img','/imgs/Players/cristiano.jpg'),
        new quiz('إسم الثلاتي؟', {
            a: 'msn',
            b: 'mtp',
            c: 'nop',
            d: 'lil'
        }, 'a', 'img','/imgs/Players/msn.jpg'),
        new quiz('إسم الاعب؟', {
            a: 'روبرت ليفاندوفسكي',
            b: 'باولو ديبالا',
            c: 'إدينسون كافاني',
            d: 'هاري كين'
        }, 'd', 'img','/imgs/Players/kane.jpg'),
        new quiz('إسم الاعب؟', {
            a: 'إدين هازارد',
            b: 'إيميريك أوباميانج',
            c: 'فيليب كوتينيو',
            d: 'داني ألفيس'
        }, 'a', 'img','/imgs/Players/hazard.jpg'),
        new quiz('إسم الاعب؟', {
            a: 'جابرييل جيسوس',
            b: 'روبرت ليفاندوفسكي',
            c: 'سيرجيو راموس',
            d: 'ديفيد يد خيا'
        }, 'b', 'img','/imgs/Players/lewandawski.jpg'),
        new quiz('إسم الاعب؟', {
            a: 'ساديو ماني',
            b: 'ديفيد سيلفا',
            c: 'سيرجيو راموس',
            d: 'جابرييل جيسوس'
        }, 'a', 'img','/imgs/Players/mani.jpg'),
        new quiz('إسم الاعب؟', {
            a: 'دييجو جودين',
            b: 'رحيم ستيرلينج',
            c: 'كفين دي بروين',
            d: 'كيليان مبابي'
        }, 'c', 'img','/imgs/Players/bruyne.jpg')
    ],
    stage7: [
        new quiz(' أين تمت إقامة أولى بطولات كأس العالم للقارات والتي كانت في عام 1992م؟', {
            a: 'السعودية',
            b: 'نجلترا',
            c: 'فرنسا',
            d: 'البرازيل'
        }, 'a', 'muni'),
        new quiz('متى أقيم أول سباق للسيارات والذي كان في فرنسا؟', {
            a: '1896',
            b: '1894',
            c: '1892',
            d: '1900'
        }, 'b', 'muni'),
        new quiz('في أي مدينة أقيمت أول دورة للألعاب الأولمبية في آسيا والتي كانت في عام 1964م؟', {
            a: 'بكين',
            b: 'طوكيو',
            c: 'سيدني',
            d: 'لندن'
        }, 'b', 'muni'),
        new quiz('كم يبلغ أكبر أوزان لعبة المصارعة؟', {
            a: '100 كجم',
            b: '110 كجم',
            c: '120 كجم',
            d: '130 كجم'
        }, 'c', 'muni'),
        new quiz('ما هما الفريقان الذين كانا طرفا لمباراة كرة القدم التي تسبب في إندلاع حرب؟', {
            a: 'السلفادور',
            b: 'هندوراس',
            c: 'ألمانيا الغربية',
            d: 'نرويج',
            e: 'انجلترا'
        }, ['a','b'], 'multi'),
        new quiz('كم يبلغ عدد أفراد لعبة كرة اليد؟', {
            a: '6',
            b: '7',
            c: '8',
            d: '10'
        }, 'b', 'muni'),
        new quiz('متى ظهرت البطاقات الصفراء والحمراء في كأس العالم لكرة القدم؟', {
            a: '1956',
            b: '1970',
            c: '1974',
            d: '1980'
        }, 'b', 'muni'),
        new quiz('كم يبلغ عدد لاعبي الفريق في كرة السلة؟', {
            a: '5',
            b: '6',
            c: '7',
            d: '12'
        }, 'a', 'muni'),
        new quiz('ما هو اسم بطولة فرنسا المفتوحة للتنس؟', {
            a: 'رولان جاروس',
            b: 'ديفيز',
            c: 'ويمبلدون'
        }, 'a', 'muni'),
        new quiz('كم تبلغ عدد الجولات في المباراة الواحدة في لعبة الجودو؟', {
            a: 'جولتان',
            b: 'جولة واحدة',
            c: 'جولتان'
        }, 'b', 'muni')
    ],
    stage8: [
        new quiz('من هو اللاعب الذي لا يمكن أن تبدأ مباراة كرة القدم إلا بوجوده؟', {
            a: 'حارس المرمى',
            b: 'المهاجم',
            c: 'المدافع',
            d: 'الوسط'
        }, 'a', 'muni'),
        new quiz('ماهي الدول العربية التي شاركت في كأس العالم لكرة القدم عام 1990م؟', {
            a: 'الإمارات',
            b: 'مصر',
            c: 'المغرب',
            d: 'الجزائر'
        }, ['a','b'], 'multi'),
        new quiz('ما هي أول دولة عربية شاركت في دورة الألعاب الأولمبية؟', {
            a: 'الإمارات',
            b: 'مصر',
            c: 'المغرب',
            d: 'الجزائر'
        }, 'b', 'muni'),
        new quiz('من هو أول لاعب كرة قدم مصري يفوز بجائزة الكرة الذهبية كأفضل لاعب في قارة أفريقيا؟', {
            a: 'محمد صلاح',
            b: 'محمود الخطيب',
            c: 'محمد أبو تريكة'
        }, 'b', 'muni'),
        new quiz('ما هي اللعبة التي تعتبر اللعبة الوطنية في دولة كندا؟', {
            a: 'كرة السلة',
            b: 'الاسكواش',
            c: 'هوكي الجليد'
        }, 'c', 'muni'),
        new quiz('كم يبلغ وزن قفاز الملاكم المحترف؟', {
            a: '150 جرامًا',
            b: '180 جرامًا',
            c: '160 جرامًا',
            d: '170 جرامًا'
        }, 'd', 'muni'),
        new quiz('ما هي مدة الأشواط الإضافية؟', {
            a: '15 دقيقة',
            b: '30 دقيقة',
            c: '45 دقيقة',
            d: '55 دقيقة'
        }, 'b', 'muni'),
        new quiz('أين ومتى نشأت كرة القدم بشكلها الحالي؟', {
            a: 'إنجلترا في عام 1700',
            b: 'إنجلترا في عام 1720',
            c: 'إنجلترا في عام 1710',
            d: 'إنجلترا في عام 1730'
        }, 'c', 'muni'),
        new quiz('متى وضعت أول قوانين للعبة كرة القدم ؟', {
            a: '1856',
            b: '1800',
            c: '1850',
            d: '1865'
        }, 'd', 'muni'),
        new quiz('متى تأسس الاتحاد الدولي لكرة القدم ؟', {
            a: '1904',
            b: '1905',
            c: '1906',
            d: '1903'
        }, 'a', 'muni')
    ],
    stage9: [
        new quiz('إسم امدرب؟', {
            a: 'لويس كارنيلجي',
            b: 'نيريو روكو',
            c: 'زين الدين زيدان',
            d: 'كارلو أنشيلوتي'
        }, 'd', 'img','/imgs/Coach/anxiloti.jpg'),      
        new quiz('إسم امدرب؟', {
            a: 'أرسين فينغر',
            b: 'ديتمار كرامر',
            c: 'إرنست هابل',
            d: 'أوتمار هيتسفيلد'
        }, 'a', 'img','/imgs/Coach/finger.jpg'),      
        new quiz('إسم امدرب؟', {
            a: 'بيب غوارديولا',
            b: 'جوزيه مورينيو',
            c: 'فيسنتي ديل بوسكي',
            d: 'أليكس فيرغسون'
        }, 'd', 'img','/imgs/Coach/vergson.jpg'),      
        new quiz('إسم امدرب؟', {
            a: 'ستيفان كوفاتش',
            b: 'هيلينيو هيريرا',
            c: 'كلود بويل',
            d: 'يوب هاينكس'
        }, 'c', 'img','/imgs/Coach/puel.jpg'),      
        new quiz('إسم امدرب؟', {
            a: 'كلاوديو رانييري',
            b: 'إرنست هابل',
            c: 'أوتمار هيتسفيلد',
            d: 'ستيفان كوفاتش'
        }, 'a', 'img','/imgs/Coach/ranieri.jpg'),      
        new quiz('إسم امدرب؟', {
            a: 'كلاوديو رانييري',
            b: 'بيب غوارديولا',
            c: 'يورغن كلوب',
            d: 'مانويل بيليغريني'
        }, 'b', 'img','/imgs/Coach/guardyola.jpg'),      
        new quiz('إسم امدرب؟', {
            a: 'ميغيل مونيوز',
            b: 'أريغو ساكي',
            c: 'يورغن كلوب',
            d: 'أوتمار هيتسفيلد'
        }, 'c', 'img','/imgs/Coach/club.jpg'),      
        new quiz('إسم امدرب؟', {
            a: 'رافائيل بينيتز',
            b: 'برايان كلوف',
            c: 'أرسين فينغر',
            d: 'جوزيه مورينيو'
        }, 'd', 'img','/imgs/Coach/morinio.jpg'),      
        new quiz('إسم امدرب؟', {
            a: 'رافائيل بينيتز',
            b: 'مانويل بيليغريني',
            c: 'كلاوديو رانييري',
            d: 'جوزيه مورينيو'
        }, 'a', 'img','/imgs/Coach/benitiz.jpg'),      
        new quiz('إسم امدرب؟', {
            a: 'يوب هاينكس',
            b: 'مانويل بيليغريني',
            c: ' زيدان',
            d: 'جوزيه مورينيو'
        }, 'b', 'img','/imgs/Coach/manouel.jpg'),      
    ]
}

const categoriesStages = [
    sportCategorie
];

const targetCategorieStages = categoriesStages.filter(e => e.name === targetCategorie.element);

if(targetCategorieStages.length) {
    for(let i = 0; i < 9; i++) {
        targetCategorie.stages[i].quizs = targetCategorieStages[0][`stage${i+1}`];
    }
}
