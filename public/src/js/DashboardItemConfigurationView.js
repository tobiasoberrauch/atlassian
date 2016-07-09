window.DashboardItemConfigurationView = function() {
    return {
        template: function(value) {
            return _.template($('#dashboardItemConfigTemplate').html())(value);
        },
        addProjects: function(config) {
            AP.require(['request'], function(request) {
                request({
                    url: '/rest/api/2/project',
                    success: function(response) {
                        var projects = JSON.parse(response);
                        var selectedProject = $('#selectedProject');
                        $.each(projects, function(index, project) {
                            var select = $('<option>', {value: project.id})
                                .text(project.name);
                            if (config && config.project == project.id) {
                                selectedProject.append(select.attr('selected', 'selected'));
                            }
                            selectedProject.append(select);
                        });
                    }
                });
            });

        },
        render: function(config) {
            if (config) {
                $('#issues-in-project').html(this.template({itemTitle : config.title}));
            } else {
                $('#issues-in-project').html(this.template({itemTitle : 'Issues for project'}));
            }
            this.addProjects(config);
            $('#saveConfiguration').click(function(e) {
                e.preventDefault();
                var service = new DashboardItemConfigurationService();
                var $title = $('#itemTitle').val();
                var $project = $('#selectedProject').find(':selected').val();
                var configuration = {project: $project, title: $title};
                service.save(configuration, function() {
                    new IssueTableView().render(configuration);
                });
            });
        }
    }
};