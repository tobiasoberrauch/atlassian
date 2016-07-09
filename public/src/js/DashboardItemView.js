window.DashboardItemView = function() {
    return {
        render: function() {
            var service = new window.DashboardItemConfigurationService();
            service.isConfigured(function(config) {
                new window.IssueTableView().render(config)
            }, function() {
                new window.DashboardItemConfigurationView().render();
            });
        }
    }
};