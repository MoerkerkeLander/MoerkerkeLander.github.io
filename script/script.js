// API SETTINGS
var _AMOUNT_QUESTIONS = 5;

var _GETALLCATEGORIES_LINK = 'https://opentdb.com/api_category.php';
var _GETQUESTION_LINK = 'https://opentdb.com/api.php?amount=' + String(_AMOUNT_QUESTIONS);

// ELEMENTS
var cboCategory,
	cboDifficulty,
	cboType,
	btnShoot,
	btnPrefs,
	main__content,
	header__slogan,
	main__content__preferences,
	main__content__question,
	main__content__container,
	main__content__answers,
	main__content__response;

// QUESTIONS
var arrQuestions;

// SETUP
function GetElements() {
	cboCategory = $('#cboCategory');
	cboDifficulty = $('#cboDifficulty');
	cboType = $('#cboType');
	btnShoot = $('#btnShoot');
	btnPrefs = $('#btnPrefs');

	// main, root
	main__content = $('.main__content');

	// h1 in the header
	header__slogan = $('.header__slogan');

	// container buttons, select
	main__content__container = $('.main__content__container');

	// container of the selects
	main__content__preferences = $('.main__content__preferences');

	// containter of the question (card)
	main__content__question = $('.main__content__question');

	// container of the buttons
	main__content__answers = $('.main__content__answers');

	// container of response
	main__content__response = $('.main__content__response');
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
	// cboCategory.empty();
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
		main__content__preferences.css('display', 'none');
	}
	else {
		main__content__preferences.css('display', 'flex');
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
			hideOtherContainersButQuestion();
			arrQuestions = data['results'];
			console.log(arrQuestions);
			showQuestion(data['results']);			
		}
		else {
			// OTHER STATUS CODE
			console.log("Error, try again");
			return null;
		}
	})
}

function hideOtherContainersButQuestion() {
	changeDisplayProperty(main__content__container, 'none');
	changeDisplayProperty(header__slogan, 'none');
	changeDisplayProperty($('.main__content__answers'), 'grid');
	changeDisplayProperty($('.main__content__question'), 'block');
}

function showQuestion(questions) {
	var question = questions[0];
	main__content__question.empty();
	main__content__question.append('<div class="question__card"><p class="question__card__category">' + question['category']  + '</p><p class="question__card__question">' + question['question'] + '</p></div>');

	main__content__answers.empty();

	if (question['type'] == "multiple") {
		var answers = question['incorrect_answers'];
		answers.push(question['correct_answer']);
		answers.sort();

		for (var index = 0; index < answers.length; index++) {
			createButtonAnswer(answers[index], main__content__answers);
		}
	}
	else {
		createButtonAnswer('True', main__content__answers);
		createButtonAnswer('False', main__content__answers);	
	}

	$('.btnAnswer').on('click', function(e) {
		checkQuestion(e.target.innerHTML, question['correct_answer']);
	});
}

function createButtonAnswer(pText, pContainer){
	pContainer.append('<button class="btnAnswer">' + pText + '</button>');
}

function checkQuestion(pSelected, pCorrect){
	var text;
	hideQuestion();
	main__content__response.empty();
	if (pSelected == pCorrect) {
		showCorrect();
	}
	else {
		showCorrect();
	}

	$('.btnNewQuestion').click(newQuestion);
}

function hideQuestion(){
	main__content__answers.css('display', 'none');
	main__content__question.css('display', 'none');
}

function newQuestion() {
	// main__content__answers.remove();
	// main__content__question.remove();
	// main__content__preferences
	// main__content__question
	// main__content__container
	// main__content__answers
	// main__content__response

	main__content.removeClass('correct incorrect');
	changeDisplayProperty(main__content__response, 'none');
	Shoot();

}
// END QUESTIONS


// SHOW SUCCESS
function showCorrect(){
	main__content__response.css('display', 'grid');
	main__content__response.append(
		$('<?xml version="1.0" encoding="UTF-8"?><svg viewBox="0 0 148.11 119.31" xmlns="http://www.w3.org/2000/svg"><defs><style>.svgcolor{fill:#cecece;}</style></defs><g data-name="Layer 2"><g data-name="Eindwerk"><g data-name="QuestionSucces"><polygon class="svgcolor" points="125.98 0 50.94 75.05 22.12 46.24 0 68.36 28.81 97.17 28.8 97.18 50.92 119.31 148.11 22.12"/></g></g></g></svg>'),
		$('<p/>', { text: 'Great, succes!' }),
		$('<button/>', { class: 'btnNewQuestion', text: 'New question!' })
	);
			
	main__content.addClass('correct');	
}

// SHOW FAIL
function showIncorrect() {
	main__content__response.css('display', 'table');

	main__content__response.append(
		$('<?xml version="1.0" encoding="UTF-8"?><svg viewBox="0 0 119.7 120.7" xmlns="http://www.w3.org/2000/svg"><defs><style>.svgcolorIcc{fill:#aa1818;}</style></defs><title>Asset 10</title><g data-name="Layer 2"><g data-name="Eindwerk"><g data-name="QuestionSucces2"><polygon class="svgcolorIcc" points="119.7 23.13 97.57 1 60.35 38.22 22.13 0 0 22.13 38.22 60.35 0 98.57 22.13 120.7 60.35 82.48 97.57 119.7 119.7 97.57 82.48 60.35"/></g></g></g></svg>'),
		$('<p/>', { text: 'Let‘s pretend that never happened!' }),
		$('<button/>', { class: 'btnNewQuestion', text: 'Try again!' })
	);

	main__content.addClass('incorrect');
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