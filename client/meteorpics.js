Pics = new Meteor.Collection(null)
Meteor.subscribe('pics');

Meteor.startup(function() {
    GAnalytics.pageview();
    Session.setDefault('searching', 1);
    Session.setDefault('paginate', 0);
    Session.set('query', 'meteorjs');
    Session.set('maxTagId', '');
    Session.set('maxTagIdTmp', '');
});

Tracker.autorun(function() {
    Meteor.call('getInstragramPics', Session.get('query'), Session.get('maxTagId'), function(error, result){
        if(result) {
            Session.set('maxTagIdTmp', result.data.pagination.next_max_tag_id);
            _.each(result.data.data, function (img) {
                var doc = {
                    thumb: img.images.low_resolution.url
                }
                Pics.insert(doc);
            });
            Session.set('searching', 0);
            Session.set('paginate', 0);
        }
    });
});

Template.meteorpics.helpers({
    pics: function() {
        return Pics.find();
    },
    searching: function() {
        return Session.get('searching');
    },
    paginate: function() {
        return Session.get('paginate');
    },
    search: function () {
        return Session.get('query');
    },
    next: function() {
        return Session.get('maxTagIdTmp');
    }
});

Template.meteorpics.events({
    'submit form': function(event, template) {
        event.preventDefault();
        var query = template.$('input[type=search]').val();
        if (query) {
            Session.set('searching', 1);
            Pics.remove({});
            Session.set('maxTagId', '');
            Session.set('query', query);
        }
    },
    'click .get-more': function (event, template) {
        event.preventDefault();
        var next = template.$('input[type=hidden]').val();
        if (next) {
            Session.set('paginate', 1);
            Session.set('maxTagId', next);
        }
    }
});

Template.meteorpics.rendered = function() {
}