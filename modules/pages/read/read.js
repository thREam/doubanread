module.exports = {
    url: '/index',
    controller:'ReadController',
    template: __inline('./read.html')
};
require('pages/read/page');

angular.module('douban').controller('ReadController', function ($scope,decode,$http,Page,Render,$timeout) {
	$scope.loading=true;
	var margin = 24;	// pix

	$scope.current=1;
	$scope.pageData={
		pages:{},
		delPreContent:1
	};


	$scope.screenwidth=window.innerWidth;  //pix
	$scope.wapperWidth=$scope.screenwidth*3;
	$scope.contentWidth=$scope.screenwidth-margin*2;  //40是margin-left  margin-right
	var headHeight=0;
	
	$http.jsonp("http://doubanread.sinaapp.com/test.php?callback=JSON_CALLBACK").
	  then(function(response) {
	    	var s = angular.fromJson(decode.dec(response.data.data));
			var contents = s.posts[0].contents;
			$scope.info=contents;

	  }, function(response) {
	    alert('error');
	  });

	$scope.pre=function(){
		$scope.current--;
		$scope.changeTransform(0);
		
	}
	$scope.next=function(){
		$scope.current++;
		$scope.changeTransform(-$scope.screenwidth);
		
	}
	$scope.changeTransform=function(left){
		if($scope.current<1){
			alert('到头啦');
			return;
		}
		$scope.transformLength='translate(0px, 0px) translateZ(0px);';
	
		$scope.transformLength='translate('+left+'px, 0px) translateZ(0px);';
		
		
		$scope.renderData=Render.main($scope.pageData.pages,$scope.current);
	}
	$scope.$watch('pageData.pages', function(newValue, oldValue) {
	    $scope.renderData=Render.main(newValue,$scope.current);
	    $scope.loading=false;
	});

});