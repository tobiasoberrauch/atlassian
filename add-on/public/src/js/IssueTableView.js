window.IssueTableView = function() {
    return {
        setTitle: function(config) {
            if (config) {
                AP.require(['jira'], function(jira) {
                    jira.setDashboardItemTitle(config.title);
                });
            } else {
                AP.require(['jira'], function(jira) {
                    jira.setDashboardItemTitle('Issues in project');
                });
            }
        },
        template: function(value) {
            return _.template($('#issuesTableTemplate').html())(value);
        },
        rowTemplate: function(issue) {
            return _.template($('#issueTableRow').html())(issue);
        },
        render: function(configuration) {
            $('#issues-in-project').html(this.template());
            this.setTitle(configuration);
            var that = this;
            new IssueSearchService().getIssues(configuration.project, function(issues) {
                var issueTable = $('#issuesTable');
                $.each(issues, function(i, $issue) {
                    issueTable.append(that.rowTemplate({issue: $issue}));
                });
            });
        }
    }
};