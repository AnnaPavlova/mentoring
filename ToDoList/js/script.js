Templates = {
    suggestionItem: [
        '<li class="list-group-item suggestion-item"><%-item%></li>'
    ].join("\n"),

    taskItem: [
        '<li class="list-group-item task-item">',
        '<h4 class="list-group-item-heading task-header"><%-title%></h4>',
        '<p class="list-group-item-text task-text"><%-body%></p>',
        '<span class="control">',
        '<a class="label label-warning edit" href="#" data-toggle="modal" data-target="#modal-edit">Edit</a>',
        '<a class="label label-danger delete" href="#" data-toggle="modal" data-target="#modal-delete">Delete</a>',
        '</span>',
        '</li>'
    ].join("\n")
};

var autoSuggestion = (function () {
    var sourceArr = [];
    var status = false;

    var domElements = {
        listHolder: "",
        inputElHolder: "",
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
            domElements.inputElHolder = elements.inputHolder;
            domElements.inputEl = elements.input;
            domElements.tmpl = _.template(elements.tmpl);
            status = true;
            return domElements;
        }
    };

    var getElements = function () {
      return domElements;
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
        hideSuggestionsHolder(listHolder, true);
    };

    var hideSuggestionsHolder = function (listHolder, flag) {
        if (listHolder.children().length > 0 && flag === false) {
            listHolder.show();
        } else {
            listHolder.hide();
        }
    };

    var displaySuggestion = function (listHolder, res) {
        clearSuggestions(listHolder);
        if (res) {
            res.forEach(function (item) {
                listHolder.append(domElements.tmpl({item: item})
                    //'<li class="list-group-item suggestion-item">' + item + '</li>'
                );
            });
            hideSuggestionsHolder(listHolder, false);
        }
    };

    var handleEvent = function () {
        return {
            getSuggestionsByData: function (sourceData) {
                if (status) {
                    setSourceData(sourceData);
                    displaySuggestion(domElements.listHolder, getSuggestionsList(domElements.inputEl.val()));
                }
            },

            selectSuggestion: function (context) {
                if (status) {
                    setSuggestion(domElements.inputEl, context);
                    clearSuggestions(domElements.listHolder);
                }
            },

            closeSuggestionListByEvent: function (event) {
                if (domElements.inputElHolder.has(event.target).length === 0 || event.keyCode === 27) {
                    hideSuggestionsHolder(domElements.listHolder, true);
                }
            }
        }
    };

    return {
        collectElements: collectElements,
        hideSuggestionsHolder: hideSuggestionsHolder,
        //setSourceData: setSourceData,
        //getSuggestionsList: getSuggestionsList,
        //displaySuggestion: displaySuggestion,
        clearSuggestions: clearSuggestions,
        //setSuggestion: setSuggestion,
        handleEvent: handleEvent,
        getElements: getElements
    }

})();

var elements = autoSuggestion.collectElements({
    root: $('.suggestions-list'),
    inputHolder: $(".title-holder"),
    input: $('#task-title'),
    tmpl: Templates.suggestionItem
});

autoSuggestion.hideSuggestionsHolder(elements.listHolder, true);

$(document).on("click", function (e) {
    autoSuggestion.handleEvent().closeSuggestionListByEvent(e);
});

elements.inputEl.on("keydown", function (e) {
    autoSuggestion.handleEvent().closeSuggestionListByEvent(e);
});

elements.listHolder.on('click', '.list-group-item', function () {
    autoSuggestion.handleEvent().selectSuggestion($(this));
});

elements.inputEl.on('input click', function () {
    autoSuggestion.handleEvent().getSuggestionsByData(toDoListAPI.getAllTitles());
});





