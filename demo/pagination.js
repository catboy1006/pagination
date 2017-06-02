(function(){

  var pagination = angular.module('pagination' , []);

  pagination.directive('uiPagination', function() {
    return {
      restrict : 'EA',
      templateUrl : 'pagination.html',
      replace : true,
      scope : {
        conf : '='
      },
      link : function(scope , ele , attrs){
        console.log(scope.conf)
        var page = scope.page = {};
        var conf = scope.conf ;

        // 初始化一页展示多少条  默认为10
        conf.pageLimit = [10 , 15 , 20 , 30 ,50];

        if(!conf.itemPageLimit ){
          conf.itemPageLimit = conf.pageLimit[0];
        }else{
          // 把自定义的条目加入到pagelimit中
          if(conf.pageLimit.indexOf(conf.itemPageLimit)){
            conf.pageLimit.push(conf.itemPageLimit);
            conf.pageLimit = conf.pageLimit.sort(function(a ,b ){ return a - b; })
          };
        }

        // 分页数组
        scope.pageListFn = function(chosePage){
            conf.itemPageLimit = chosePage || conf.itemPageLimit;
            scope.pageList = [];
            // 一共多少页
            page.limit = Math.ceil(conf.total / conf.itemPageLimit) ;
            // 最多展示多少可见页码 默认为10
            page.defaultLimit = conf.defaultLimit ? conf.defaultLimit : 10 ;
            // 三种打点方式 ， 中间打点， 左边打点， 后边打点
            conf.currentPage = Number(conf.currentPage)
                if(page.limit <  page.defaultLimit ){
                    for(var i=1; i< page.limit ; i++){
                        scope.pageList.push(i);
                    }
                }else{
                    if(conf.currentPage < page.defaultLimit){
                        for(var i = 1 ; i <= page.defaultLimit; i++){
                            scope.pageList.push(i);
                        }
                        scope.pageList.push('...' , page.limit);
                    }else if(conf.currentPage > page.limit - page.defaultLimit + 1){
                        for(var i= page.limit - page.defaultLimit + 1; i<= page.limit; i++){
                            scope.pageList.push(i);
                        }
                        scope.pageList.unshift(1 , '...');
                    }else{
                        for(var i = conf.currentPage - Math.floor(page.defaultLimit / 2) ; i< conf.currentPage + Math.ceil(page.defaultLimit / 2) ; i++){
                            scope.pageList.push(i);
                        }
                        scope.pageList.push('...' , page.limit );
                        scope.pageList.unshift(1 , '...');
                    }
                }
            }
        }
        scope.pageListFn();
        
            // 点击页码
        scope.changePage = function(page){
          if(page == '...') return ;
          conf.currentPage = page ;
        }

        // 上一页
        scope.prevPage = function(){
            conf.currentPage = Number(conf.currentPage)
          if(conf.currentPage <= 1) return ;
          conf.currentPage -= 1;
            scope.pageListFn();
        }

        // 下一页
        scope.nextPage = function(){
          conf.currentPage = Number(conf.currentPage)
          if(conf.currentPage >= page.limit ) return ;
          conf.currentPage += 1;
            scope.pageListFn();
        }

        // 改变一页显示条目
        scope.selectPage = function(page){
            conf.currentPage = 1;
            scope.pageListFn(page);
        }
        scope.$watch('conf.currentPage',function(news,old){
            if(news == old) return;
            scope.pageList = [];
            scope.pageLength = null;
            if(page.limit < 10){
                scope.pageListFn();
                return;
            }
            if(page.limit == 10){
                for(var i=1 ; i<11; i++){
                    scope.pageList.push(i);
                }
                return;
            }
            if((Number(news) -5) < 1 ){
                for(var i=1 ; i<10; i++){
                    scope.pageList.push(i);
                }
                scope.pageList.push('...' , page.limit );
            }else if(Number(news)+ 5>page.limit){
                for(var i= page.limit - 8 ; i<= page.limit  ; i++){
                    scope.pageList.push(i);
                }
                scope.pageList.unshift(1 , '...');
            }else{
                for(var i= conf.currentPage -3 ; i< Number(conf.currentPage) + 4 ; i++){
                    scope.pageList.push(i);
                }
                scope.pageList.push('...' , page.limit );
                scope.pageList.unshift(1,'...');

            }
            if((news -5) < 1 && page.limit<5){
                 for(var i=1 ; i<5; i++){
                    scope.pageList.push(i);
                }
            }
        })
        // 跳转页
        scope.linkPage = function(){
          if(!conf.linkPage) return ;
          conf.linkPage = conf.linkPage.replace(/[^0-9]/ , '');
          if(conf.linkPage == 0 || conf.linkPage > page.limit){
             conf.linkPage = page.limit ;
          }
          conf.currentPage = conf.linkPage ;
        }


      }
    }
  });

})()
