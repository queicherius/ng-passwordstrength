application.directive('ngPasswordStrength', function ($compile, passwordStrength) {

    return {

        scope: {
            model: '=ngModel'
        },

        replace: false,

        // This linker function adds the template after the element
        // and is needed because angular doesn't support something like this
        // out of the box. Working with ng-transclude would
        // add a additional scope and prevent updating the model in the parent scope
        link: function ($scope, $element) {

            // The template to append
            var template = '<div class="ng-password-strength-bar" ng-show="strength !== undefined"><div class="ng-password-strength-bar-inner {{ getColor(strength) }}" style="width: {{ strength }}%;"></div></div>',
                $newElement;

            // Create a element out of the template, and add it after the directive element
            $newElement = angular.element(template);

            // Add it after the directive element
            $element.after($newElement);

            // Compile it
            $compile($newElement)($scope);

        },

        controller: function ($scope) {

            $scope.strength = undefined;

            $scope.$watch("model", function (password) {
                
                $scope.strength = displayMinimumStrength(passwordStrength.calculate(password));
                
            });

            $scope.getColor = function (strength) {

                if (strength > 66) {
                    return 'green';
                }

                if (strength > 33) {
                    return 'orange';
                }

                return 'red';

            };

            function displayMinimumStrength(strength) {

                // Display at least 10, so the user sees a red bar
                if (strength < 10) {
                    strength = 10;
                }

                return strength;

            }

        },
        require: 'ngModel'

    };

})
;