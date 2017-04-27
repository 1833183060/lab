require.config({

	baseUrl: "./js/components",
	paths: {

		"jquery": "jquery.2.1.4"

	}

});

require(['jquery'], function ($){

	;(function(){

		$('#add_a_keywords').on('click', function() {
			var keywords = document.getElementById('keywords').value;
				keywords = keywords.replace(/\s+/g, '');

			var formwork = '<div class="keywords_item"><button type="button" class="keywords_label">'+keywords+'</button><button id="delete_keyword" type="button" class="close">x</button></div>';
			
			if(keywords != '') {
				$('#added_keywords_area').append(formwork);
			} else {
				alert('!');
			}
			$('.keywords_item .close').unbind('click');
			$('.keywords_item .close').on('click', function() {
				$(this).parent().empty().hide();
			});

			getKeywords();
		}); //add and delete key words.

		$('#label_select_btn').click(function() {
			$('#checkbox_list').toggle();
			if($('#checkbox_list input:checked').length != 0) {
				$(this).text('已选择');
			} else {
				$(this).text('可多选');
			}

			getLabel();
		}); //select label

		$('#submit_btn').click(function() {
			//some code
		});

		function getKeywords() {
			var keywordsList = new Array();

			$('#added_keywords_area .keywords_label').each(function() {
				keywordsList.push($(this).text());
			})

			console.log(keywordsList);

			return keywordsList;
		} //output key words list

		function getLabel() {
			var labelList = new Array();

			$('#checkbox_list input:checked').each(function() {
				labelList.push($(this).attr('value'));
			})

			console.log(labelList);

			return labelList;
		} //output checked label list




	})();

});