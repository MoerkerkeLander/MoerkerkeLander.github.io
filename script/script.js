var _AMOUNT_QUESTIONS = 1;

var _GETALLCATEGORIES_LINK = "https://opentdb.com/api_category.php";
var _GETQUESTION_LINK = "https://opentdb.com/api.php?amount=" + _AMOUNT_QUESTIONS;

var cboCategory;
var cboDifficulty;
var cboType;
var btnShoot;
var btnPrefs;
var divPrefs;

// SETUP
function GetElements(){
	cboCategory = $("#cboCategory");
	cboDifficulty = $("#cboDifficulty");
	cboType = $("#cboType");
	btnShoot = $("#btnShoot");
	btnPrefs = $("#btnPrefs");
	divPrefs = $(".preferences");
}

// CATEGORIES
function SetupCategories(requestLink){
	$.getJSON(requestLink, function(data){
		ShowCategories(data);
	})
}

function ShowCategories(categoriesData){
	var categories = categoriesData["trivia_categories"];
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

function GetTriviaAPIUrl(properties) {
	var triviaQuestionAPIUrl = _GETQUESTION_LINK;
	for(var property in properties) {
		if(properties[property] != '') {
			triviaQuestionAPIUrl += '&' + property + '=' + properties[property]; 
		}
	}

	return triviaQuestionAPIUrl;
}
// END CATEGORIES

// QUESTIONS
function Shoot(){
	var properties = {
		category: cboCategory.val(),
		difficulty: cboDifficulty.val(),
		type: cboType.val()
	};
	console.log(GetTriviaAPIUrl(properties));
}


// END QUESTIONS

// MISC
function ShowPreferences(){
	if ( divPrefs.css('visibility') == 'hidden' )
		divPrefs.css('visibility','visible');
	else
		divPrefs.css('visibility','hidden');
}

document.addEventListener( 'DOMContentLoaded', function() {
	console.log("Ready!");
	GetElements();
	SetupCategories(_GETALLCATEGORIES_LINK);

	// button event listeners
	btnShoot.click(Shoot);
	btnPrefs.click(ShowPreferences);
});