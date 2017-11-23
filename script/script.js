var _AMOUNT_QUESTIONS = 1;

var _GETALLCATEGORIES_LINK = 'https://opentdb.com/api_category.php';
var _GETQUESTION_LINK = 'https://opentdb.com/api.php?amount=' + _AMOUNT_QUESTIONS;

var cboCategory,
	cboDifficulty,
	cboType,
	btnShoot,
	btnPrefs,
	sectPrefs,
	sectQuestions;

// SETUP
function GetElements(){
	cboCategory = $('#cboCategory');
	cboDifficulty = $('#cboDifficulty');
	cboType = $('#cboType');
	btnShoot = $('#btnShoot');
	btnPrefs = $('#btnPrefs');
	sectPrefs = $('.main__content__preferences');
	sectQuestions = $('.main__content__question');
}

// CATEGORIES
function SetupCategories(requestLink){
	$.getJSON(requestLink, function(data){
		ShowCategories(data);
	})
}

function ShowCategories(categoriesData){
	var categories = categoriesData['trivia_categories'];
	categories = SortCategories(categories);

	FillCategoriesComboBox(categories);
}

function SortCategories(unsortedCategories) {
	function compare(a,b) {
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
		if (i !== undefined){
			itemval += '<option value="' + categories[i]['id'] + '">' + categories[i]['name'] + '</option>';
		}
	}
	cboCategory.append(itemval);​
}
// END CATEGORIES

// QUESTIONS
function Shoot(){
	var properties = {
		category: cboCategory.val(),
		difficulty: cboDifficulty.val(),
		type: cboType.val()
	};
	
	var question = GetQuestion(GetUrlQuestion(properties));
	ShowQuestion(question);
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
		if (data['response_code'] == 0){
			// SUCCES
			return data;
		}
		else{
			// OTHER STATUS CODE
			console.log("Error, try again");
			return null;
		}
	})
}

function ShowQuestion(question) {
	sectQuestions.append("<p>Test</p>");
}


// END QUESTIONS

// MISC
function ShowPreferences(){
	if ( sectPrefs.css('visibility') == 'hidden' )
		sectPrefs.css('visibility','visible');
	else
		sectPrefs.css('visibility','hidden');
}

document.addEventListener( 'DOMContentLoaded', function() {
	console.log("Ready!");
	GetElements();
	SetupCategories(_GETALLCATEGORIES_LINK);

	// button event listeners
	btnShoot.click(Shoot);
	btnPrefs.click(ShowPreferences);
});