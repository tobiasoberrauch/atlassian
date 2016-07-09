/*global AP*/

class DashboardItemConfigurationService {
    getConfiguration(configuredCallback, errorCallback) {
        AP.require(['request'], function(request) {
            request({
                url: '/rest/api/2/dashboard/{{{dashboard}}}/items/{{{dashboardItem}}}/properties/itemkey',
                success: function(response) {
                    configuredCallback(JSON.parse(response).value);
                }
            });
        });
    }

    isConfigured(configuredCallback, notConfiguredCallback) {
        var that = this;
        AP.require(['request'], function(request) {
            request({
                url: '/rest/api/2/dashboard/{{{dashboard}}}/items/{{{dashboardItem}}}/properties',
                success: function(response) {
                    var arrayOfProperties = JSON.parse(response).keys;
                    var configured = _.find(arrayOfProperties, function(property) {
                        return "itemkey" == property.key;
                    });
                    if (configured) {
                        that.getConfiguration(configuredCallback)
                    } else {
                        notConfiguredCallback();
                    }
                }
            });
        });
    }

    save(configuration, successCallback) {
        AP.require(['request'], function(request) {
            request({
                url: '/rest/api/2/dashboard/{{{dashboard}}}/items/{{{dashboardItem}}}/properties/itemkey',
                type: 'PUT',
                contentType: 'application/json',
                data: JSON.stringify(configuration),
                success: successCallback
            });
        });
    }
}
