/**
 * autoSuggestionAPI - module, allows to form suggestions list by entry data
 * @return {Object} autoSuggestionAPI - consists public methods
 *  * @return autoSuggestionAPI.getConfigObj
 *  * @return autoSuggestionAPI.collectElements
 *  * @return autoSuggestionAPI.getElements
 *  * @return autoSuggestionAPI.hideSuggestionsHolder
 *  * @return autoSuggestionAPI.clearSuggestions
 *  * @return autoSuggestionAPI.handleEvent
 *  * @return autoSuggestionAPI.setSuggestion
 *  * @return autoSuggestionAPI.setSourceData
 *  * @return autoSuggestionAPI.getSuggestionsList
 *  * @return autoSuggestionAPI.displaySuggestion
 */
var autoSuggestionAPI = (function () {
    // suggestions will be formed based on source array data
    var sourceArr = [];

    // if DOM elements collected (all fields of configuration object domElements filled in) - status is true
    var status = false;

    // configuration object that consists templates for module
    var Templates = {
        suggestionItem: [
            '<a href="#" class="list-group-item list-group-item-info suggestion-item"><%-item%></a>'
        ].join("\n")
    };

    // function, lodash template for suggestion item
    var formSuggestionItem = _.template(Templates.suggestionItem);

    // configuration object that consists elements for manipulating the DOM
    var domElements = {
        listHolder: " /*jquery obj, root node for suggestions list, hold suggestions*/ ",
        inputElHolder: " /*jquery obj, parent for entry field*/ ",
        inputEl: " /*entry field for which will display suggestions*/ "
    };

    /**
     * @method getConfigObj
     * @return {String} - configuration object in string that consists elements for manipulating the DOM
     */
    var getConfigObj = function () {
        return JSON.stringify(domElements);
    };

    /**
     * @method setSourceData
     * @param {Array} data - suggestions will be formed based on data
     */
    var setSourceData = function (data) {
        if (data) {
            sourceArr = data;
        }
    };

    /**
     * @method collectElements
     * @param {Object} obj - configuration object that consists elements for manipulating the DOM
     * @return {Object} domElements
     */
    var collectElements = function (obj) {
        if (obj) {
            domElements = obj;
            status = true;
            return domElements;
        }
    };

    /**
     * @method getElements
     * @return {Object} domElements - configuration object that consists elements for manipulating the DOM
     */
    var getElements = function () {
        return domElements;
    };

    /**
     * @method getSuggestionsList
     * @param {String} itemValue - value from entry field
     * @return {Array} suggestionsArr - suggestions to complete value from entry field
     */
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

    /**
     * @method setSuggestion - set suggestion to entry field
     * @param {Object} inputEl - entry field, jquery object
     * @param {Object} suggestEl - element which hold suggestion, jquery object
     */
    var setSuggestion = function (inputEl, suggestEl) {
        inputEl.val(suggestEl.text());
        domElements.inputEl.focus();
    };

    /**
     * @method clearSuggestions - delete suggestions and hide suggestions holder
     * @param {Object} listHolder - suggestions list holder, jquery object
     */
    var clearSuggestions = function (listHolder) {
        listHolder.children().remove();
        hideSuggestionsHolder(listHolder, true);
    };

    /**
     * @method hideSuggestionsHolder - hide suggestions holder
     * @param {Object} listHolder - suggestions list holder, jquery object
     * @param {Boolean} flag - allow hide suggestions holder, when suggestions list is not empty
     */
    var hideSuggestionsHolder = function (listHolder, flag) {
        if (listHolder.children().length > 0 && flag === false) {
            listHolder.show();
        } else {
            listHolder.hide();
        }
    };

    /**
     * @method displaySuggestion - display suggestions
     * @param {Object} listHolder - suggestions list holder, jquery object
     * @param {Array} suggestionsArr - suggestions
     */
    var displaySuggestion = function (listHolder, suggestionsArr) {

        clearSuggestions(listHolder);
        if (suggestionsArr) {
            suggestionsArr.forEach(function (item) {
                listHolder.append(formSuggestionItem({item: item})
                );
            });
            hideSuggestionsHolder(listHolder, false);
        }
    };

    /**
     * @method handleEvent - events: getSuggestionsByData, selectSuggestion, closeSuggestionListByEvent
     * @return {Object}
     *  * @return getSuggestionsByData
     *  * @return selectSuggestion
     *  * @return closeSuggestionListByEvent
     */
    var handleEvent = function () {
        return {

            /**
             * set source array data, displayed suggestions based on source data
             * @param {Array} sourceData - suggestions will be formed based on source array data
             */
            getSuggestionsByData: function (sourceData) {
                if (status) {
                    setSourceData(sourceData);
                    displaySuggestion(domElements.listHolder, getSuggestionsList(domElements.inputEl.val()));
                }
            },

            /**
             * set suggestion to entry field, delete suggestions and hide suggestions holder
             * @param {Object} context
             */
            selectSuggestion: function (context) {
                if (status) {
                    setSuggestion(domElements.inputEl, context);
                    clearSuggestions(domElements.listHolder);
                }
            },

            /**
             * close suggestions list by events: pressing ESC or clicked area outside the suggestions list and not on entry field
             * @param {Object} event
             */
            closeSuggestionListByEvent: function (event) {
                if (domElements.inputElHolder.has(event.target).length === 0 || event.keyCode === 27) {
                    hideSuggestionsHolder(domElements.listHolder, true);
                }
            }
        }
    };

    return {
        getConfigObj: getConfigObj,
        collectElements: collectElements,
        getElements: getElements,
        hideSuggestionsHolder: hideSuggestionsHolder,
        clearSuggestions: clearSuggestions,
        handleEvent: handleEvent,

        setSuggestion: setSuggestion,
        setSourceData: setSourceData,
        getSuggestionsList: getSuggestionsList,
        displaySuggestion: displaySuggestion
    }
})();

