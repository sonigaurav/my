// Define a new module for our app. The array holds the names of dependencies if any.
var app = angular.module("app", ["ngResource"]);

app.config(function($interpolateProvider) {
  $interpolateProvider.startSymbol('((');
  $interpolateProvider.endSymbol('))');
});

app.directive('datepicker', function() {
    return {
        restrict: 'A',
        require : 'ngModel',
        link : function (scope, element, attrs, ngModelCtrl) {
            $(function(){
                element.datepicker({
                    dateFormat:'dd-mm-yy',
                   // maxDate : -6576,
                    onSelect:function (date) {
                        ngModelCtrl.$setViewValue(date);
                        scope.$apply();
                    }
                });
            });
        }
    }
});


app.factory("ConsoleService", function() {
    var debug = false;
    return {
        log: function(msg) {
            if (debug) {
                console.log(msg);
            }  
        },
        setDebug: function(flag) {
            debug = flag;
        }
    };    
});

app.factory("EndpointService", function() {

    var pulse = "all";
    var datetime = "now";
    var base = "api/stories";

    return {
        pulse: function(p) {
            pulse = p;
        },
        datetime: function(d) {
            datetime = d;
        },
        getEndpoint: function () {
            return (base + '/' + pulse + '/' + datetime);
        },
        getKeywordsEndpoint: function (k) {
           
            var base = "api/keywords";
            var kbs = "NA" ;
            if(k.length > 0)   {
                kbs = k.toString();
            }
            return (base + '/' + kbs );
        }
    };

});

/* 
keyword service to provide keywords add/update/remove operations  
TagService is injected since keywords become tag at view
*/
app.factory("KeywordService", function() {

    var keywords = [];
    

    return {
        add: function(t) {
            if ($.inArray(t, keywords) === -1) {
               
                keywords.push(t);
                            
            }           
        },

        remove: function(t) {
           
            keywords.splice(keywords.indexOf(t), 1);
            
           
        },
        /* Remove keyword if a tag is removed */
        removeFromTag: function(t) {
           
        },
        get: function () {
            return keywords;
        }
        
    };    
});

/* Tag service to provide keywords add/update/remove operations  */
app.factory("TagService", function() {

    var tags = [];

    return {
        add: function(t) {
            if ($.inArray(t, tags) === -1) {
                tags.push(t);
            }  
        },
        remove: function(t) {
            tags.splice(tags.indexOf(t), 1);
        },

        /* Intialize Tags array with selected keywords */
        initTag: function () {
            tags = [];
           
        },
        get: function () {
            return tags;
        }
    };    
});

app.factory("MapService", function() {
    return {
        statusMap: {'new': 'latest', 'hot': 'hot', 'trending': 'trending', 'flat': 'flat', 'stop': 'stop'}
    };
});

app.factory("StoryService", function ($http, $rootScope, MapService, EndpointService) {

    var stories = [];

    story_ids = [];

    error = null;              

    endpoint = '';

    var params = {};
    var timer = 0;

    populateStories = function(data) {

        angular.forEach(data.stories['c:feed_twitter_top_50'], function(item) {

            /* If key doesn't exist, then add story */
            if ($.inArray(item.id, story_ids) === -1) {
                story_ids.push(item.id);
                stories.push(item);
            } else {
                var result = $.grep(stories, function(e){ return e.id == item.id; });
                story = result[0];
                story.status = item.status;
                story.title = item.title;
            }

        });
    };

    return {

        queryStories: function () {
            endpoint = EndpointService.getEndpoint();

            $http({method: 'GET', url: endpoint}).
                success(function(data, status, headers, config) {
                    populateStories(data);
                }).
                error(function(data, status, headers, config) {
                    error = status + " Request failed";
            });
        },
        pollStories: function () {


            var self = this;

            endpoint = EndpointService.getEndpoint();

            if(endpoint.indexOf("now") === -1){
                return;
            }

            $http({method: 'GET', url: endpoint}).
                success(function(data, status, headers, config) {
                    self.populateStories(data);
                }).
                error(function(data, status, headers, config) {
                    error = status + " Request failed";
            });

            $rootScope.$apply();  
        },
        poll: function() {
            timer = setInterval(this.pollStories, 5000) ;
        },  
        stop: function() {
            clearInterval(timer);
        },
        getData: function () {
            return stories; 
        }
    };
});



