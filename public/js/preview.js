var app = angular.module("MyApp", ['ui.bootstrap']);

app.controller("NavController", function ($scope, $modal) {
    $scope.loc = "//placehold.it/100";

    var handleFileSelect = function (evt) {
        var files = evt.target.files;
        var file = files[0];

        if (files && file) {
            var reader = new FileReader();

            reader.onload = function (readerEvt) {
                var binaryString = readerEvt.target.result;
                $scope.loc = "data:image/jpeg;base64," + btoa(binaryString);
                $scope.$apply();
            };

            reader.readAsBinaryString(file);
        }
    };

    if (window.File && window.FileReader && window.FileList && window.Blob) {
        $('#filePicker').change(handleFileSelect);
    } else {
        alert('The File APIs are not fully supported in this browser.');
    }
});