/**
 * toDoListAPI - module, allows to create todoList; update and delete tasks in list
 * @param {String} autoSuggestionAPI - module
 * @return {Object} toDoListAPI - consists public methods
 *  * @return toDoListAPI.getConfigObj
 *  * @return toDoListAPI.collectElements
 *  * @return toDoListAPI.handleEvents
 *  * @return toDoListAPI.getAllTasks
 *  * @return toDoListAPI.getAllTitles
 */
var toDoListAPI = (function (autoSuggestionAPI) {
    // array with all tasks
    var tasksArr = [];

    // configuration object that consists templates for module
    var Templates = {
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

    // function, lodash template for task item
    var taskTemplate = _.template(Templates.taskItem);

    // configuration object that consists elements for manipulating the DOM
    var domElements = {
        taskTitle: " /*jquery obj, input for task title*/ ",
        taskBody: " /*jquery obj, textarea for task body*/ ",
        taskTitleHolder: " /*jquery obj, parent for taskTitle*/ ",
        tasksListHolder: " /*jquery obj, root node for added tasks*/ ",

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

        emptyListMsgEl: " /*jquery obj, holder for message, when toDo is empty*/ "
    };

    /**
     * @method getConfigObj
     * @return {String} - configuration object in string that consists elements for manipulating the DOM
     */
    var getConfigObj = function () {
        return JSON.stringify(domElements);
    };

    /**
     * @method collectElements
     * @param {Object} obj - configuration object that consists elements for manipulating the DOM
     * @return {Object} domElements
     */
    var collectElements = function (obj) {
        if (obj) {
            domElements = obj;
            return domElements;
        }
    };

    /**
     * @method toggleEmptyLisTMsg - toggle message when todoList is empty
     */
    var toggleEmptyLisTMsg = function () {
        if (domElements.tasksListHolder.children().length > 0) {
            domElements.emptyListMsgEl.hide();
        } else {
            domElements.emptyListMsgEl.show();
        }
    };

    /**
     * @method getTask
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
     * @method copyTaskToModal
     * @param {Object} task - task content: title, body
     * @param {Object} taskHolderClassInModal - consist class names for the task in modal
     */
    var copyTaskToModal = function (task, taskHolderClassInModal) {
        $(taskHolderClassInModal.title).val(task.title);
        $(taskHolderClassInModal.body).val(task.body);
    };

    /**
     * @method updateTask - update task data or delete task, if title is empty
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

    /**
     * @method getAllTitles
     * @return {Array}
     */
    var getAllTitles = function () {
        var titlesArr = [];
        if (tasksArr.length > 0) {
            for (var i = 0; i < tasksArr.length; i++) {
                titlesArr.push(tasksArr[i].title);
            }
            return titlesArr;
        }
    };

    /**
     * @method getAllTasks
     * @return {Array}
     */
    var getAllTasks = function () {
        return tasksArr;
    };

    /**
     * @method handleEvents - consists modes: addMode, copyMode, editMode, deleteMode
     * @return {Object}
     *  * @return addMode
     *  * @return copyMode
     *  * @return editMode
     *  * @return deleteMode
     */
    var handleEvents = function () {
        return {

            /**
             * delete suggestions and hide suggestions holder (module autoSuggestionAPI), add task to tasks list
             */
            addMode: function () {

                autoSuggestionAPI.clearSuggestions(autoSuggestionAPI.getElements().listHolder);

                if (domElements.taskTitle.val()) {
                    var objTask = {
                        title: domElements.taskTitle.val(),
                        body: domElements.taskBody.val() || 'No description'
                    };

                    domElements.tasksListHolder.append(taskTemplate(objTask));
                    tasksArr.push(objTask);

                    domElements.taskTitle.val("");
                    domElements.taskBody.val("");

                    domElements.taskTitleHolder.removeClass("has-error");

                    toggleEmptyLisTMsg();
                } else {
                    domElements.taskTitleHolder.addClass("has-error");
                }
            },

            /**
             * copy selected task to modal
             * @param {Object} context
             */
            copyMode: function (context) {
                domElements.taskHolder = $(context).closest(domElements.tasksListClassName.holder);

                var task = getTask(domElements.taskHolder, domElements.tasksListClassName);

                copyTaskToModal(task, domElements.modalClassName);
            },

            /**
             * update selected task
             */
            editMode: function () {
                updateTask(domElements.taskHolder, domElements.tasksListClassName, domElements.modalClassName);
                toggleEmptyLisTMsg();
            },

            /**
             * delete selected task
             */
            deleteMode: function () {
                domElements.taskHolder.remove();
                toggleEmptyLisTMsg();
            }
        }
    };

    return {
        getConfigObj: getConfigObj,
        collectElements: collectElements,
        handleEvents: handleEvents,
        getAllTasks: getAllTasks,
        getAllTitles: getAllTitles
    }

})(autoSuggestionAPI);


/**
 * initialization autoSuggestionAPI module
 */

// fill in configuration object, collect DOM elements
var elementsSuggestionAPI = autoSuggestionAPI.collectElements({
    listHolder: $('.suggestions-list'),
    inputElHolder: $(".title-holder"),
    inputEl: $('#task-title')
});

// hide suggestions list if exist
autoSuggestionAPI.hideSuggestionsHolder(elementsSuggestionAPI.listHolder, true);

// handle event on document, hide suggestions list if exist
$(document).on("click", function (e) {
    autoSuggestionAPI.handleEvent().closeSuggestionListByEvent(e);
});

// handle event on entry field, hide suggestions list if exist
elementsSuggestionAPI.inputEl.on("keydown", function (e) {
    autoSuggestionAPI.handleEvent().closeSuggestionListByEvent(e);
});

// handle event on suggestions list, handle selection suggestion
elementsSuggestionAPI.listHolder.on('click', '.list-group-item', function () {
    autoSuggestionAPI.handleEvent().selectSuggestion($(this));
});

// handle event on entry field, get suggestions list by entry data
elementsSuggestionAPI.inputEl.on('input click', function () {
    autoSuggestionAPI.handleEvent().getSuggestionsByData(toDoListAPI.getAllTitles());
});

/**
 * initialization toDoListAPI module
 */

// fill in configuration object, collect DOM elements
var elementstoDoListAPI = toDoListAPI.collectElements({
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

// handle event on add task button, addMode
elementstoDoListAPI.addTaskBtn.on('click', function () {
    toDoListAPI.handleEvents().addMode();
    return false;
});

// handle event on tasks list holder, handle copyMode to editMode
elementstoDoListAPI.tasksListHolder.on('click', '.edit', function () {
    toDoListAPI.handleEvents().copyMode(this);
});
// handle event on save changes button, editMode
elementstoDoListAPI.saveChangesBtn.on('click', function () {
    toDoListAPI.handleEvents().editMode();
});

// handle event on tasks list holder, handle copyMode to deleteMode
elementstoDoListAPI.tasksListHolder.on('click', '.delete', function () {
    toDoListAPI.handleEvents().copyMode(this);
});
// handle event on delete task button, deleteMode
elementstoDoListAPI.deleteTaskBtn.on('click', function () {
    toDoListAPI.handleEvents().deleteMode();
});

