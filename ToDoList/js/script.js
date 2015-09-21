var toDoList = {
    taskTitle: $('#task-title'),
    taskBody: $('#task-body'),
    list: $('.task-list'),
    taskHolderInList: "",

    addTaskBtn: $('#add-task'),
    saveChangesBtn: $('.save-changes'),
    deleteTaskBtn: $('.delete-task'),

    listClassName: {
        holder: ".list-group-item",
        title: ".list-group-item-heading",
        body: ".list-group-item-text"
    },

    modalClassName: {
        title: ".task-title-in-modal",
        body: ".task-body-in-modal"
    },

    taskTemplate: _.template($('#task-item-template').html()),
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

// handle add mode
toDoList.addTaskBtn.on('click', function () {
    var formGroup = toDoList.taskTitle.closest('.form-group');

    if (toDoList.taskTitle.val()) {

        toDoList.list.append(toDoList.taskTemplate({
            title: toDoList.taskTitle.val(),
            body: toDoList.taskBody.val() || 'No description'
        }));

        toDoList.taskTitle.val("");
        toDoList.taskBody.val("");

        formGroup.removeClass("has-error");

        toDoList.toggleEmptyLisTMsg();

    } else {
        formGroup.addClass("has-error");
    }
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

