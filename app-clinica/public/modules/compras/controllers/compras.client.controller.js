'use strict';

// Compras controller
angular.module('compras').controller('ComprasController', ['$scope', '$stateParams', '$location', 'Authentication', 'Compras', 'Articulos',
	function($scope, $stateParams, $location, Authentication, Compras, Articulos {
		$scope.authentication = Authentication;

		// Nueva Compra
        $scope.compra = {}
		$scope.create = function() {
			// Create new Compra object

            //Articulos
            var articulosIds = [];
            angular.forEach($scope.articulos, function(art){

                var articulo = new Articulos(art);
                articulo.$save(function(response) {

                    articulosIds.push(response._id);
                });
            });
            $scope.compra.articulos = articulosIds;

			var compra = new Compras ($scope.compra);

			// Redirect after save
            compra.$save(function(response) {
				$location.path('compras/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

        // Articulos
        $scope.articulos = [];

		// Remove existing Compra
		$scope.remove = function(compra) {
			if ( compra ) { 
				compra.$remove();

				for (var i in $scope.compras) {
					if ($scope.compras [i] === compra) {
						$scope.compras.splice(i, 1);
					}
				}
			} else {
				$scope.compra.$remove(function() {
					$location.path('compras');
				});
			}
		};

		// Update existing Compra
		$scope.update = function() {
			var compra = $scope.compra;

			compra.$update(function() {
				$location.path('compras/' + compra._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Compras
		$scope.find = function() {
			$scope.compras = Compras.query();
		};

		// Find existing Compra
		$scope.findOne = function() {
			$scope.compra = Compras.get({ 
				compraId: $stateParams.compraId
			});
		};
	}
]);