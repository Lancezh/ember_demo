/**
 * Created with PyCharm.
 * User: zhaojl
 * Date: 13-9-22
 * Time: 下午5:46
 * To change this template use File | Settings | File Templates.
 */

// create app instance
window.Todos = Ember.Application.create();

Todos.ApplicationAdapter = DS.FixtureAdapter.extend();

// routers
Todos.Router.map(function () {
    this.resource('todos', { path: '/' });
});

// naming conventions
Todos.TodosRoute = Ember.Route.extend({
    model: function () {
        return this.store.find('todo');
    }
});

// models
Todos.Todo = DS.Model.extend({
    title: DS.attr('string'),
    isCompleted: DS.attr('boolean')
});

Todos.Todo.FIXTURES = [
    {
        id: 1,
        title: 'Learn Ember.js',
        isCompleted: true
    },
    {
        id: 2,
        title: '...',
        isCompleted: false
    },
    {
        id: 3,
        title: 'Profit!',
        isCompleted: false
    }
];

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
                title: title,
                isCompleted: false
            });

            // Clear the "New Todo" text field
            this.set('newTitle', '');

            // Save the new model
            todo.save();
        }
    }
});