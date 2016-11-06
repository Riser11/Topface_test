window.onload = function () {
	//Константы
	const textarea = document.getElementById("input_textarea");
	const confirm = document.getElementById("confirm");
	const notediv = document.getElementById("note_list_div");
	const tagdiv = document.getElementById("tag_list_div");
	//Переменные
	let filters = []
	let tags = [];
	let notes = [];
	let filtredNotes = [];
	let choosenTag = document.getElementsByClassName("choosenTag");
	let taglist = document.getElementsByClassName("tag");
	let notelist = document.getElementsByClassName("note");
	let delete_buttons = document.getElementsByClassName("menu_show");
	let start;
	let stop;
	let clas = 'tag';
	//Функции
	//Функция обновления отображения
	function refresh() {
		notediv.innerHTML = '<b>Список заметок</b>';
		//Отображение списка заметок без фильтров	
		if (filters.length == 0) {
			for (i in notes) {
				let num = Number(i) + 1;
				notediv.innerHTML += `<p class="note" id="n${i}"> ${num}) ${notes[i]}
<span class='menu_hide'><img class="delete_button" src="http://lada110atricom.ru/images/slovoed/14.jpg"></span></p>`;
			}
			for (i in notelist) {
				notelist[i].onmouseover = menu_call;
				notelist[i].onmouseout = menu_hide;
			}
		}
		//Отображение списка заметок с фильтрами	
		else {
			filtredNotes = [];
			for (i in filters) {
				for (x in notes) {
					let startPos = 0;
					while (true) {
						if (notes[x].substring(startPos, startPos + filters[i].length) == filters[i]) {
							filtredNotes.push(notes[x]);
						}
						startPos++;
						if (startPos + filters[i].length > notes[x].length) {
							break;
						}
					}
				}
			}
			for (i in filtredNotes) {
				let num = Number(i) + 1;
				notediv.innerHTML += `<p class="note" id="n${i}"> ${num}) ${filtredNotes[i]}
<span class='menu_hide'><img class="delete_button" src="http://lada110atricom.ru/images/slovoed/14.jpg"></span></p>`;
			}
			for (i in notelist) {
				notelist[i].onmouseover = menu_call;
				notelist[i].onmouseout = menu_hide;
			}
		}
		//Отображение списка тегов, независимо от фильтров	
		tagdiv.innerHTML = '<b>Список тегов</b>';
		for (i in tags) {
			clas = 'tag';
			for (x in filters) {
				if (tags[i] == filters[x]) {
					clas = 'choosenTag';
				}
			}
			tagdiv.innerHTML += `<p class="${clas}" id="t${i}">${tags[i]}
<span class='menu_hide'><img class="delete_button" src="http://lada110atricom.ru/images/slovoed/14.jpg"></span></p>`;
		}
		for (i in taglist) {
			taglist[i].onmouseover = menu_call;
			taglist[i].onmouseout = menu_hide;
			taglist[i].onclick = chooseToFilter;
		}
		for (i in choosenTag) {
			choosenTag[i].onmouseover = menu_call;
			choosenTag[i].onmouseout = menu_hide;
			choosenTag[i].onclick = chooseToFilter;
		}
		tags_check();
	}
	//Функция удаления тэга или заметки
	function del() {
		let id = this.parentElement.id.substring(1, this.parentElement.id.length);
		let type = this.parentElement.id.substring(0, 1);
		if (type == 't') {
			tags.splice(id, 1)
		}
		if (type == 'n') {
			notes.splice(id, 1);
		}
		if (type != 'n' && type != 't') {
			console.log('err')
		}
		refresh()
	}
	//Функции отображения / скрытия меню
	function menu_call() {
		this.childNodes[1].className = 'menu_show';
		this.childNodes[1].onclick = del;
	}

	function menu_hide() {
		this.childNodes[1].className = 'menu_hide';
	}
	//Функция, срабатывающая на нажатие кнопки добавить, заполняет массивы данными, которые затем используются в функции отображения
	function add() {
		notes.push(textarea.value);
		let text = textarea.value;
		let isexist = 0;
		if (text.indexOf('#') != -1) {
			start = text.indexOf('#');
			if (text.indexOf(' ', text.indexOf('#')) == -1) {
				stop = text.length;
			}
			else {
				stop = text.indexOf(' ', text.indexOf('#'))
			}
			for (i in tags) {
				if (tags[i] == textarea.value.substring(start, stop)) {
					isexist = 1;
					console.log('This tag is already exist');
				}
			}
			if (isexist == 0) {
				tags.push(textarea.value.substring(start, stop));
				refresh();
			}
		}
		textarea.value = '';
		textarea.placeholder = "Здесь могла бы быть ваша заметка...";
		refresh()
	}
	//Функция проверяет текст на наличие тэгов
	function tags_check() {
		let isexist = 0;
		let text = textarea.value;
		if (event.key == ' ') {
			if (text.indexOf('#') != -1) {
				start = text.indexOf('#');
				if (text.indexOf(' ', text.indexOf('#')) == -1) {
					stop = text.length;
				}
				else {
					stop = text.indexOf(' ', text.indexOf('#'))
				}
				for (i in tags) {
					if (tags[i] == textarea.value.substring(start, stop)) {
						isexist = 1;
						console.log('This tag is already exist');
					}
				}
				if (isexist == 0) {
					tags.push(textarea.value.substring(start, stop));
					refresh();
				}
			}
		}
	}
	//Функция управления массивом фильтров
	function chooseToFilter() {
		let isSet = false;
		let filTag = this.textContent.substring(0, this.textContent.length - 1)
		for (i in filters) {
			if (filTag == filters[i]) {
				filters.splice(i, 1);
				isSet = true;
			}
		}
		if (isSet == false) {
			filters.push(filTag);
		}
		refresh();
	}
//Убираем переход на новую строку по нажатию клавиши энтер
	function ent() {
		if (event.key == 'Enter') {
			event.preventDefault();
		}
	}
	//Прикрепление функций, необходимых для начала работы
	confirm.onclick = add;
	textarea.onkeyup = tags_check;
	textarea.onkeydown = ent;
}