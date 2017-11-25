// API SETTINGS
let _AMOUNT_QUESTIONS = 1;

let _GETALLCATEGORIES_LINK = 'https://opentdb.com/api_category.php';
let _GETQUESTION_LINK = 'https://opentdb.com/api.php?amount=' + _AMOUNT_QUESTIONS;

// ELEMENTS
let cboCategory,
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
	let categories = categoriesData['trivia_categories'];
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
	let itemval;
	for (let i = categories.length - 1; i >= 0; i--) {
		if (i !== undefined){
			itemval += '<option value="' + categories[i]['id'] + '">' + categories[i]['name'] + '</option>';
		}
	}
	cboCategory.append(itemval);​
}
// END CATEGORIES

// QUESTIONS
function Shoot(){
	let properties = {
		category: cboCategory.val(),
		difficulty: cboDifficulty.val(),
		type: cboType.val()
	};
	
	GetQuestion(GetUrlQuestion(properties));
}

function GetUrlQuestion(properties) {
	let url = _GETQUESTION_LINK;
	for (let property in properties) {
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
			ShowQuestion(data['results']);
		}
		else{
			// OTHER STATUS CODE
			console.log("Error, try again");
			return null;
		}
	})
}

function ShowQuestion(questions) {
	console.log(questions);
	let question = questions[0];

	
	if (questions['type'] == 'multiple') {
		
	}
	else{

	}
	sectQuestions.append('<p>' + question['question'] + '</p>');
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