Future = Npm.require('fibers/future');


Meteor.methods({
    'getInstragramPics': function (query, maxTagId) {
        var future = new Future;

        var params = {
            client_id: "2ad207994fcc4372bd413099883cefb2"
        };

        if (maxTagId != null)
            params.max_tag_id = maxTagId;

        var url = 'https://api.instagram.com/v1/tags/' + query + '/media/recent';

        var response = HTTP.get(url, {
            params: params
        });

        if(response)
            future.return(response);

        return future.wait();
    }
});