var toDoListAPI = (function (autoSuggestion) {
    var array = [];
    var taskTemplate = _.template(Templates.taskItem);

    var domElements = {
        taskTitle: " /*jquery obj, input for task title*/ ",
        taskBody: " /*jquery obj, textarea for task body*/ ",
        taskTitleHolder: " /*jquery obj, parent for taskTitle*/ ",
        tasksListHolder: " /*jquery obj, root node for added tasks*/ ",
        //
        taskHolder: " /*do not need to add, root node for selected task*/ ",

        addTaskBtn: " /*jquery obj, btn which handle addition*/ ",
        saveChangesBtn: " /*jquery obj, btn which handle saving changes after editing*/ ",
        deleteTaskBtn: " /*jquery obj, btn which handle deleting task*/ ",

        tasksListClassName: {
            holder: " /*class name, holder for each of added task*/ ",
            title: " /*class name, title for each of added task*/ ",
            body: "  /*class name, body for each of added task*/ "
        },

        modalClassName: {
            title: " /*class name, title for selected task in modal*/ ",
            body: " /*class name, body for selected task in modal*/ "
        },

        //taskTemplate: " /*lodash template, mast consist _.template(Templates.taskItem)*/ ",
        //_.template($('#task-item-template').html()),
        emptyListMsgEl: " /*jquery obj, holder for message, when toDo is empty*/ "
    };

    var getConfigObj = function () {
        return JSON.stringify(domElements);
    };

    var collectElements = function (elements) {
        if (elements) {
            domElements = elements;
            return domElements;
        }
    };

    var toggleEmptyLisTMsg = function () {
        if (domElements.tasksListHolder.children().length > 0) {
            domElements.emptyListMsgEl.hide();
        } else {
            domElements.emptyListMsgEl.show();
        }
    };

    /**
     * @param {String} taskHolderInList - class name for item holder in list (dom structure)
     * @param {Object} taskElName - consist class names for the task in list
     * @return {Object} - task content: title, body
     */
    var getTask = function (taskHolderInList, taskElName) {
        return {
            title: taskHolderInList.find(taskElName.title).text(),
            body: taskHolderInList.find(taskElName.body).text()
        }
    };

    /**
     * @param {Object} task - task content: title, body
     * @param {Object} taskHolderClassInModal - consist class names for the task in modal
     */
    var copyTaskToModal = function (task, taskHolderClassInModal) {
        $(taskHolderClassInModal.title).val(task.title);
        $(taskHolderClassInModal.body).val(task.body);
    };
    /**
     * @param {String} taskHolderInList - class name for item holder in list (dom structure)
     * @param {Object} taskElName - consist class names for the task in list
     * @param {Object} taskHolderClassInModal - consist class names for the task in modal
     */
    var updateTask = function (taskHolderInList, taskElName, taskHolderClassInModal) {
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

    var handleEvents = function () {
        return {
            addMode: function () {

                autoSuggestion.clearSuggestions(autoSuggestion.getElements().listHolder);

                if (domElements.taskTitle.val()) {

                    var objTask = {
                        title: domElements.taskTitle.val(),
                        body: domElements.taskBody.val() || 'No description'
                    };
                    domElements.tasksListHolder.append(taskTemplate(objTask));

                    array.push(objTask.title);

                    domElements.taskTitle.val("");
                    domElements.taskBody.val("");

                    domElements.taskTitleHolder.removeClass("has-error");

                    toggleEmptyLisTMsg();

                } else {
                    domElements.taskTitleHolder.addClass("has-error");
                }
            },
            copyMode: function (context) {
                domElements.taskHolder = $(context).closest(domElements.tasksListClassName.holder);

                var task = getTask(domElements.taskHolder, domElements.tasksListClassName);

                copyTaskToModal(task, domElements.modalClassName);

            },
            editMode: function () {
                updateTask(domElements.taskHolder, domElements.tasksListClassName, domElements.modalClassName);
                toggleEmptyLisTMsg();
            },
            deleteMode: function () {
                domElements.taskHolder.remove();
                toggleEmptyLisTMsg();
            }
        }


    };
    var getAllTitles = function () {
        return array;
    };

    return {
        getConfigObj: getConfigObj,
        collectElements: collectElements,
        handleEvents: handleEvents,
        getAllTitles: getAllTitles
    }

})(autoSuggestion);

var elToDo = toDoListAPI.collectElements({
    taskTitle: $('#task-title'),
    taskBody: $('#task-body'),
    taskTitleHolder: $(".title-holder"),
    tasksListHolder: $('.task-list'),

    taskHolder: "",

    addTaskBtn: $('#add-task'),
    saveChangesBtn: $('.save-changes'),
    deleteTaskBtn: $('.delete-task'),

    tasksListClassName: {
        holder: ".task-item",
        title: ".task-header",
        body: ".task-text"
    },

    modalClassName: {
        title: ".task-title-in-modal",
        body: ".task-body-in-modal"
    },

    emptyListMsgEl: $('.no-task')
});

elToDo.addTaskBtn.on('click', function () {
    toDoListAPI.handleEvents().addMode();
    return false;
});

elToDo.tasksListHolder.on('click', '.edit', function () {
    toDoListAPI.handleEvents().copyMode(this);
});

elToDo.saveChangesBtn.on('click', function () {
    toDoListAPI.handleEvents().editMode();
});

elToDo.tasksListHolder.on('click', '.delete', function () {
    toDoListAPI.handleEvents().copyMode(this);
});

elToDo.deleteTaskBtn.on('click', function () {
    toDoListAPI.handleEvents().deleteMode();
});

