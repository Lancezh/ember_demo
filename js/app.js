/**
 * Created with PyCharm.
 * User: zhaojl
 * Date: 13-9-22
 * Time: 下午5:46
 * To change this template use File | Settings | File Templates.
 */

// create app instance
window.Todos = Ember.Application.create({
    // LOGGING ROUTE CHANGES
    LOG_TRANSITIONS: true
});

//Todos.ApplicationAdapter = DS.FixtureAdapter.extend();

// use local storage
Todos.ApplicationAdapter = DS.LSAdapter.extend({
  namespace: 'todos-emberjs'
});

// routers
Todos.Router.map(function () {
    this.resource('todos', { path: '/' }, function(){
        this.route('active');
        this.route('completed');
        this.resource('detail', {path: '/todo/:todo_id'});
    });

});

// naming conventions
Todos.TodosRoute = Ember.Route.extend({
    model: function () {
//        console.log(this.store.find('todo'));
        return this.store.find('todo');
    }
});

Todos.TodosIndexRoute = Ember.Route.extend({
    model: function () {
//        console.log(this.modelFor('todos'));
        return this.modelFor('todos');
    }
});

Todos.TodosActiveRoute = Ember.Route.extend({
    model: function () {
        return this.store.filter('todo', function (todo) {
            console.log(todo);
            return !todo.get('isCompleted');
        });
    },

    renderTemplate: function (controller) {
        this.render('todos/index', {controller: controller});
    }
});

Todos.TodosCompletedRoute = Ember.Route.extend({
    model: function () {
        return this.store.filter('todo', function (todo) {
            return todo.get('isCompleted');
        });
    },

    renderTemplate: function (controller) {
        this.render('todos/index', {controller: controller});
    }
});

//Todos.TodoRoute = Ember.Route.extend({
//    model: function(params){
//        return this.store.find('todo', params.todo_id);
//    }
//
//});

// models
Todos.Todo = DS.Model.extend({
    title: DS.attr('string'),
    isCompleted: DS.attr('boolean')
});

//Todos.Todo.FIXTURES = [
//    {
//        id: 1,
//        title: 'Learn Ember.js',
//        isCompleted: true
//    },
//    {
//        id: 2,
//        title: '...',
//        isCompleted: false
//    },
//    {
//        id: 3,
//        title: 'Profit!',
//        isCompleted: false
//    }
//];

// controllers
Todos.TodosController = Ember.ArrayController.extend({
    actions: {
        createTodo: function () {
            // Get the todo title set by the "New Todo" text field
            var title = this.get('newTitle');
            if (!title.trim()) {
                return;
            }

            // Create the new Todo model
            var todo = this.store.createRecord('todo', {
                id: +new Date(),
                title: title,
                isCompleted: false
            });

            // Clear the "New Todo" text field
            this.set('newTitle', '');

            // Save the new model
            todo.save();
        },

        clearCompleted: function () {
            var completed = this.filterProperty('isCompleted', true);
            completed.invoke('deleteRecord');
            completed.invoke('save');
        }
    },

    remaining: function () {
        return this.filterProperty('isCompleted', false).get('length');
    }.property('@each.isCompleted'),

    completed: function () {
        return this.filterProperty('isCompleted', true).get('length');
    }.property('@each.isCompleted'),

    inflection: function () {
        var remaining = this.get('remaining');
        return remaining === 1 ? 'item' : 'items';
    }.property('remaining'),

    hasCompleted: function () {
        return this.get('completed') > 0;
    }.property('completed'),

    allAreDone: function (key, value) {
        if (value === undefined) {
            return !!this.get('length') && this.everyProperty('isCompleted', true);
        } else {
            this.setEach('isCompleted', value);
            this.invoke('save');
            return value;
        }
    }.property('@each.isCompleted')

});

Todos.TodoController = Ember.ObjectController.extend({
    actions: {
        editTodo: function () {
            this.set('isEditing', true);
        },

        acceptChanges: function () {
            this.set('isEditing', false);
            this.get('model').save();
        },

        removeTodo: function () {
            var todo = this.get('model');
            todo.deleteRecord();
            todo.save();
        }
    },

    isCompleted: function (key, value) {
        var model = this.get('model');

        if (value === undefined) {
            // property being used as a getter
            return model.get('isCompleted');
        } else {
            // property being used as a setter
            model.set('isCompleted', value);
            model.save();
            return value;
        }
    }.property('model.isCompleted'),

    isEditing: false
});

// views
Todos.EditTodoView = Ember.TextField.extend({
    didInsertElement: function () {
        this.$().focus();
    }
});

Ember.Handlebars.helper('edit-todo', Todos.EditTodoView);