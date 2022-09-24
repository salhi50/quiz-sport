const headDcmt = `
<head>
  <meta charset="UTF-8">
  <!-- Font Awesome 5 -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
  <!-- BASICS HTML5 -->
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <!-- page css -->
  <link rel="stylesheet" href="/assets/css/page.css">
  <!-- scss -->
  <link rel="stylesheet" href="/assets/scss/begin.css">
  <!-- Jquery Library -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
  <!-- BOOTSTRAP v5.0 -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
  <!-- BOX ICONS -->
  <link href='https://unpkg.com/boxicons@2.1.2/css/boxicons.min.css' rel='stylesheet'>
  <title></title>
</head>

`
document.querySelector('head').innerHTML = headDcmt;

const bodyDcmt = `

<!-- Main content -->

<main class="d-flex">
<!-- Main section -->

<section class="flex-grow-1 categorie-dashboard ${document.querySelector('.page-type').dataset.section} middle-content pb-5">

<!-- Header progress -->
<div class="header-progress w-100">
    <div class="main-container">
        <h5 class="categorie-title"></h5>
        <div class="progress-categorie">
            <div class="main-progress"></div>
        </div>
        <div class="progress-status d-flex align-content-center justify-content-between flex-row-reverse">
            <span class="categorie-status"></span>
            <span><span class="categorie-stars">0</span>/90 <i class="fa fa-star main-star pe-1"></i></span>
        </div>
    </div>
</div>

<!-- Stages section -->
<div class="frame-title">
<div class="main-container">
    <h4 class="frame-heading">المراحل</h4>
    <p class="frame-description">عندما تكمل أية مرحلة و تجيب على جميع الأسئلة بشكل صحيح ستحصل على 10 نجوم.</p>
</div>
</div>

<div class="main-container">
<section class="frame">
    <ul class="stages-menu">
        <li class="stage-item d-flex align-content-center justify-content-between align-items-center flex-wrap">
            <div class="stage-details d-flex align-items-center">
                <span class="stage-count">1</span>
                <div class="stage-info">
                    <h5 class="stage-title">المرحلة الأولى</h5>
                    <span class="stage-rewards"><span class="stage-stars">0</span>/10 <i class="fa fa-star main-star star-small"></i></span>
                </div>
            </div>
            <button class="btn stage-btn-start">
                <span>إبدأ</span>
                <i class="fa fa-lock"></i>
            </button>
        </li>
        <li class="stage-item d-flex align-content-center justify-content-between not-allowed align-items-center flex-wrap">
            <div class="stage-details d-flex align-items-center">
                <span class="stage-count">2</span>
                <div class="stage-info">
                    <h5 class="stage-title">المرحلة الثانية</h5>
                    <span class="stage-rewards"><span class="stage-stars">0</span>/10 <i class="fa fa-star main-star star-small"></i></span>
                </div>
            </div>
            <button class="btn stage-btn-start" disabled>
                <span>إبدأ</span>
                <i class="fa fa-lock"></i>
            </button>
        </li>
        <li class="stage-item d-flex align-content-center justify-content-between not-allowed align-items-center flex-wrap">
            <div class="stage-details d-flex align-items-center">
                <span class="stage-count">3</span>
                <div class="stage-info">
                    <h5 class="stage-title">المرحلة الثالثة</h5>
                    <span class="stage-rewards"><span class="stage-stars">0</span>/10 <i class="fa fa-star main-star star-small"></i></span>
                </div>
            </div>
            <button class="btn stage-btn-start" disabled>
                <span>إبدأ</span>
                <i class="fa fa-lock"></i>
            </button>
        </li>
        <li class="stage-item d-flex align-content-center justify-content-between not-allowed align-items-center flex-wrap">
            <div class="stage-details d-flex align-items-center">
                <span class="stage-count">4</span>
                <div class="stage-info">
                    <h5 class="stage-title">المرحلة الرابعة</h5>
                    <span class="stage-rewards"><span class="stage-stars">0</span>/10 <i class="fa fa-star main-star star-small"></i></span>
                </div>
            </div>
            <button class="btn stage-btn-start" disabled>
                <span>إبدأ</span>
                <i class="fa fa-lock"></i>
            </button>
        </li>
        <li class="stage-item d-flex align-content-center justify-content-between not-allowed align-items-center flex-wrap">
            <div class="stage-details d-flex align-items-center">
                <span class="stage-count">5</span>
                <div class="stage-info">
                    <h5 class="stage-title">المرحلة الخامسة</h5>
                    <span class="stage-rewards"><span class="stage-stars">0</span>/10 <i class="fa fa-star main-star star-small"></i></span>
                </div>
            </div>
            <button class="btn stage-btn-start" disabled>
                <span>إبدأ</span>
                <i class="fa fa-lock"></i>
            </button>
        </li>
        <li class="stage-item d-flex align-content-center justify-content-between not-allowed align-items-center flex-wrap">
            <div class="stage-details d-flex align-items-center">
                <span class="stage-count">6</span>
                <div class="stage-info">
                    <h5 class="stage-title">المرحلة السادسة</h5>
                    <span class="stage-rewards"><span class="stage-stars">0</span>/10 <i class="fa fa-star main-star star-small"></i></span>
                </div>
            </div>
            <button class="btn stage-btn-start" disabled>
                <span>إبدأ</span>
                <i class="fa fa-lock"></i>
            </button>
        </li>
        <li class="stage-item d-flex align-content-center justify-content-between not-allowed align-items-center flex-wrap">
            <div class="stage-details d-flex align-items-center">
                <span class="stage-count">7</span>
                <div class="stage-info">
                    <h5 class="stage-title">المرحلة السابعة</h5>
                    <span class="stage-rewards"><span class="stage-stars">0</span>/10 <i class="fa fa-star main-star star-small"></i></span>
                </div>
            </div>
            <button class="btn stage-btn-start" disabled>
                <span>إبدأ</span>
                <i class="fa fa-lock"></i>
            </button>
        </li>
        <li class="stage-item d-flex align-content-center justify-content-between not-allowed align-items-center flex-wrap">
            <div class="stage-details d-flex align-items-center">
                <span class="stage-count">8</span>
                <div class="stage-info">
                    <h5 class="stage-title">المرحلة الثامنة</h5>
                    <span class="stage-rewards"><span class="stage-stars">0</span>/10 <i class="fa fa-star main-star star-small"></i></span>
                </div>
            </div>
            <button class="btn stage-btn-start" disabled>
                <span>إبدأ</span>
                <i class="fa fa-lock"></i>
            </button>
        </li>
        <li class="stage-item d-flex align-content-center justify-content-between not-allowed align-items-center flex-wrap">
            <div class="stage-details d-flex align-items-center">
                <span class="stage-count">9</span>
                <div class="stage-info">
                    <h5 class="stage-title">المرحلة التاسعة</h5>
                    <span class="stage-rewards"><span class="stage-stars">0</span>/10 <i class="fa fa-star main-star star-small"></i></span>
                </div>
            </div>
            <button class="btn stage-btn-start" disabled>
                <span>إبدأ</span>
                <i class="fa fa-lock"></i>
            </button>
        </li>
    </ul>
</section>
</div>

</div>

<!-- Stats Section -->
<div class="frame-title">
    <div class="main-container">
        <h4 class="frame-heading">احصائيات القسم</h4>
        <p class="frame-description">يمكنك مراقبة تقدمك في كل قسم.</p>
    </div>
</div>

<div class="main-container">
    <div class="frame bg-white p-3">
        <p class="frame-information grey">الإجابات</p>
        <ul class="menu-table">
            <li class="list-table">
                <span class="table-label">عدد الإجابات الصحيحة</span>
                <span class="table-information categorie-right-answers">0</span>
            </li>
            <li class="list-table">
                <span class="table-label">عدد الإجابات الخاطئة</span>
                <span class="table-information categorie-wrong-answers">0</span>
            </li>
            <li class="list-table">
                <span class="table-label">المجموع</span>
                <span class="table-information categorie-total-answers">0</span>
            </li>
        </ul>
    </div>
</div>


</section>
</main>


<!-- Loader -->
<div class="loading d-none">
<div class="spinner-grow"></div>
</div>

<!-- Quiz environement -->
<article class="quiz d-none">
<div class="main-container">

    <!-- Quiz header -->
    <div class="quiz-header">
        <div class="quiz-stage-label d-flex align-items-center justify-content-between flex-row-reverse">
            <i class="fa fa-times close-quiz cursor"></i>
            <span></span>
        </div>
        <div class="quiz-progress">
            <div class="main-progress"></div>
        </div>
    </div>
        
        <!-- Quiz content -->
        <div class="quiz-content">
            <h3 class="quiz-question"></h3>
            <ul class="quiz-answers">
            </ul>
        </div>
        
        <!-- Quiz submit -->
        <div class="quiz-submit pb-3">
            <button class="btn btn-submit-answer" data-status="check" disabled>تحقق</button>
        </div>


</div>
</article>

<!-- Quiz Result -->

<article class="quiz-result d-none">
<div class="quiz-result-container">

    <div class="quiz-stars-result">
        <h4 class="quiz-stars-count-result d-flex align-items-center"><i class="fa fa-star main-star ps-2"></i> <spanc class="final-stage-score"></span></h4>
    </div>

    <p class="quiz-description-result passed-description">لقد أكملت المستوى بنجاح</p>

    <p class="quiz-description-result inpassed-description">تحتاج لخمسة نجوم على الأقل لاكمال المستوى</p>
    
    <ul class="menu-table w-100">
        <li class="list-table">
            <span class="table-label">الإجابات الصحيحة</span>
            <span class="table-information final-result-right-answers"></span>
        </li>
        <li class="list-table">
            <span class="table-label">الإجابات االخاطئة</span>
            <span class="table-information final-result-wrong-answers"></span>
        </li>
    </ul>

    <button class="btn submit-final-answer main-btn w-100">المتابعة</button>
</div>
</article>

`

document.body.innerHTML += bodyDcmt;