'use strict';

// API SETTINGS
var _AMOUNT_QUESTIONS = 5;

var _GETALLCATEGORIES_LINK = 'https://opentdb.com/api_category.php';
var _GETQUESTION_LINK = 'https://opentdb.com/api.php?amount=' + _AMOUNT_QUESTIONS;

// ELEMENTS
var cboCategory,
	cboDifficulty,
	cboType,
	btnShoot,
	btnPrefs,
	btnClose,
	main__content,
	header__navigation,
	header__slogan,
	main__content__buttons,
	main__content__preferences,
	main__content__question,
	main__content__container,
	main__content__answers,
	main__content__response;

// QUESTIONS
var arrQuestions = [];
var firstTime = true;

// Responses
responseCorr = ['Great, succes!', 'You‘re a real smart ass!', 'That‘s correct!', 'Hell yeah!', 'You are from another planet!'];
responseInCorr = ['Let‘s pretend that never happened!', 'Oops, you pressed the wrong button!', 'Have you read the question properly?', 'Try again, dumbass.', 'Wrong answer!'];


// SETUP
function GetElements() {
	cboCategory = $('#cboCategory');
	cboDifficulty = $('#cboDifficulty');
	cboType = $('#cboType');
	btnShoot = $('#btnShoot');
	btnPrefs = $('#btnPrefs');
	btnClose = $('#btnClose');

	// main, root
	main__content = $('.main__content');

	// header (logo + slogan)
	header__navigation = $('.header__navigation');

	// h1 in the header
	header__slogan = $('.header__slogan');

	// container buttons, select
	main__content__container = $('.main__content__container');

	// container of btnShoot and btnPrefs
	main__content__buttons = $('.main__content__buttons');

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
function ShowPreferences() {
	main__content__preferences.css('display', 'flex');
	main__content__buttons.css('display', 'none');

	if ($(document).width() < 560) {
		header__slogan.css('display', 'none');
	}
}

function ClosePreferences() {
	main__content__preferences.css('display', 'none');
	main__content__buttons.css('display', 'flex');
	if ($(document).width() < 560) {
		header__slogan.css('display', 'block');
	}
}


// QUESTIONS
function Shoot() {
	var properties = {
		category: cboCategory.val(),
		difficulty: cboDifficulty.val(),
		type: cboType.val()
	};

	if (firstTime) {
		GetQuestionsAndShow(GetUrlQuestion(properties));
		firstTime = false;
	}
	else {
		showQuestion();	
		if (arrQuestions.length < 2) {
			GetQuestions(GetUrlQuestion(properties));
		}
	}
}

function GetUrlQuestion(properties) {
	var url = _GETQUESTION_LINK;
	for (var property in properties) {
		if (properties[property] != '') {
			url += '&' + property + '=' + properties[property];
		}
	}

	// console.log(url);
	return url;
}

function GetQuestionsAndShow(requestLink) {
	$.getJSON(requestLink, function (data) {
		if (data['response_code'] == 0) {
			// SUCCES
			arrQuestions = arrQuestions.concat(data['results']);
			showQuestion();
		}
		else {
			// OTHER STATUS CODE
			console.log("Error, try again");
			return null;
		}
	})
}

function GetQuestions(requestLink){
	$.getJSON(requestLink, function (data) {
		if (data['response_code'] == 0) {
			arrQuestions = arrQuestions.concat(data['results']);
		}
		else {
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

	if ($(document).width() < 580) {
		header__navigation.css('display', 'none');
	}
}

function showQuestion() {
	hideOtherContainersButQuestion();
	var question = arrQuestions[0];
	console.log(question);

	main__content__question.empty();
	main__content__question.append('<div class="question__card"><p class="question__card__category">' + question['category'] + '</p><p class="question__card__question">' + question['question'] + '</p></div>');

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

	$('.btnAnswer').on('click', function (e) {
		checkQuestion(e.target.innerHTML, question['correct_answer']);
	});
}

function createButtonAnswer(pText, pContainer) {
	pContainer.append('<button class="btnAnswer">' + pText + '</button>');
}

function checkQuestion(pSelected, pCorrect) {
	var text;
	hideQuestion();
	header__navigation.css('display', 'block');
	main__content__response.empty();
	main__content__response.css('display', 'grid');

	if (pSelected == pCorrect) {
		showCorrect();
	}
	else {
		showIncorrect(pCorrect);
	}

	$('.btnResponse').click(newQuestion);
}

function hideQuestion() {
	main__content__answers.css('display', 'none');
	main__content__question.css('display', 'none');
}

function newQuestion() {
	arrQuestions.shift();
	main__content.removeClass('correct incorrect');
	changeDisplayProperty(main__content__response, 'none');
	Shoot();
}
// END QUESTIONS


// SHOW SUCCESS
function showCorrect() {
	main__content__response.append(
		$('<?xml version="1.0" encoding="UTF-8"?><svg viewBox="0 0 148.11 119.31" xmlns="http://www.w3.org/2000/svg"><defs><style>.svgcolor{fill:#cecece;}</style></defs><g data-name="Layer 2"><g data-name="Eindwerk"><g data-name="QuestionSucces"><polygon class="svgcolor" points="125.98 0 50.94 75.05 22.12 46.24 0 68.36 28.81 97.17 28.8 97.18 50.92 119.31 148.11 22.12"/></g></g></g></svg>'),
		$('<h1/>', { text: getRandomResponse(responseCorr) }),
		$('<button/>', { class: 'btnResponse', text: 'New question!' })
	);

	main__content.addClass('correct');
}

// SHOW FAIL
function showIncorrect(pCorrect) {
	main__content__response.append(
		$('<?xml version="1.0" encoding="UTF-8"?><svg viewBox="0 0 119.7 120.7" xmlns="http://www.w3.org/2000/svg"><defs><style>.svgcolor{fill:#aa1818;}</style></defs><title>Asset 10</title><g data-name="Layer 2"><g data-name="Eindwerk"><g data-name="QuestionSucces2"><polygon class="svgcolor" points="119.7 23.13 97.57 1 60.35 38.22 22.13 0 0 22.13 38.22 60.35 0 98.57 22.13 120.7 60.35 82.48 97.57 119.7 119.7 97.57 82.48 60.35"/></g></g></g></svg>'),
		$('<div/>').append(
			$('<h1/>', { text: getRandomResponse(responseInCorr) }),
			$('<p/>', { text: 'The correct answer was: ' + pCorrect })
		),
		$('<button/>', { class: 'btnResponse', text: 'Try again!' })
	);

	main__content.addClass('incorrect');
}

// VARIA
function changeDisplayProperty(pElement, pDisplayValue) {
	pElement.css('display', pDisplayValue);
}

function getRandomResponse(pList){
	var randomIndex = Math.floor(Math.random() * pList.length);
	return pList[randomIndex];
}

document.addEventListener('DOMContentLoaded', function () {
	console.log("Let's start, press the shoot button!");
	GetElements();
	SetupCategories(_GETALLCATEGORIES_LINK);

	// button event listeners
	btnShoot.click(Shoot);
	btnPrefs.click(ShowPreferences);
	btnClose.click(ClosePreferences);
});