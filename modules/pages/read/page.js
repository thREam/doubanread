angular.module('douban').service('Page',function(){
	var fontsize = 16	// pix
	var margintb = 40	// pix 上下marging高度
	var textindent = 2;	// rem
	var lineheight = 1.5; // rem
	var headheight = 1.5;	// rem
	var footheight = 1.5;	// rem
	var contentHeight=0,containerHeight=0;
	
	this.main=function(content){
		contentHeight=angular.element(".inner .content").height(); // 获取文章总高度
		containerHeight=angular.element(".article").height()-margintb*2; // 获取容器高度
		var p=angular.element('.inner .content p');
		var containerHeightEm=pixToEm(containerHeight);
		var lines=parseInt(containerHeightEm); //页面高度整数部分  

		var pageNumber=1;
		var tocNumber=0;
		var tocArr=[];
		var pages=[];
		var pageContent=[];
		var lift=0;
		var nowHeight=0; //现在的高度
		var tocTitle='';
		p.each(function() {
			
			var _text='',_paging,_content={},_pagingClone;

			var _pType=angular.element.trim(angular.element(this).attr('data-type'));
			var _size = contentSize(angular.element(this),_pType);
			_h=pixToEm(_size.h);
			if(null===_h){   //未获取到高度则能跳过
				return;
			}
			//获取正文，如果是图片则获取src
			if('illus'==_pType){
				_text=angular.element(this).find('img').attr('src');
				_h=Math.ceil(_h);
			}else{
				_text=angular.element(this).text();
			}
			if('headline'==_pType){
				tocArr.push({
					toc:tocNumber,
					page:pageNumber,
					title:_text
				});
				tocTitle=_text;
			}

			nowHeight+=_h;
			lift=nowHeight-lines;

			_paging={
				text:_text,
				type:_pType,
				w:_size.w,
				h:_h,
				remain:0,
				pclass:angular.element(this).attr('class'),
				page:pageNumber

			};
			_content={
				data:pageContent,
				page:pageNumber,
				title:tocTitle,
				height:lines
			}





			pageContent.push(_paging);	



			if('pagebreak'==_pType){
				pages.push(_content);
				pageContent=[];
				pageNumber++;
				nowHeight=0;
				return;
			}

		
			if(0<=lift){
				if('illus'==_pType){
					pageContent.pop();
					nowHeight=0;
				}else{
					nowHeight=lift-_h;
				}

				pages.push(_content);
				pageContent=[];
				pageNumber++;

				_pagingClone={
					text:_text,
					type:_pType,
					w:_size.w,
					h:_h,
					remain:nowHeight,
					pclass:angular.element(this).attr('class'),
					page:pageNumber

				};   //解决push对象为引用的问题
				nowHeight=nowHeight<0?(nowHeight+_h):nowHeight;
				
				pageContent.push(_pagingClone);	
			
			} 
		});

	return 	{Toc:tocArr,Pages:pages};
		
	}
	function contentSize(item,type){
		var h,w;
		switch(type){
			case 'illus':;
			case 'paragraph':;
			case 'headline':
				h=item.height();
				w=pixToEm(item.width());
				break;
			default:h=null;

		}
		return {w:w,h:h};
	}
	function pixToEm(pix){
		return pix/fontsize;
	}


})
.directive('onLastRepeat', function(Page,$timeout) {

        return {
        	restrict: 'AEC',
	    	scope: {
	    		pages:'=',
	    		delprecontent:'='
	    	},
	        link:function(scope, element, attrs) {
	 			if (scope.$parent.$last === true) {
	                $timeout(function () {
	                   scope.pages= Page.main(scope.info);
	                   scope.delprecontent=0;
	                },0);
	            }
	        }
        }


})
.service('Render', function() {
	this.main=function(data,current){
		if(data!=={}){
			
			var renderData=[];
			if(0==current){
				renderData=data.Pages.slice(current,current+3);
			}else{
				renderData=data.Pages.slice(current-1,current+2);
			}
			console.log(renderData);
			return renderData;
		}
		
	}

})
.filter('gettext',function(){
	 return function(data){
	 	var _text='';
	 	if(undefined==data){
	 		return _text;
	 	}
	 	if(angular.isArray(data.text)){
	 		for (var i = 0; i < data.text.length; i++) {
	 			// if(data.text[i].kind=="plaintext"){
	 				_text+=data.text[i].content;
	 			// }else{
	 			// 	_text+='<em class="'+data.text[i].kind+'">'+data.text[i].content+'</em>';
	 			// }
	 		};
	 	}else{
	 		_text+=data.text;
	 	}
        
        return _text;
    }
});