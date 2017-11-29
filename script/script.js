// API SETTINGS
var _AMOUNT_QUESTIONS = 1;

var _GETALLCATEGORIES_LINK = 'https://opentdb.com/api_category.php';
var _GETQUESTION_LINK = 'https://opentdb.com/api.php?amount=' + String(_AMOUNT_QUESTIONS);

// ELEMENTS
var cboCategory,
	cboDifficulty,
	cboType,
	btnShoot,
	btnPrefs,
	headerSlogan,
	sectPrefs,
	sectQuestions,
	homepageContainer,
	answersContainer;

// SETUP
function GetElements() {
	cboCategory = $('#cboCategory');
	cboDifficulty = $('#cboDifficulty');
	cboType = $('#cboType');
	btnShoot = $('#btnShoot');
	btnPrefs = $('#btnPrefs');
	headerSlogan = $('.header__slogan');
	sectPrefs = $('.main__content__preferences');
	sectQuestions = $('.main__content__question');
	homepageContainer = $('.main__content__conainer');
	answersContainer = $('.main__content__answers');
}

// CATEGORIES
function SetupCategories(requestLink) {
	$.getJSON(requestLink, function (data) {
		ShowCategories(data);
	})
}

function ShowCategories(categoriesData) {
	var categories = categoriesData['trivia_categories'];
	categories = SortCategories(categories);

	FillCategoriesComboBox(categories);
}

function SortCategories(unsortedCategories) {
	function compare(a, b) {
		if (a.name < b.name)
			return 1;
		if (a.name > b.name)
			return -1;
		return 0;
	}

	unsortedCategories.sort(compare);
	return unsortedCategories;
}

function FillCategoriesComboBox(categories) {
	var itemval;
	for (var i = categories.length - 1; i >= 0; i--) {
		if (i !== undefined) {
			itemval += '<option value="' + categories[i]['id'] + '">' + categories[i]['name'] + '</option>';
		}
	}
	cboCategory.append(itemval);
}
// END CATEGORIES

// PREFERENCES
var boolShowPrefs;
function ShowPreferences() {
	if (boolShowPrefs) {
		sectPrefs.css('display', 'none');
	}
	else {
		sectPrefs.css('display', 'flex');
	}
	boolShowPrefs = !boolShowPrefs
}


// QUESTIONS
function Shoot() {
	var properties = {
		category: cboCategory.val(),
		difficulty: cboDifficulty.val(),
		type: cboType.val()
	};

	GetQuestion(GetUrlQuestion(properties));
}

function GetUrlQuestion(properties) {
	var url = _GETQUESTION_LINK;
	for (var property in properties) {
		if (properties[property] != '') {
			url += '&' + property + '=' + properties[property];
		}
	}

	console.log(url);
	return url;
}

function GetQuestion(requestLink) {
	$.getJSON(requestLink, function (data) {
		if (data['response_code'] == 0) {
			// SUCCES

			// homepageContainer.css('display', 'none');
			changeDisplayProperty(homepageContainer, 'none');
			// $('.header__slogan').css('display', 'none');
			changeDisplayProperty(headerSlogan, 'none');
			// $('.main__content__answers').css('display', 'grid');
			changeDisplayProperty($('.main__content__answers'), 'grid');
			// $('.main__content__question').css('display', 'block');
			changeDisplayProperty($('.main__content__question'), 'block');
			
			showQuestion(data['results']);			
		}
		else {
			// OTHER STATUS CODE
			console.log("Error, try again");
			return null;
		}
	})
}

function showQuestion(questions) {
	var question = questions[0];
	// SHOW CATEGORY
	sectQuestions.append('<div class="question__card"><p class="question__card__category">' + question['category']  + '</p><p class="question__card__question">' + question['question'] + '</p></div>');

	
	if (question['type'] == "multiple") {
		var answers = question['incorrect_answers'];
		answers.push(question['correct_answer']);
		answers.sort();

		for (var index = 0; index < answers.length; index++) {
			createButtonAnswer(answers[index], answersContainer);
		}
	}
	else {
		createButtonAnswer('True', answersContainer);
		createButtonAnswer('False', answersContainer);	
	}

	$('.btnAnswer').on('click', function(e) {
		checkQuestion(e.target.innerHTML, question['correct_answer']);
	});
}

function createButtonAnswer(pText, pContainer){
	pContainer.append('<button class="btnAnswer">' + pText + '</button>');
}

function checkQuestion(pSelected, pCorrect){
	answersContainer.css('display', 'none');
	sectQuestions.css('display', 'none');
	if (pSelected == pCorrect) {
		// hideQuestion();
		console.log("juist");
		showCorrect();
	}
	else {
		console.log("fout");
		// hideQuestion();
		showIncorrect();
	}
}

function hideQuestion(){
	answersContainer.css('display', 'none');
	sectQuestions.css('display', 'none');
}

// END QUESTIONS


// SHOW SUCCESS
function showCorrect(){

}

// SHOW FAIL
function showIncorrect() {
	
}

// VARIA
function changeDisplayProperty(pElement, pDisplayValue) {
	pElement.css('display', pDisplayValue);
}

document.addEventListener('DOMContentLoaded', function () {
	console.log("Ready!");
	GetElements();
	SetupCategories(_GETALLCATEGORIES_LINK);

	// button event listeners
	btnShoot.click(Shoot);
	btnPrefs.click(ShowPreferences);
});