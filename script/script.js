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
			ShowQuestion(data['results']);
		}
		else {
			// OTHER STATUS CODE
			console.log("Error, try again");
			return null;
		}
	})
}

function ShowQuestion(questions) {
	homepageContainer.css('display', 'none');
	$('.header__slogan').css('display', 'none');
	$('.main__content__answers').css('display', 'grid');
	$('.main__content__question').css('display', 'block');
	var question = questions[0];
	// add question
	sectQuestions.append('<div class="question__card"><p class="question__card__category">' + question['category']  + '</p><p class="question__card__question">' + question['question'] + '</p></div>');


	if (question['type'] == "multiple") {
		var answers = question['incorrect_answers'];
		answers.push(question['correct_answer']);
	
		for (var index = 0; index < answers.length; index++) {
			answersContainer.append('<button>' + answers[index] + '</button>');			
		}
		// for (var i = ul.children.length; i >= 0; i--) {
		// 	ul.appendChild(ul.children[Math.random() * i | 0]);
		// }
		// question[''].forEach(element => {
			
		// });
		// answersContainer.append('<button>''</button>')
	}
	else {
		var answers = question['incorrect_answers'];
		answers.push(question['correct_answer']);

		for (var index = 0; index < answers.length; index++) {
			answersContainer.append('<button>' + answers[index] + '</button>');
		}
	}
}

// END QUESTIONS

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

document.addEventListener('DOMContentLoaded', function () {
	console.log("Ready!");
	GetElements();
	SetupCategories(_GETALLCATEGORIES_LINK);

	// button event listeners
	btnShoot.click(Shoot);
	btnPrefs.click(ShowPreferences);
});