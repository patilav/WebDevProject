app.controller("HomeController", function ($scope, $routeParams, $http) {
    $scope.myInterval = 5000;
    var slides = $scope.slides = [
        {
            image: '../images/music.jpg',
            text: 'Music'
        },
        {
            image: '../images/images.jpg',
            text: 'Posters'
        },
        {
            image: '../images/photos.jpg',
            text: 'Photos'
        },
        {
            image: '../images/video.jpg',
            text: 'Video'
        }
        ];

    /* --- code to add the slieds on the fly 
    $scope.addSlide = function () {
        var newWidth = 600 + slides.length + 1;
        slides.push({
            image: 'http://placekitten.com/' + newWidth + '/300',
            text: ['Videos', 'Music', 'Paintings', 'Photographs'][slides.length % 4] + ' ' +
              ['Cats', 'Kittys', 'Felines', 'Cutes'][slides.length % 4]
        });
    };
    
    for (var i = 0; i < 4; i++) {
        $scope.addSlide();
    }
    */
    $http.get("/userartwork")
    .success(function (response) {
        $scope.artwork = response;
    });

    $scope.add = function () {
        var obj = { username: username, type: $scope.type, artwork: $scope.artworks };
        console.log(obj);
        $scope.type = null;
        $scope.artworks = null;
        $http.post("/userartwork", obj)
        .success(function (response) {
            $scope.artwork = response;
        });
    };
});
