app.controller("HomeController", function ($scope, $routeParams, $http, $sce) {
    var username = $routeParams.username;

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
    $http.get("/api/userartwork")
    .success(function (response) {
        $scope.artwork = response;
    });

    //$scope.add = function () {
    //    var obj = { username: username, type: $scope.type, artwork: $scope.artworks };
    //    console.log(obj);
    //    $scope.type = null;
    //    $scope.artworks = null;
    //    $http.post("/userartwork", obj)
    //    .success(function (response) {
    //        $scope.artwork = response;
    //    });
    //};

    $scope.trustSrc = function (src) {
        return $sce.trustAsResourceUrl(src);
    }

    $scope.search = function () {
        /*if ($scope.searchNameString != null  && $scope.searchTypeString != null) {
            var obj = { searchNameString: $scope.searchNameString, searchTypeString: $scope.searchTypeString };
            console.log(obj);
            $http.get("/api/userartwork/search", obj)
            .success(function (response) {
                console.log("this got executed"+ response);
                $scope.artwork = response;
                $scope.searchNameString = null;
                $scope.searchTypeString = null;
            });
        } else*/
        if ($scope.searchTypeString != null) {
            $http.get("/api/userartwork/searchByType/" + $scope.searchTypeString)
            .success(function (response) {
                $scope.artwork = response;
                $scope.searchTypeString = null;
            });
        } else
            if ($scope.searchNameString != null) {
                $http.get("/api/userartwork/searchByName/" + $scope.searchNameString)
                .success(function (response) {
                    $scope.artwork = response;
                    $scope.searchNameString = null;
            });
        }
    };


    function selectartwork(index) {
        $scope.selectedIndex = null;
        $scope.selectedArtwork = null;
        $scope.selectedIndex = index
        $scope.selectedArtwork = $scope.artwork[index];
        console.log("$scope.selectedIndex" + $scope.selectedIndex);
        console.log("$scope.selectedArtwork" + $scope.selectedArtwork);
    }

    $scope.showComment = function (index) {
        selectartwork(index);
        $scope.showcmt = true;
    }

    $scope.addComments = function (comment) {
        if (typeof $scope.selectedArtwork.comments == "undefined") {
            $scope.selectedArtwork.comments = [];
        }
        var newComment = {
            text: comment.text,
            username: username
        }
        $scope.selectedArtwork.comments.push(newComment);
        $http.put("/api/userartwork/" + $scope.selectedArtwork._id + "/" + username, $scope.selectedArtwork)
        .success(function (response) {
            $scope.artwork = response;
        });
    }

    function getPreviousLikeIndex(likes, uname) {
        for (i = 0 ; i < likes.length ; i++) {
            if (likes[i].username == uname) {
                return i;
            }
        }
        return -1;
    }

    $scope.alreadyLiked = function (index) {
        if (typeof $scope.artwork[index].likes == "undefined") {
            return false;
        }
        var oldIndex = getPreviousLikeIndex($scope.artwork[index].likes, username);
        if (oldIndex == -1) {
            return false;
        } else {
            return true;
        }
    }
    $scope.like = function (index) {
        selectartwork(index);
        if (typeof $scope.selectedArtwork.likes == "undefined") {
            $scope.selectedArtwork.likes = [];
        }
        var newLike = {
            count: 1,
            username: username
        }
        var oldIndex = getPreviousLikeIndex($scope.selectedArtwork.likes, username);
        console.log("oldIndex : " + oldIndex);
        if (oldIndex != -1) {
            $scope.error = true;
            $scope.errormsg = "Error in liking one of the artworks";
        } else {
            $scope.selectedArtwork.likes.push(newLike);
            $http.put("/api/userartwork/" + $scope.selectedArtwork._id + "/" + username, $scope.selectedArtwork)
            .success(function (response) {
                $scope.artwork = response;
                $scope.likesucess = true;
                $scope.likesucessmsg = "Liked artwork!";
            });
        }
    }

    $scope.alreadyLiked = function (index) {
        console.log(username);
        if (username == "undefined") {
            return false;
        }

        if (typeof $scope.artwork[index].likes == "undefined") {
            return false;
        }
        var oldIndex = getPreviousLikeIndex($scope.artwork[index].likes, username);
        if (oldIndex == -1) {
            return false;
        } else {
            return true;
        }
    }

    $scope.unlike = function (index) {
        selectartwork(index);
        if (typeof $scope.selectedArtwork.likes == "undefined") {
            $scope.selectedArtwork.likes = [];
        }
        var newLike = {
            count: 1,
            username: username
        }
        var oldIndex = getPreviousLikeIndex($scope.selectedArtwork.likes, username);
        console.log("oldIndex : " + oldIndex);
        if (oldIndex != -1) {
            $scope.selectedArtwork.likes.splice(oldIndex, 1);
            $http.put("/api/userartwork/" + $scope.selectedArtwork._id + "/" + username, $scope.selectedArtwork)
            .success(function (response) {
                $scope.artwork = response;
                $scope.likesucess = true;
                $scope.likesucessmsg = "Unliked artwork!";
            });
        } else {
            $scope.error = true;
            $scope.errormsg = "Error in Unliking one of the artworks";
        }
    }

});
