Templates = {};
Templates.suggestionItem = [
    '<li class="list-group-item suggestion-item"><%-item%></li>'
].join("\n");

Templates.taskItem = [
    '<li class="list-group-item task-item">',
    '<h4 class="list-group-item-heading task-header"><%-title%></h4>',
    '<p class="list-group-item-text task-text"><%-body%></p>',
    '<span class="control">',
    '<a class="label label-warning edit" href="#" data-toggle="modal" data-target="#modal-edit">Edit</a>',
    '<a class="label label-danger delete" href="#" data-toggle="modal" data-target="#modal-delete">Delete</a>',
    '</span>',
    '</li>'
].join("\n");

var autoSuggestion = (function () {
    var sourceArr = [];
    var status = false;

    var domElements = {
        listHolder: "",
        inputEl: "",
        tmpl: ""
    };

    var setSourceData = function (data) {
        if (data) {
            sourceArr = data;
        }
    };

    var collectElements = function (elements) {
        if (elements) {
            domElements.listHolder = elements.root;
            domElements.inputEl = elements.input;
            domElements.tmpl = _.template(elements.tmpl);
            status = true;
            return domElements;
        }
    };

    var getSuggestionsList = function (itemValue) {
        if (sourceArr.length > 0 && itemValue.length > 1) {
            var suggestionsArr = [];
            for (var i = 0; i < sourceArr.length; i++) {
                if (sourceArr[i].indexOf(itemValue) !== -1) {
                    if ($.inArray(sourceArr[i], suggestionsArr) === -1) {
                        suggestionsArr.push(sourceArr[i].slice(sourceArr[i].indexOf(itemValue)));
                    }
                }
            }
            return suggestionsArr;
        }
    };

    var setSuggestion = function (inputEl, suggestEl) {
        inputEl.val(suggestEl.text());
        domElements.inputEl.focus();
    };

    var clearSuggestions = function (listHolder) {
        listHolder.children().remove();
    };

    var displaySuggestion = function (listHolder, res) {
        clearSuggestions(listHolder);
        if (res) {
            res.forEach(function (item) {
                listHolder.append(domElements.tmpl({item:item})
                    //'<li class="list-group-item suggestion-item">' + item + '</li>'
                );
            });
        }
    };

    var handleEvent = function () {
        return {
            oninputInInput: function (sourceData) {
                if (status) {
                    setSourceData(sourceData);
                    displaySuggestion(domElements.listHolder, getSuggestionsList(domElements.inputEl.val()));
                }
            },
            onclickInSuggestion: function (context) {
                if (status) {
                    setSuggestion(domElements.inputEl, context);
                    clearSuggestions(domElements.listHolder);
                }
            }
        }
    };

    return {
        collectElements: collectElements,
        //setSourceData: setSourceData,
        //getSuggestionsList: getSuggestionsList,
        //displaySuggestion: displaySuggestion,
        clearSuggestions: clearSuggestions,
        //setSuggestion: setSuggestion,
        handleEvent: handleEvent
    }

})();

var elements = autoSuggestion.collectElements({
    root: $('.suggestions-list'),
    input: $('#task-title'),
    tmpl: Templates.suggestionItem
});

elements.listHolder.on('click', '.list-group-item', function () {
    autoSuggestion.handleEvent().onclickInSuggestion($(this));
});
elements.inputEl.on('input', function () {
    autoSuggestion.handleEvent().oninputInInput(array);
});

var toDoList = {
    taskTitle: $('#task-title'),
    taskBody: $('#task-body'),
    list: $('.task-list'),
    taskHolderInList: "",

    addTaskBtn: $('#add-task'),
    saveChangesBtn: $('.save-changes'),
    deleteTaskBtn: $('.delete-task'),

    listClassName: {
        holder: ".task-item",
        title: ".task-header",
        body: ".task-text"
    },

    modalClassName: {
        title: ".task-title-in-modal",
        body: ".task-body-in-modal"
    },

    taskTemplate:_.template(Templates.taskItem),
        //_.template($('#task-item-template').html()),
    emptyListMsgEl: $('.no-task')
};

/**
 *
 */
toDoList.toggleEmptyLisTMsg = function () {
    if (toDoList.list.children().length > 0) {
        toDoList.emptyListMsgEl.hide();
    } else {
        toDoList.emptyListMsgEl.show();
    }
};

/**
 * @param {String} taskHolderInList - class name for item holder in list (dom structure)
 * @param {Object} taskElName - consist class names for the task in list
 * @return {Object} - task content: title, body
 */
toDoList.getTask = function (taskHolderInList, taskElName) {
    return {
        title: taskHolderInList.find(taskElName.title).text(),
        body: taskHolderInList.find(taskElName.body).text()
    }
};

/**
 * @param {Object} task - task content: title, body
 * @param {Object} taskHolderClassInModal - consist class names for the task in modal
 */
toDoList.copyTaskToModal = function (task, taskHolderClassInModal) {
    $(taskHolderClassInModal.title).val(task.title);
    $(taskHolderClassInModal.body).val(task.body);
};

/**
 * @param {String} taskHolderInList - class name for item holder in list (dom structure)
 * @param {Object} taskElName - consist class names for the task in list
 * @param {Object} taskHolderClassInModal - consist class names for the task in modal
 */
toDoList.updateTask = function (taskHolderInList, taskElName, taskHolderClassInModal) {
    var titleVal = $(taskHolderClassInModal.title).val(),
        bodyVal = $(taskHolderClassInModal.body).val() || 'No description';

    if (titleVal) {
        taskHolderInList.find(taskElName.title).text(titleVal);
        taskHolderInList.find(taskElName.body).text(bodyVal);
    }
    else {
        taskHolderInList.remove();
    }
};

// check is list empty
toDoList.toggleEmptyLisTMsg();
var array = [];


// handle add mode
toDoList.addTaskBtn.on('click', function () {
    autoSuggestion.clearSuggestions(elements.listHolder);
    var formGroup = toDoList.taskTitle.closest('.form-group');

    if (toDoList.taskTitle.val()) {

        var objTask = {
            title: toDoList.taskTitle.val(),
            body: toDoList.taskBody.val() || 'No description'
        };

        toDoList.list.append(toDoList.taskTemplate(objTask));

        array.push(objTask.title);

        toDoList.taskTitle.val("");
        toDoList.taskBody.val("");

        formGroup.removeClass("has-error");

        toDoList.toggleEmptyLisTMsg();

    } else {
        formGroup.addClass("has-error");
    }
    //console.log(array);
    return false;
});


// handle edit mode
toDoList.list.on('click', '.edit', function () {
    toDoList.taskHolderInList = $(this).closest(toDoList.listClassName.holder);

    var task = toDoList.getTask(toDoList.taskHolderInList, toDoList.listClassName);
    toDoList.copyTaskToModal(task, toDoList.modalClassName);
});

toDoList.saveChangesBtn.on('click', function () {
    toDoList.updateTask(toDoList.taskHolderInList, toDoList.listClassName, toDoList.modalClassName);
    toDoList.toggleEmptyLisTMsg();
});

// handle delete mode
toDoList.list.on('click', '.delete', function () {
    toDoList.taskHolderInList = $(this).closest(toDoList.listClassName.holder);

    var task = toDoList.getTask(toDoList.taskHolderInList, toDoList.listClassName);
    toDoList.copyTaskToModal(task, toDoList.modalClassName);
});

toDoList.deleteTaskBtn.on('click', function () {
    toDoList.taskHolderInList.remove();
    toDoList.toggleEmptyLisTMsg();
});


