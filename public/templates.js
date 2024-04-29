angular.module('AnnonceApp', [])
    .controller('AnnonceController', function ($scope, $http, $window) {
        $scope.annonces = [];

        $http.post('/api/annonces').then(function (response) {
            $scope.annonces = response.data;
        }).catch(function (error) {
            if (error.status === 401) {
                // L'utilisateur n'est pas authentifié, redirection nécessaire
                window.location.href = '/index.html';
            } else {
                console.error('Erreur lors de la récupération des annonces:', error);
            }
        });

        $scope.deconnexion = function () {
            $http.post('/logout').then(function (response) {
                $window.location.href = '/';
            }).catch(function (error) {
                console.error('Erreur lors de la déconnexion:', error);
            });
        };

        // Récupération de l'username
        $http.post('/api/username').then(function (response) {
            $scope.username = response.data.username;
        }).catch(function (error) {
            console.error('Erreur lors de la récupération des informations de l’utilisateur:', error);
        });
    })
    .directive('annonceCard', function () {
        return {
            restrict: 'E',
            template:
                `<div class="annonce">
                    <h2>{{ annonce.titre }}</h2>
                    <img ng-src="{{ annonce.image_url }}" alt="Image de l'annonce" style="width:400px; height:auto;">
                    <p>{{ annonce.description }}</p>
                    <p>Date de publication: {{ annonce.date_publication | date: 'dd/MM/yyyy' }}</p>
                </div>`,
            scope: {
                annonce: '='
            }
        };
    });;