app.controller("HomeCtrl", function($scope, $resource, $http, $timeout, StoryService, MapService, EndpointService, TagService, KeywordService,ConsoleService) {

    $scope.loading = true;

    $scope.filters = ["hot","trending","latest","flat","stop"];

    $scope.pulse = "all";

    $scope.pulses = [];

    $scope.keywords = [];

    $scope.highlightedIds = [];

    $scope.highlight_form = [];

    $scope.articleStory = [];

    $scope.selectedStory=[];

    $scope.tags = [];

    $scope.show = [];

    $scope.stories = { "all" : [],
                        "latest": [],
                        "hot": [],
                        "trending": [],
                        "flat": [],
                        "stop": []
                    };

    $scope.story_ids = [];

    $scope.poll = true;


   $scope.addKeyword = function($event){
       if($event.keyCode == 13){
            KeywordService.add($scope.highlight_form.keyword);
            $scope.highlight_form.keyword = "";
       }
   };

   $scope.removeKeyword = function (t) {
         KeywordService.remove(t);
         
   };

  

   $scope.remove = function (t) {
        TagService.remove(t);
        
                
   };

   $scope.$watch(KeywordService.get, function (newVal) {
      
      $scope.keywords = newVal;
      var endpoint =  EndpointService.getKeywordsEndpoint($scope.keywords);

      ConsoleService.log("Endpoint  " + endpoint);
      
      $http({method: 'GET', url: endpoint}).
            success(function(data, status, headers, config) {
                $scope.highlightedIds = data ;
                ConsoleService.log("Highlited Story ->" , $scope.highlightedIds);
               
            }).
            error(function(data, status, headers, config) {
                error = status + " Request failed";
            });      

      }, true);        


   $scope.$watch(TagService.get, function (newVal) {
       
       ConsoleService.log(newVal);
       $scope.tags = newVal;

   }, true);        


   $scope.addHightlight = function(){

        var v = $scope.highlight_form;

        TagService.initTag();


        if(v.popularityOver || v.popularityUnder){
            var tagValue = "" ;
            if(v.popularityOver && v.popularityUnder){
                tagValue += "Popularity : Over " + v.overValue 
                + "% and Under " + v.underValue +"%" ;
            }else{
                if(v.popularityOver){
                    tagValue += "Popularity : Over " + v.overValue +"%" ;
                }else{
                    tagValue += "Popularity : Under " + v.underValue +"%" ;
                }
            }
            TagService.add(tagValue);
        }

        if(v.overAge || v.underAge){
            var tagValue = "" ;

            if(v.overAge && v.underAge){
                tagValue += "Age : Over " + v.overAgeValue 
                + " and Under " + v.underAgeValue  ;
            }else{
                if(v.overAge){
                    tagValue += "Age : Over " + v.overAgeValue ;
                }else{
                    tagValue += "Age : Under " + v.underAgeValue ;
                }
            }
            TagService.add(tagValue);
            
        }
        
        if(v.gender != null){
            var tagValue = "" ;
            tagValue += "Gender : " +v.gender
            TagService.add(tagValue);
         }
    
        if(v.moreGrowth || v.lessGrowth){
            var tagValue = "" ;

            if(v.moreGrowth && v.lessGrowth){
                tagValue += "Growth : More then " + v.moreGrowthValue + "% "
                + " and Less then " + v.lessGrowthValue + " % in Last Hour"  ;
            }else{
                if(v.moreGrowth){
                    tagValue += "Growth :  More then " + v.moreGrowthValue + " % in Last Hour" ;
                }else{
                    tagValue += "Growth : Less then " + v.lessGrowthValue + " % in Last Hour" ;
                }
            }
            TagService.add(tagValue);
        }

        if(v.highlight){
            TagService.add(v.highlight);
        }

        if($scope.highlight_form.keyword && 
            $scope.highlight_form.keyword.length > 0)
        {
            KeywordService.add($scope.highlight_form.keyword);   
            $scope.highlight_form.keyword ="";
        }
    };



 $scope.getCurrentTimeString = function(){

         var td = new Date();
         var hrs = td.getHours();

         var min = td.getMinutes();
         if(min < 10){
          min = "0" + min;
          } 

         var ampm = "AM" ;
         if(hrs > 12){
           hrs -= 12;
           ampm = "PM" ;
          }

          var timeString  = hrs +  " : " + min + " " + ampm ;

          $scope.currTime = timeString;

      };


     $scope.addChangeTime = function() {

        //Check if form is undefined 
        if (!$scope.todayTime_form){
            return;
        }
        ConsoleService.log($scope.todayTime_form.selectedDate);
        ConsoleService.log($scope.todayTime_form.selectedTime);
       // ConsoleService.log($scope.todayTime_form.selectedTime);
        var val = "now";
       
        if( $scope.todayTime_form.currentDate == "cd" || $scope.todayTime_form.currentTime  == "ct" ){
               val = "now" ;
        }else{
           
             val  = $scope.todayTime_form.selectedDate; 
             
            if( $scope.todayTime_form.currentTime && $scope.todayTime_form.currentTime  != "ct" && $scope.todayTime_form.currentTime.length > 0){
                val +=  " " + $scope.todayTime_form.selectedTime + $scope.todayTime_form.selectedZone;
               
            }
        }

        if(val && val.length == 0 ){
            val = "now" ;
        }

        EndpointService.datetime(val);

        if(val != "now"){
            StoryService.queryStories();
        }

      
   
    };


    $scope.pollStories = function() {       
        if($scope.poll) {
            StoryService.poll();
            
           
        } else {
            StoryService.stop();
        }
    };

    $scope.$watch(StoryService.getData, function (newVal) {
        $scope.stories.all = newVal;
      
        for(var type in $scope.stories) {
            if(type!="all")
                $scope.stories[type].length = 0;
        }

        angular.forEach($scope.stories.all, function(story) {
            statusMap = MapService.statusMap;
            $scope.stories[statusMap[story.status]].push(story);
        });
        $scope.getCurrentTimeString();
        $scope.updateView();
        $scope.loading = false;
    }, true);        


    $scope.updateView = function() {
        
        $scope.show = [];

        angular.forEach($scope.filters, function(filter) {
            $scope.show.push.apply($scope.show,$scope.stories[filter]);
        });

        /*Highlight Story */

        angular.forEach($scope.show, function(story) {
            if ($.inArray(story.id, $scope.highlightedIds) > -1) {
                story.highlightedClass = "text-stop";
            } else {
                story.highlightedClass = "";
            }
        });


    };

    
    $scope.setFilter = function(filter) {

        $scope.loading = true;

        if($scope.filters.length == 5) {
        
            $scope.filters.length = 0;
            $scope.filters.push(filter);
        
        } else {

            /* If filter doesn't exist, then add filter */
            if ($.inArray(filter, $scope.filters) === -1) {
                $scope.filters.push(filter);
            } else {
                $scope.filters.splice($scope.filters.indexOf(filter), 1);
            }

        }

        if($scope.filters.length == 0) {
            $scope.filters = ["hot","trending","latest","flat","stop"];
        }

        $scope.updateView();
        $scope.loading = false;
    };

    $scope.filterActive = function(filter) {
        if ($.inArray(filter, $scope.filters) === -1) {
            return false;
        } else {
            return true;
        }
    }

    $scope.setPulse =  function(pulse){
       $scope.pulse = pulse;
       EndpointService.pulse(pulse);
       StoryService.queryStories();
    };

    $scope.pulseActive = function(pulse) {
        if ($scope.pulse == pulse) {
            return true;
        } else {
            return false;
        }
    };

    $scope.getPulses = function() {

        $http({method: 'GET', url: 'api/usersettings'}).
            success(function(data, status, headers, config) {
                $scope.pulses = data;    
            }).
            error(function(data, status, headers, config) {
                error = status + " Request failed";
        });
    };

    StoryService.queryStories();
    $scope.pollStories();
    $scope.getPulses();

});


/* Custom Code */
$("#menu-toggle-left").click(function(e) {
    e.preventDefault();
    $("#wrapper").toggleClass("active-left");
});
