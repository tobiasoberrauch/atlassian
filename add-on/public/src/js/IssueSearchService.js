window.IssueSearchService = function() {
    return {
        getIssues: function(project, callback) {
            AP.require(['request'], function(request) {
                request({
                    url: '/rest/api/2/search?jql=' + encodeURIComponent('project = ' + project),
                    success: function(response) {
                        var issues = JSON.parse(response).issues;
                        callback(issues);
                    }
                });
            });
        }
    }
};