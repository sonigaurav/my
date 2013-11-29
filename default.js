//angular.module('myApp', ['ngSanitize']);

var app =angular.module('myApp', ['ngSanitize', 'firebase']).
		value('fbURL', 'https://angularjs-projects.firebaseio.com/').
				factory('Projects', function(angularFireCollection, fbURL) {
					alert('dfsdfsd');	
					return angularFireCollection(fbURL);
				}).config(function($routeProvider) {
					$routeProvider.
							when('/syncomgroup', {controller:DefaultCtl, templateUrl:'html/Syncomgroup.html'}).
							when('/vission', {controller:DefaultCtl, templateUrl:'html/Vission.html'}).
							when('/infrastructure', {controller:DefaultCtl, templateUrl:'html/Infrastructure.html'}).
							when('/syncomphoto', {controller:DefaultCtl, templateUrl:'html/SyncomPhotoGallery.html'}).
							when('/topManagement', {controller:DefaultCtl, templateUrl:'html/TopManagement.html'}).							
							when('/disclaimer', {controller:DefaultCtl, templateUrl:'html/Disclaimer.html'}).
							otherwise({redirectTo:'/'});
				});        
 
app.directive('datepicker', function() {
    return {
        restrict: 'A',
        require : 'ngModel',
        link : function (scope, element, attrs, ngModelCtrl) {
            $(function(){
                element.datepicker({
                    dateFormat:'mm/dd/yy',
                    maxDate : -6576,
                    onSelect:function (date) {
                        ngModelCtrl.$setViewValue(date);
                        scope.$apply();
                    }
                });
            });
        }
    }
});


app.directive('rating', function () {
    return {
      restrict: 'A',
      template: '<img ng-repeat="star in stars" src="./img/oneStar.jpg" />',
       scope: {
        ratingValue: '='
      },
      link: function (scope, elem, attrs) {
        scope.stars = [];
        for (var i = 0; i < scope.ratingValue; i++) {
          scope.stars.push({});
        }
      }
  }
});

app.directive('srating', function () {
    return {
      restrict: 'A',
      template: '<img ng-repeat="star in stars" src="./img/g_2.png" />',
      scope: {
        ratingValue: '='
      },
      link: function (scope, elem, attrs) {
        scope.stars = [];
        for (var i = 0; i < scope.ratingValue; i++) {
          scope.stars.push({});
        }
      }
  }
});

    app.factory("OrderService", function($http,$timeout) {
    	console.log("call order service");
    var orderStatus = 0;
    var timer =0;
   var scope;
    var orderCheck="json-ncs/s_orderAction?operation=checkOrder";
    return {
            getStatus: function () {
            	 $http({method: 'GET', url: orderCheck}).
                success(function(data, status, headers, config) {
                   console.log(data.message);
                   if(data.message!="" )
                   {

                   	  clearInterval(timer);
                   	  scope.displayThx();
                   }
                }).
                error(function(data, status, headers, config) {
                    error = status + " Request failed";
            });

           },
           get: function () {
            return orderStatus;
           },
           poll: function(sc) {
           	scope=sc;
            timer = setInterval(
            	this.getStatus, 5000) ;
        	},
             
        
          }; 



      });

function DefaultCtl($scope) {
	$scope.value="About Page" ;
}
 
app.controller('swpCtl',function ($scope, $http, $location, $timeout ,OrderService){

	$scope.showCatalog = false;
	$scope.showHome = true;
	$scope.showSC = false;
	$scope.showThx = false;

	$scope.showTab = "home";
	$scope.userName = "Guest";
	$scope.loginId = "";
	$scope.prodDetails = [];

	//Products 
	$scope.items = [];

	//Product Categories
	$scope.categories = [];

	//Selcted Category 
	$scope.selectedCat ="";
	//Shopping Cart Items
	$scope.shoppingCart =[];

	//SC Grant Total
	$scope.scGrantToTal =0;

	//SC Grant PP total
	$scope.scGrantPPToTal =0;

	//SC Shipping Charges
	$scope.scShippingCharges =0;
	$scope.scShippingChargesMsg = "";

	//Total money saved on SC 
	$scope.scSaved =0;
	$scope.scSavedMsg ="";

    $scope.binaryTree = [];

     $scope.generationTree = [];

     $scope.cityList = [];

    $scope.stateList = [];

    $scope.walletList = [];    
    $scope.wallet;    

    $scope.orderList = [];
    $scope.walletAccountTrnList = [];
    $scope.EPINList=[];
     //EBS Info
     $scope.EBSAccountId="13795";
     $scope.EBSReturnURL="http://www.syncomwellness.com/jsp/response.jsp?DR={DR}";
     $scope.EBSMode="TEST";

	//Login buttom Label
	$scope.loginBtLabel ="Login";

	$scope.activeMessage = false;

	$scope.ewMessage = false;
    $scope.isResendDisabled=true;

    $scope.epinstatus = false;
	//Local URLs
	//var  loginUrl = "user.json";
	//var  catalogUrl = "pc.json";
	//var  productUrl = "pd.json";
	//var productDetailURL = "pdl.json";
    //var binaryTreeURL = "btdata.json";
    //var generationTreeURL = "gtdata.json";


	var  loginUrl = "json-ncs/loginAction?operation=SignIn&";
	var  catalogUrl = "json-ncs/Sl_catagoryMasterListAction?page=0&limit=25&pages=1&start=0&operation=ajax";
	var  productUrl = "json-ncs/Sl_productDetailListAction?catalog=true&page=0&limit=25&pages=1&start=0&operation=ajax";
	var productDetailURL = "json-ncs/d_getDTOAction?className=com.nenosystems.mlm.dto.ProductDetailDTO&id=";
    var binaryTreeURL = "json-ncs/Sl_binaryListAction?operation=ajax&memberId=";
    var generationTreeURL = "json-ncs/Sl_generationListAction?operation=ajax&memberId=";
    var cityListURL = "json-ncs/Sl_cityListAction?operation=ajax&page=0&limit=1100&pages=1&start=0";
    var stateListURL = "json-ncs/Sl_stateListAction?operation=ajax&page=0&limit=50&pages=1&start=0";

    var registerUrl="json-ncs/s_memberAction?operation=Register&";
    var walletAccountListURL = "json-ncs/Sl_walletAccountListAction?operation=ajax&memberId=";
	var resendUrl="json-ncs/s_memberAction?operation=ForgetPassword&";
    var addOrderUrl = "json-ncs/s_newOrderAction?operation=Save&";
    var addOrderDetailUrl = "json-ncs/s_orderDetailAction?operation=Save&";
    var walletUrl="json-ncs/s_walletAccountTrnAction?operation=Save&";
    var epinURL="json-ncs/s_memberAction?operation=paymentAmount&";
    var refferalURL="json-ncs/s_memberAction?operation=getMemberDetail&";
    var orderListURL="json-ncs/Sl_orderListAction?operation=ajax";
    var walletAccountTrnListURL="json-ncs/Sl_walletAccountTrnListAction?operation=ajax";
    var inventoryUrl="json-ncs/Sl_inventoryListAction?operation=ajax"
    var myProfileUrl="json-ncs/d_myProfileAction";
    var familyUrl="json-ncs/Sl_familyDetailListAction?operation=ajax";
    var saveMyProfileUrl="json-ncs/s_myProfileAction?operation=Save&";
    var saveFamilyUrl="json-ncs/s_familyDetailAction?operation=Save&";
    var changePWDUrl="json-ncs/s_myProfileAction?operation=Reset&";
	var forgotPasswordURL="json-ncs/s_memberAction?operation=ForgetPassword&";
	var hideUpgradeURL="json-ncs/s_memberAction?operation=EpinStatus&";
	var epinGenURL="json-ncs/s_epinAction?operation=getUniqueKey&";
	var epinListURL="json-ncs/Sl_epinListAction?operation=ajax";
	var epinSendURL="json-ncs/s_epinAction?";
	var orderCheck="json-ncs/s_orderAction?operation=checkOrder";

	$scope.userInfo = { 

						"id" : "0",
						"loginId" : "",
						"password" : "",
						"fullName" : "Guest",
						"firstName" : "",
						"lastName" :" ",
						"errorMsg" :"",
						"memberCode" :"0",
						"lastLogin" :"",
						"roleId" :"",
						"memberStatus" : 0,
						"memberId" : 0 ,
						"pinCode":""
 
					   };

	$scope.userReg = { 
						"id" : "0",
						"firstName" : "",
						"lastName" :" ",
						"gender" :" ",
						"dob" : "",
						"mobile" : "",
						"address" : "",
						"landmark" : "",
						"countryId" : "",
						"stateId" : "",
						"districtId" : "",
						"cityId" : "",
						"pin" : "",
						"email" : "",
						"loginId" : "",
						"password" : "",
						"isRegister" : false,
						"tnc":"",
						"errorMsg" :"",

					};

 $scope.shippingAdd = { 
						"id" : "0",
						"address" : "",
                        "countryId" : "",
						"stateId" : "",
						"districtId" : "",
						"cityId" : "",
						"landmark" : "",
						"pinCode" : ""
					   };
 $scope.forgotPassword = { 
						"id" : "0",
						"memberCode" : ""                      
					   };

$scope.myProfile = { 

						"id" : "0",
						"loginId" : "",
						"password" : "",
						"firstName" : "",
						"lastName" :" ",
						"errorMsg" :"",
						"memberCode" :"0",
						"lastLogin" :"",
						"roleId" :"",
						"memberStatus" : 0,
						"memberId" : 0 ,
						"parentMemberName":"",
						"refferedMemberCode":"",
						"mobileNo":"",
						"oldPassword":"",
        				"newPassword":"",
        				"reenteredNewPassword":"",
        				"street":"",
        				"mail":"",
        				"cityId": "",
    					"stateId": "",
    					"cityName": "",
    					"stateName": "",
    					"pincode": "",
    					"gender": "",
    					"dateOfBirth": "",
					    "occupation": "",
					    "maritalStatus": "",
					    "weddingAnniversaryDate": "",
					    "panNo": "",
					    "tdsCerificate": "",
					    "telephoneResi": "",
					    "telephoneOffice": "",
					    "savingsAccountNo1": "",
					    "bankName1": "",
					    "bankCode1": "",
					    "ifscCode1": "",
					    "addressOfBank1": "",
					    "savingsAccountNo2": "",
					    "bankName2": "",
					    "bankCode2": "",
					    "ifscCode2": "",
					    "addressOfBank2": "",
					    "verifyAccount2": "",
					    "nomineeName": "",
					    "nomineeRelation": "",
					    "landmark": "",
					    "nomineeName":"",
					    "nomineeRelation":""
 
					   };

$scope.family = { 

						"id" : "0",
						"name" : "",
						"dateOfBirth" : "",
						"education" : "",
						"relationship" :" ",
						"mobileNo" :"",
						"phoneNo":""
				};
$scope.epin=	{
				"memberCode":"",
				"numberOfEpins":"",
				"message":""

				};
	$scope.documentsName=[''];

	$scope.states=  [];
	$scope.selectedState; 

	$scope.cities=  [];
	$scope.selectedCity; 

	$scope.selectedDistrict; 

	//Depricated see setCurrentDistOnChange
	 $scope.setCurrentDist = function(c){
		    $scope.selectedDistrict = c;
		    //console.log(c);
     };

	 $scope.setCurrentDistOnChange = function(val){
		angular.forEach($scope.cities, function(d){
			if( val== d.id){
				$scope.selectedDistrict  = d;
				//console.log("selcted dist " + $scope.selectedDistrict.id );
			}
		});
     };


     //Depricated see setCurrentCityOnChange
	 $scope.setCurrentCity = function(c){
		    $scope.selectedCity = c;
		    //console.log(c);
     };

	 $scope.setCurrentCityOnChange = function(val){
		angular.forEach($scope.cities, function(c){
			if( val== c.id){
				$scope.selectedCity  = c;
				//console.log("selected city " + $scope.selectedCity.id);
			}
		});
     };


     //Depricated See setCurrentStateOnChange
     $scope.setCurrentState = function(c){
		    $scope.selectedState = c;
		    //console.log(c);
		};

     $scope.setCurrentStateOnChange = function(val){

     	//console.log("Sate ### val received " + val);

		angular.forEach($scope.states, function(s){
			if( val== s.id){
				$scope.selectedState  = s;
				$scope.selectedCity ={};
				$scope.selectedDistrict ={};
				//console.log("---->" + $scope.userReg.stateId + " -- " + s.id);
			}
		});

	 };



     $scope.wallet = { 
						"id" : "0",
						"memberId" : "",
						"memberCode" :" ",
						"memberName" :" ",
						"balance" : "",
						"description" : ""
					};


	 $scope.canShow = function(val){
		    return  $scope.showTab === val;
         };
	

	$scope.toggleActive = function(c){

		$scope.showTab = "show_Catalog";
		angular.forEach($scope.categories, function(cat){
			cat.active = false;
		});
		c.active = true;
		$scope.selectedCat = c.name;
	};

	$scope.scItemIds = [];
    
	$scope.checkStock = function(item, cartItem){
		
         item.invntry_check_fail=false;
         item.invntry_check_fail1=false;
		 cartItem.invntry_check_fail=false;
			 
        var invUrl=inventoryUrl+"&productCode="+ item.code;
        
        $http.get(invUrl).success(function(data) { 


        	 if(data.root.length == 0){
        		 
        		 item.qty = 0;
        		 item.invntry_check_fail1=true;
			  	 item.invntry_check_fail=false;
			  	 item.scAdded = false;
			  	 cartItem.qty = 0;
			  	 cartItem.invntry_check_fail=true;

			  	 //Remove item from Shopping cart
			  	 var removeIndex = 0;
			  	 var ind = 0;
				 angular.forEach($scope.shoppingCart, function(item){
					if(cartItem.id == item.id ){
						removeIndex = ind;
					}
					ind++;
				 });
				 $scope.removeFromShoppingCart( removeIndex, cartItem);				 
			  	 
			  	 
			     return;
        	 }
             
        	 angular.forEach(data.root, function(p){

        	  
			  if(item.qty>p[3]){
			  	if(p[3]==0){
			  		item.invntry_check_fail1=true;
			  		item.invntry_check_fail=false;
			  		}else{
			  			 item.invntry_check_fail=true;
			  			 item.invntry_check_fail1=false;
			  			 item.scAdded = false;
			  		}
				 
				  cartItem.invntry_check_fail=true;
				  item.qty = 0;
				  cartItem.qty = 0;
                  $scope.showItemqty=p[3];
                  
 			  	 //Remove item from Shopping cart
 			  	 var removeIndex = 0;
 			  	 var ind = 0;
 				 angular.forEach($scope.shoppingCart, function(item){
 					if(cartItem.id == item.id ){
 						removeIndex = ind;
 					}
 					ind++;
 				 });
 				 $scope.removeFromShoppingCart( removeIndex, cartItem);				 
                  
                  
	              return;
		         }
		     });
          });
	};

	

	

	$scope.addToShoppingCart = function(item){
		
		
        var shopCartItem ;   
       		 
	 	//If quantity is zero and no added so far 
		if(item.qty == 0 && !item.scAdded)
		{
			return;
		}

		// Check is item is already exist
		if(item.qty > 0 && item.scAdded)
		{
			
			angular.forEach($scope.shoppingCart, function(cartItem){
				
				if(cartItem.id == item.id){
					cartItem.qty = item.qty;
					shopCartItem = cartItem;
				}	
			});
			
			$scope.checkStock(item,shopCartItem);

			return;
		}

        //Check is quantity is zero then remove from shopping cart

		if(item.qty == 0 && item.scAdded)
		{
			var idx = 0;
			angular.forEach($scope.shoppingCart, function(cartItem){
				if(cartItem.id == item.id){
					$scope.shoppingCart.splice(idx,1);
					item.scAdded = false;
				}	
				idx++;
			});
			return;
		}

		// Add item to shopping cart

		shopCartItem = {
			"id" : item.id,
			"code":item.code,
			"name" : item.name,
			"description" : item.description,
			"price" :item.price,
			"dp" :item.dp,
			"pp" :item.pp,
			"qty":item.qty,
			"total" : 0
		};
          
     	$scope.shoppingCart.push(shopCartItem);

		item.scAdded = true;
		
		$scope.checkStock(item,shopCartItem);

		$scope.calculateSP();
 
		
        //console.log("in lasttttttttt"+$scope.shoppingCart);
				 
	};

	$scope.removeFromShoppingCart = function(idx, removedItem){

		$scope.shoppingCart.splice(idx,1);

		//console.log(removedItem);

		angular.forEach($scope.items, function(i){

			//console.log(i.id);
			if(removedItem.id == i.id){
				i.qty = 0;
				i.scAdded = false;
			}	
		});

		$scope.calculateSP();

	};

	
	$scope.cleanSP = function(){
		angular.forEach($scope.shoppingCart, function(item){
			if(item.qty == 0 ){
				
			}
		});
	};	

	$scope.updateSCItem = function(idx, scItem){

		if(scItem.qty ==0){
			//$scope.removeFromShoppingCart (idx, scItem);
			angular.forEach($scope.items, function(i){
				if(scItem.id == i.id){
					i.qty = 0;
				}	
			});

			$scope.calculateSP();

		    return;
		}

        
		var invUrl=inventoryUrl+"&productCode="+ scItem.code;
         
        $http.get(invUrl).success(function(data) { 
              angular.forEach(data.root, function(p){
			  if(scItem.qty>p[3]){
				  scItem.invntry_check="Sorry only " + p[3] + " items in stock";
				  scItem.qty = 0;
				  //p[3]=scItem.qty;
				  
	              return;
		      }else{		      	 
		          scItem.invntry_check=""; 
		          angular.forEach($scope.items, function(i){
				  if(scItem.id == i.id){
					i.qty = scItem.qty;
				    }	
				  });
		           $scope.calculateSP();
		         }
		      });
            });  
	};



	$scope.calculateSP = function(){

		$scope.scGrantToTal = 0;
		$scope.scGrantPPToTal =0;

		var dpTotal = 0;
		var mrpTotal =0 ;

		angular.forEach($scope.shoppingCart, function(item){

			if($scope.userInfo.memberStatus == 3) {
				item.total = item.qty * item.dp;	
			}else{
				item.total = item.qty * item.price;
			}
			
			dpTotal += (item.qty * item.dp);
			mrpTotal+=(item.qty * item.price);
			

			$scope.scGrantToTal += item.total;
			$scope.scGrantPPToTal += item.pp*item.qty;
		});

		$scope.scSaved = mrpTotal - dpTotal;

		if($scope.userInfo.memberStatus == 3) {
			$scope.scSavedMsg = "You will save Rs." + $scope.scSaved +" on this transaction";
		}else{
			$scope.scSavedMsg = "You could have saved  Rs." + $scope.scSaved +" on this transaction by upgrading to Ambassador";
		}	

		if($scope.scGrantToTal < 1500){
			$scope.scShippingCharges = 50;
     		$scope.scShippingChargesMsg = "Enjoy free shipping for purchase above Rs.1500";

		}else{
			$scope.scShippingCharges = 0;
			$scope.scShippingChargesMsg = ""; 
		}

		//console.log("Message ", $scope.scSavedMsg);

	};

	$scope.displayCart = function(){
		if($scope.shoppingCart.length==0){
			alert('You have not selected any product till now, please go to Product Catloge and select some products. ');
			return;
		}
		if($scope.isLogin()){
			$scope.showTab = "show_SC";
			$scope.calculateSP();
			$scope.displayshoppingMsg="";
		}
	};


	$scope.getTotal = function(item){
		if($scope.userInfo.memberStatus == 3) {

		return item.qty * item.dp;
	     }
	     else{
	     	return item.qty * item.price;
	     }

	};

	$scope.getPPTotal = function(item){
		return item.qty * item.pp;
	};

	$scope.registerUser = function(){
		//console.log($scope.userReg.tnc);
        if($scope.userReg.firstName == ""  || $scope.userReg.dob=="" || $scope.userReg.mobile=="" || $scope.userReg.address=="" || $scope.userReg.tnc==""){
		
		return;
		}


		var regUrl = registerUrl +"roleCode=Member&roleId=3&status=0"+"&firstName="+$scope.userReg.firstName+"&lastName="+$scope.userReg.lastName+"&dateOfBirth="+$scope.userReg.dob+
		"&gender="+$scope.userReg.gender+"&emailId="+$scope.userReg.email+"&mobileNo="+$scope.userReg.mobile+"&street="+$scope.userReg.address+"&stateName="+$scope.selectedState.name+"&state="+$scope.userReg.stateId+
		"&districtName="+$scope.selectedCity.name+"&district="+$scope.userReg.cityId+"&cityName="+$scope.selectedCity.name+"&city="+$scope.userReg.cityId+"&landmark="+$scope.userReg.landmark+"&pincode="+$scope.userReg.pin+"&country=1&countryName=India&term=on&data=true"

		$http.get(regUrl).success(function(data) {

			if(data.success==true){
				$scope.showHome = false;
				$scope.showCatalog = true;
				$scope.showSC = false;
				$scope.showThx = false;

				$scope.userInfo.errorMsg = "";

				var info = data.data;
				$scope.userInfo.ResendmemberCode=info.memberCode;
				$scope.userInfo.loginId=info.memberCode;
				 //console.log($scope.isResendDisabled);
				 stop = $timeout(function() {
					 
					
					 $scope.isResendDisabled=false;
					 //console.log($scope.isResendDisabled);
					 }, 1000*60*3);

				 $scope.userReg.isRegister = true;
				
			}else{

				$scope.userReg.errorMsg = "Registration failed Mobile No. duplicate";

			}
		});	

		//console.log($scope.userReg);
    }

    $scope.resend= function(){
    var rsdUrl=resendUrl+"memberCode="+$scope.userInfo.ResendmemberCode+"&data=true";
    	$scope.isResendDisabled=true;
    	$http.get(rsdUrl).success(function(data) {
    		
    		if(data.success){
    			
    			 stop = $timeout(function() {

    				 $scope.isResendDisabled=false;
    				 $scope.rsdMsgactive ="";
					 }, 1000*60*3);
    			
    		  $scope.rsdMsgactive =" UserID & Password is Successfully Send";
    		}
    	});
    };

	$scope.isLogin = function(){
		if($scope.userInfo.fullName === "Guest"){
			return false;
		}else{
			return true;
		}

    }

	$scope.login = function(){

        if($scope.loginBtLabel === "Logout"){

			$scope.loginBtLabel = "Login";

			$scope.showHome = true;
			$scope.showCatalog = false;
			$scope.showSC = false;
			$scope.showThx = false;


			$scope.userInfo.fullName = "Guest";
			$scope.userInfo.memberCode = "";
			$scope.userInfo.lastLogin = "";

			$scope.prodDetails = [];
			$scope.items = [];
			$scope.categories = [];
			$scope.selectedCat ="";
			$scope.shoppingCart =[];

			$scope.loadCatagory();
			$scope.loadCatalog();			

			$scope.showTab = "home";
			$scope.userReg.isRegister = false;
			$scope.userReg="";
			$scope.userInfo.loginId="";
			$scope.userInfo.password="";
			$scope.userInfo.email = "";
			window.location.reload();
			return;
     
        }

        //var autUrl = loginUrl ;

        var autUrl = loginUrl + "loginId=" + $scope.userInfo.loginId + "&password=" + $scope.userInfo.password ;

		$http.get(autUrl).success(function(data) {});

		$http.get(autUrl).success(function(data) {

			if(data.success){
				$scope.showHome = false;
				$scope.showCatalog = true;
				$scope.showSC = false;
				$scope.showThx = false;
				$scope.userReg.isRegister=false;

				$scope.userInfo.errorMsg = "";

				var uCtx = data.userCtx;

				//console.log(data.userCtx);

				$scope.userInfo.fullName = uCtx.baseDTO.fullName;
				$scope.userInfo.firstName = uCtx.baseDTO.firstName;
				$scope.userInfo.lastName = uCtx.baseDTO.lastName;
				$scope.userInfo.memberCode = uCtx.baseDTO.memberCode;
				$scope.userInfo.lastLogin = uCtx.userDTO.lastLogin;
				$scope.userInfo.id = uCtx.userDTO.id;
				$scope.userInfo.roleId = uCtx.userDTO.roleId;
				$scope.userInfo.memberStatus = uCtx.baseDTO.status;
				$scope.userInfo.memberId = uCtx.baseDTO.id;
				$scope.userInfo.address = uCtx.userDTO.street;
				$scope.userInfo.cityName = uCtx.userDTO.cityName;
				$scope.userInfo.cityId = uCtx.userDTO.city;
				$scope.userInfo.stateId = uCtx.userDTO.state;
				$scope.userInfo.stateName= uCtx.userDTO.stateName;
				$scope.userInfo.countryName= uCtx.userDTO.countryName;
				$scope.userInfo.districtId= uCtx.userDTO.district;
				$scope.userInfo.districtName= uCtx.userDTO.districtName;
				$scope.userInfo.phone= uCtx.userDTO.phone;
				$scope.userInfo.pinCode= uCtx.userDTO.zip;

				$scope.shippingAdd.cityId = $scope.userInfo.cityId;
				$scope.shippingAdd.cityName = $scope.userInfo.cityName;
				$scope.shippingAdd.stateId = $scope.userInfo.stateId;
				$scope.shippingAdd.stateName = $scope.userInfo.stateName;
				$scope.shippingAdd.districtId = $scope.userInfo.districtId;
				$scope.shippingAdd.districtName= $scope.userInfo.districtName;
				$scope.shippingAdd.address= $scope.userInfo.address;
				$scope.shippingAdd.pinCode= $scope.userInfo.pinCode;

				$scope.epinstatus = uCtx.baseDTO.epinstatus;

				$scope.loginBtLabel ="Logout" ;

				//console.log("User Info " , $scope.userInfo);

				$scope.displayProduct();
				//console.log("memstatus"+$scope.userInfo.memberStatus);
				if($scope.epinstatus==false && $scope.userInfo.memberStatus==0){
					$('#upgradeModal').modal('show');
				};

				//$('#upgradeModal').modal('show');

			}else{

				$scope.userInfo.errorMsg = "Invalid ID or Password ";

			}
		});	
	};

	 $scope.displayWallet = function(){
    	 $scope.getWallet();
	 	 $scope.showTab = "wallet_balance";
	 }

	  $scope.becomeMember = function(){
    	 $scope.getWallet();
	 	 $scope.showTab = "become_member";
	 	 $('#upgradeModal').modal('hide');
	 }

	 $scope.displayEpinGen = function(){
    	 $scope.getWallet();
    	 $scope.epin.memberCode=$scope.userInfo.memberCode;
	 	 $scope.showTab = "EpinGeneration";
	 }

	 $scope.EpinGeneration= function(){

	 	var amount =$scope.epin.numberOfEpins*365;
	 	var epinParam="amount="+amount+"&memberCode="+$scope.epin.memberCode+"&numberOfEpins="+$scope.epin.numberOfEpins;
	 	$http.get(epinGenURL+epinParam).success(function(data) {
	 		if(data.success==true){
	 			$scope.epin.message="EPIN generated Successfully"
	 		}else{
	 			$scope.epin.message=data.message;
	 		}
	 	});
	 }
	 $scope.activeMember=function(v){
	 	//console.log(v);
	 	if(v=="pg"){
	 		  $scope.pgActive=true;
	 		  $scope.epinActive=false;
	 		  $scope.referalMemberActive=false;
	 	}
	 	if(v=="epin"){
	 		  $scope.pgActive=false;
	 		  $scope.epinActive=true;
	 		  $scope.referalMemberActive=false;
	 	}
	 	if(v=="refferal"){
	 		  $scope.pgActive=false;
	 		  $scope.epinActive=false;
	 		  $scope.referalMemberActive=true;
	 	}

	 };

	$scope.member ={ "epin" : "","refCode":"","refSide":"" } ;

	 $scope.verifyEpin=function(){
	 	//console.log("epin"+$scope.member.epin);
	 	if(!$scope.member.epin || $scope.member.epin ==""){
	 		//console.log("epin innn"+$scope.member.epin);
	 		return;
	 	}

	 	var epinUrl = epinURL+"id="+$scope.userInfo.id+"&epin="+$scope.member.epin+"&status=2";

		$http.get(epinUrl).success(function(data) {
			if(data.success==true){
	 		  $scope.pgActive=false;
	 		  $scope.epinActive=false;
	 		  $scope.referalMemberActive=true;
	 		}
	 		else{
	 			$scope.member.errorMsg1=data.message;
	 		}

		});
	 };

	 $scope.verifyRefferal=function(){
	 	var refferalUrl=refferalURL+"memberCode="+$scope.member.refCode+"&memberSide="+$scope.member.refSide;
	 	//console.log(refferalUrl);
	 	
	 	$http.get(refferalUrl).success(function(data) {
	 		//console.log(data);
			if(data.jsonSuccess=="true"){
	 		  $scope.pgActive=false;
	 		  $scope.epinActive=false;
	 		  $scope.referalMemberActive=true;
	 		  $scope.referalMemberFound=true;
	 		  $scope.member.errorMsg2="Congratulations !! Now you have become  Ambassador";
	 		}else{
	 			$scope.member.errorMsg2=data.message;
	 		}

		});

	  };

    $scope.getWallet=function(){

    	var wltURL=walletAccountListURL + $scope.userInfo.memberId;

    	$http.get(wltURL).success(function(data){
    		angular.forEach(data.root, function(p){
    			$scope.walletList.push({
    				 "id" : p[0],
                    "memberId" : p[1],
					"memberCode":p[2],
					"memberName" : p[3],
					"balance" : p[4]

			    });		
			    
             });
    		 if($scope.walletList.length == 1  )
    		 {
    		 	$scope.wallet = $scope.walletList[0];
    		 }
             //console.log($scope.wallet);
    	});
	};

	 $scope.loadOrderList =function(){
            
         	$http.get(orderListURL).success(function(data) {
		  
			angular.forEach(data.root, function(p){
				//console.log(p);
				$scope.orderList.push({
					"orderId" : p[1],
					"orderDate":p[3],
					"totalAmount" : p[6],
					"shippingCharges" : p[4],
					"serviceTax" : p[7],
					"totalNetAmount" : p[5],
					"paymentStatus":p[8],
                    "status":p[10],
                    "dispacthDate":p[11],
                    "paymentRemark":p[9]
				});
			});
			
	        //console.log($scope.orderList);	
		});
     };


      $scope.loadWalletAccountTrnList =function(){
            
         	$http.get(walletAccountTrnListURL).success(function(data) {
		  
			angular.forEach(data.root, function(p){
				//console.log(p);
				$scope.walletAccountTrnList.push({
					"memberCode" : p[2],
					"memberName":p[3],
					"amount" : p[4],
					"description":p[5]
				});
			});
		});
     };

      $scope.loadEPINList =function(){
            
         	$http.get(epinListURL).success(function(data) {
		  
			angular.forEach(data.root, function(p){
				//console.log(p);
				$scope.EPINList.push({
					"epin":p[8],
					"memberCode" : p[2],
					"memberName":p[3],
					"status":p[5],
					"activeDate" : p[6],
					"deactiveDate":p[7],
					"usedBy":p[11]
				});
			});
		});
     };
       $scope.sendEPINSMS =function(i,epin){
            var params="operation=sendSMS&uniqueEpin="+epin.epin;
			//console.log(epin);
         	$http.get(epinSendURL+params).success(function(data) {
         		console.log(data.message);
		  alert(data.message);
			
		});
     };
      $scope.sendEPINMail =function(i,epin){
            var params="operation=sendEMAIL&uniqueEpin="+epin.epin;
			//console.log(epin);
         	$http.get(epinSendURL+params).success(function(data) {
		  alert(data.message);
			
		});
     };

	 $scope.loadBinaryTree =function(){
            
            //var btUrl = binaryTreeURL;
            var btUrl = binaryTreeURL + $scope.userInfo.memberId ;

         	$http.get(btUrl).success(function(data) {
		      
		    //$scope.prodDetails = data.root;
		    $scope.binaryTree = [];

			angular.forEach(data.root, function(p){
				//console.log(p);
				$scope.binaryTree.push({
					"memberCode" : p[0],
					"parentMemberCode":p[1],
					"firstName" : p[2],
					"lastName" : p[3],
					"gender" : p[6],
					"mobile" : p[7],
					"treePosition":p[10],
                    "id":p[4] 
				});
			});
			
	        //console.log($scope.binaryTree);	
		});
     };

      $scope.loadGenerationTree =function(){

      	    //var gtUrl = generationTreeURL;
            var gtUrl = generationTreeURL + $scope.userInfo.memberId ;
         
         	$http.get(gtUrl).success(function(data) {
		    
		    //$scope.prodDetails = data.root;
			$scope.generationTree = [];
			angular.forEach(data.root, function(p){
				//console.log(p);
				$scope.generationTree.push({
					"memberCode" : p[0],
					"parentMemberCode":p[1],
					"firstName" : p[2],
					"lastName" : p[3],
					"gender" : p[6],
					"mobile" : p[7],
					"id":p[4] 
					
				});
			});
			
	        //console.log($scope.generationTree);	
		});
    };

    $scope.loadCity =function(){
		

		//$http.get('json-ncs/Sl_catagoryMasterListAction?page=0&limit=25&pages=1&start=0&operation=ajax').success(function(data) {
		$http.get(cityListURL).success(function(data) {
		  		    
			angular.forEach(data.root, function(p){
				$scope.cities.push({
					"id":p[0],
					"name":p[1],
					"stateName":p[6]
				});
			});
		});
	};



     $scope.loadState =function(){
		

		//$http.get('json-ncs/Sl_catagoryMasterListAction?page=0&limit=25&pages=1&start=0&operation=ajax').success(function(data) {
		$http.get(stateListURL).success(function(data) {
		  		    
			angular.forEach(data.root, function(p){
				$scope.states.push({
					"id":p[0],
					"name":p[1],
					"countryId":p[3],
					"countryName":p[4]
				});
			});
			
		});
	};

	$scope.showReg = function(){
		$scope.showTab = "reg";
		//$scope.loadCity();
		//$scope.loadState();

    };


	$scope.forgotPasswrd= function(){
        
    	var forgetUrl=forgotPasswordURL+"memberCode="+$scope.forgotPassword.memberCode+"&data=true";
    	$http.get(forgetUrl).success(function(data) {
    		if(data.success){
    			//alert('sdasd');
    		  $scope.forgetMsgactive ="Password is Successfully Send";
    		}else{
              //alert('jjkjjk');
              $scope.forgetMsgactive ="Please enter correct User Id";

    		}
    		stop = $timeout(function() {
    				
		    $scope.forgetMsgactive ="";
			
    		$scope.forgotPassword.memberCode = "";
    	}, 1500);
    	});
    };



	$scope.loadCatagory =function(){
		$scope.categories = [];

		//$http.get('json-ncs/Sl_catagoryMasterListAction?page=0&limit=25&pages=1&start=0&operation=ajax').success(function(data) {
		$http.get(catalogUrl).success(function(data) {
		  		    
			angular.forEach(data.root, function(p){
				$scope.categories.push({
					"id":p[0],
					"name":p[1],
					"description" : p[2],
					"active" : false
				});
			});
		});
	};

	$scope.loadCatalog =function(){

		$scope.items = [];
		//$http.get('json-ncs/Sl_productDetailListAction?catalog=true&page=0&limit=25&pages=1&start=0&operation=ajax').success(function(data) {
		$http.get(productUrl).success(function(data) {
		    
		    //$scope.prodDetails = data.root;

			angular.forEach(data.root, function(p){
				$scope.items.push({
					"id" : p[0],
					"name":p[1],
					"categoty":p[2],
					"manufacture": p[3],
					"code" : p[4],
					"description" : p[5],
					"imageId" : p[6],
					"benefits" : p[7],
					"restriction" : p[8],
					"minQty" : p[12],
					"size" : p[13],
					"dLength" : p[14],
					"dWidth" : p[15],
					"dHeight" : p[16],
					"level" : p[17],
					"qty" : 0,
					"price" : p[18],
					"dp" : p[20],
					"pp" : p[19],
					"avgRating" : p[21],
					"scAdded" : false,
					"scNotAdded" : true,

				});
			});
		   // console.log( $scope.items);
		});

	};

	$scope.displayProduct = function(){
		$scope.showTab = "show_Catalog";
		$scope.selectedCat = "";
	};


	$scope.detailItem = "";

	$scope.displayProductDetail = function(item){

		$scope.showTab = "show_product_detail";
		$scope.showTab = "show_Catalog";
		$scope.detailItem = item ;


	};

	$scope.displayBinaryTree= function(){

		$scope.showTab = "show_binary_tree";
		$scope.loadBinaryTree();

	};

	$scope.displayOrderList= function(){
        
		$scope.showTab = "show_order_list";
		$scope.loadOrderList();

	};

	$scope.displayWalletAccountTrnList= function(){
        
		$scope.showTab = "show_WalletAccountTrn_list";
		$scope.loadWalletAccountTrnList();

	};

	$scope.displayGenerationTree= function(){

		$scope.showTab = "show_generation_tree";
		$scope.loadGenerationTree();

	};

	$scope.displayMyProfile= function(){
		$scope.familyMembers = [];
		$http.get(myProfileUrl+"?data=true").success(function(data) {
			//console.log("data"+data.root);
			var values=data.root;
			$scope.myProfile.refferedMemberCode=values.refferedMemberCode;
			$scope.myProfile.memberCode=values.memberCode;
	
			$scope.myProfile.firstName=values.firstName;
			$scope.myProfile.lastName=values.lastName;
			$scope.myProfile.parentMemberName=values.parentMemberName;
			$scope.myProfile.cityName=values.cityName;
			$scope.myProfile.stateName=values.stateName;
			$scope.myProfile.pincode=values.pincode;
			$scope.myProfile.landmark=values.landmark;
			$scope.myProfile.gender=values.gender;
			$scope.myProfile.dateOfBirth=values.dateOfBirth;
			$scope.myProfile.street=values.street;
			$scope.myProfile.occupation=values.occupation;
			$scope.myProfile.maritalStatus=values.maritalStatus;
			$scope.myProfile.weddingAnniversaryDate=values.weddingAnniversaryDate;
			$scope.myProfile.panNo=values.panNo;
			$scope.myProfile.telephoneResi=values.telephoneResi;
			$scope.myProfile.telephoneOffice=values.telephoneOffice;
			$scope.myProfile.memberCode=values.memberCode;
			$scope.myProfile.mail=values.mail;
			$scope.myProfile.isMail=values.mail;
			$scope.myProfile.stateId=values.state;
			$scope.myProfile.mobileNo=values.mobileNo;

			$scope.myProfile.savingsAccountNo1=values.savingsAccountNo1;
			$scope.myProfile.savingsAccountNo2=values.savingsAccountNo2;
			$scope.myProfile.bankCode1=values.bankCode1;
			$scope.myProfile.bankCode2=values.bankCode2;
			$scope.myProfile.bankName1=values.bankName1;
			$scope.myProfile.bankName2=values.bankName2;
			$scope.myProfile.ifscCode1=values.ifscCode1;
			$scope.myProfile.ifscCode2=values.ifscCode2;
			$scope.myProfile.addressOfBank1=values.addressOfBank1;
			$scope.myProfile.addressOfBank2=values.addressOfBank2;
			$scope.myProfile.verifyAccount1=values.verifyAccount1;
			$scope.myProfile.verifyAccount2=values.verifyAccount2;
			
			$scope.myProfile.nomineeName=values.nomineeName;
			$scope.myProfile.nomineeRelation=values.nomineeRelation;
			
		 });

		
		$http.get(familyUrl+"&data=true").success(function(data) {
			angular.forEach(data.root, function(p){
				$scope.familyMembers.push({
				"id":p[0],
				"name":p[3],
				"dob":p[4],
				"education":p[5],
				"relation":p[6],
				"mobileNo":p[7]

				});


			});

		});

		$scope.showTab = "showMyProfile";
		
		   

		

	};
	
	$scope.saveProfile = function(){

		var profileParam = 
       	"&firstName=" + $scope.myProfile.firstName +
        "&lastName=" + $scope.myProfile.lastName +
        "&mail=" + $scope.myProfile.mail +
        "&mobileNo=" + $scope.myProfile.mobileNo +
        "&gender=" + $scope.myProfile.gender +
        "&dateOfBirth="+ $scope.myProfile.dateOfBirth + 
        "&countryName=INDIA"+
        "&country=1"+
        "&state="+  $scope.myProfile.stateId + 
        "&stateName="+  $scope.selectedState.name + 
        "&district="+ $scope.myProfile.cityId  + 
        "&districtName="+  $scope.selectedCity.name + 
        "&city="+  $scope.myProfile.cityId + 
        "&cityName="+  $scope.selectedCity.name + 
        "&landmark="+ $scope.myProfile.landmark + 
        "&pincode=" + $scope.myProfile.pincode+

        "&maritalStatus="+  $scope.myProfile.maritalStatus + 
        "&weddingAnniversaryDate="+  $scope.myProfile.weddingAnniversaryDate + 
        "&occupation="+ $scope.myProfile.occupation + 
        "&panNo="+ $scope.myProfile.panNo +
        "&tdsCerificate="+$scope.myProfile.tdsCerificate +
        "&telephoneOffice="+ $scope.myProfile.telephoneOffice +
        "&telephoneResi="+ $scope.myProfile.telephoneResi +
        "&street="+$scope.myProfile.street +
        "&nomineeName="+ $scope.myProfile.nomineeName + 
        "&nomineeRelation="+ $scope.myProfile.nomineeRelation + 
        "&savingsAccountNo1="+ $scope.myProfile.savingsAccountNo1 + 
        "&savingsAccountNo2="+ $scope.myProfile.savingsAccountNo2 + 
        "&bankName1="+ $scope.myProfile.bankName1 + 
        "&bankName2="+ $scope.myProfile.bankName2 + 
        "&bankCode1="+ $scope.myProfile.bankCode1 + 
        "&bankCode2="+ $scope.myProfile.bankCode2 + 
        "&ifscCode1="+ $scope.myProfile.ifscCode1 + 
        "&ifscCode2="+ $scope.myProfile.ifscCode2 + 
        "&addressOfBank1="+ $scope.myProfile.addressOfBank1 + 
        "&addressOfBank2="+ $scope.myProfile.addressOfBank2 +"&data=true";

        $http.get(saveMyProfileUrl+profileParam).success(function(data) {

        });
	}

	$scope.saveFamilyDetail = function(){

		var familyParam = 
		"&id=0"+ 
        "&name="+ $scope.family.name + 
        "&relationship="+ $scope.family.relationship + 
        "&dateOfBirth="+ $scope.family.dateOfBirth + 
        "&education="+ $scope.family.education + 
        "&phnNo="+ $scope.family.phoneNo + 
        "&mobileNo="+ $scope.family.mobileNo +"&data=true";
        
        $http.get(saveFamilyUrl+familyParam).success(function(data) {
        	$scope.familyMembers=[];
        	$http.get(familyUrl+"&data=true").success(function(data) {
			angular.forEach(data.root, function(p){
				$scope.familyMembers.push({
				"id":p[0],
				"name":p[3],
				"dob":p[4],
				"education":p[5],
				"relation":p[6],
				"mobileNo":p[7]

				});


			});

		});
        });
	}

	$scope.changePWD = function(){
	
	var passParam =
		"&check="+ false + 
        "&reenteredNewPassword="+ $scope.myProfile.reenteredNewPassword + 
        "&newPassword="+ $scope.myProfile.newPassword + 
        "&oldPassword="+ $scope.myProfile.oldPassword+"&data=true" ;
	 $http.get(changePWDUrl+passParam).success(function(data) {

	 	//console.log(data.success);
	 	if(data.success==true){
	 		//console.log(data.success);
	 		$scope.passwordchnagesuccess=true;
	 		$scope.passwordchnagefail=false;
	 	}
	 	if(data.success==false){
	 		$scope.passwordchnagefail=true;
	 		$scope.passwordchnagesuccess=false;
	 	}
	 });
	}
	
	$scope.displayThx = function(){
		$scope.showTab = "thanks";
	};

	$scope.showShippingAdd = function(){
		//$scope.loadState();
		//$scope.loadCity();
		$scope.showTab = "shipping_address";
	};

	$scope.showOrderSumm = function(){
		//console.log($scope.selectedState);
		$scope.showTab = "order_summary";
	};

	$scope.showPaymentOpt = function(){
		$scope.getWallet();
		$scope.showTab = "payment_option";
	};

	$scope.displayEWallet = function(){

		$scope.fundInsufficient = false;

		var netAmt =  $scope.scGrantToTal + $scope.scShippingCharges;

		//console.log( $scope.wallet.balance+""+netAmt);

		if(netAmt >$scope.wallet.balance){
			$scope.fundInsufficient = true;
		}

		$scope.activeMessage = false;
		$scope.ewMessage = true;

	};

	$scope.makePayment = function(){


        var netAmt =  $scope.scGrantToTal + $scope.scShippingCharges;

        var paymentParam = "memberId="+  $scope.userInfo.memberId + "&balance=-" + netAmt ;

		 $http.get(walletUrl + paymentParam ).success(function(data) {
			//console.log( data);
		 });        
		 var paymentStatus=1;

        var orderParam = 
        "userId=" + $scope.userInfo.id +
        "&contactFirstName=" + $scope.userInfo.firstName +
        "&contactLastName=" + $scope.userInfo.lastName +
        "&contactEmail=" + $scope.userInfo.email +
        "&contactMobile=" + $scope.userInfo.mobile +
        "&totalAmount=" + $scope.scGrantToTal +
        "&billingAddress="+ $scope.shippingAdd.address + 
        "&billingCountryName=INDIA"+
        "&billingCountry=1"+
        "&billingState="+  $scope.shippingAdd.stateId + 
        "&billingStateName="+  $scope.selectedState.name + 
        "&billingDistrict="+ $scope.shippingAdd.districtId  + 
        "&billingDistrictName="+  $scope.selectedDistrict.name + 
        "&billingCity="+  $scope.shippingAdd.cityId + 
        "&billingCityName="+  $scope.selectedCity.name + 
        "&billingLandmark="+ $scope.shippingAdd.landmark + 
        "&billingPincode=" + $scope.userInfo.pin+
        "&shippingAddress="+  $scope.shippingAdd.address + 
        "&shippingState="+  $scope.shippingAdd.stateId + 
        "&shippingStateName="+ $scope.selectedState.name + 
        "&shippingDistrict="+ $scope.shippingAdd.districtId +
        "&shippingDistrictName="+$scope.selectedDistrict.name +
        "&shippingCity="+ $scope.shippingAdd.cityId +
        "&shippingCityName="+ $scope.selectedCity.name +
        "&shippingLandmark="+$scope.shippingAdd.landmark +
        "&shippingCharges="+ $scope.scShippingCharges + 
        "&shippingPincode=" + $scope.shippingAdd.pinCode+
        "&shippingCountryName=INDIA"+
        "&shippingCountry=1"+
        "&paymentStatus="+paymentStatus+
        "&totalNetAmount=" + netAmt;

        oUrl =  addOrderUrl + orderParam;
        var orderId=0;

		$http.get(oUrl).success(function(data) {
			orderId=data.id;
		    //console.log( data);

			var orderDetailParam = "" ;

	    	angular.forEach($scope.shoppingCart, function(cartItem){

	             orderDetailParam ="orderId="+ orderId +
		         "&totalAmount="+ cartItem.total+
		         "&productId="+ cartItem.id +
		         "&quantity="+ cartItem.qty + 
		         "&price="+ cartItem.price + 
		         "&businessPoint="+ cartItem.pp + 
		         "&productName=" + cartItem.name ;

				 $http.get(addOrderDetailUrl +orderDetailParam ).success(function(data) {
					//console.log( data);
				 });

			});

		});

		$scope.displayThx();
	};

	

    $scope.loadData = function (val) {
	
		$scope.showTab = "details_page";
		
	    var httpRequest = $http({
	        method: 'GET',
	        url: 'html/'+val+'.html'
	    }).success(function (data, status) {
	        $scope.tabelData = data;
	             
	    });
    };

    $scope.loadRegTnc = function (val) {

	    var httpRequest = $http({
	        method: 'GET',
	        url: 'html/'+val+'.html'
	    }).success(function (data, status) {
	        $scope.tabelRegTncData = data;
	             
	    });
    };

     $scope.loadEBSPayment = function () {

     	var amount =$scope.epin.numberOfEpins*365;
     	var params='&account_id='+$scope.EBSAccountId+"&amount="+amount+"&reference_no="+$scope.userInfo.memberCode+"&return_url="+$scope.EBSReturnURL+"&mode="+$scope.EBSMode;
	    var httpRequest = $http({
	        method: 'GET',
	        url: 'jsp/secure.jsp',
	        params:{
	        		account_id:$scope.EBSAccountId,
	        		amount:amount,
	        		reference_no:$scope.userInfo.memberCode,
	        		return_url:$scope.EBSReturnURL,
	        		mode:$scope.EBSMode
	        		}
	    }).success(function (data, status) {
	        $scope.EBSData = data;
	             
	    });
	    $('#EBSModalWindow').modal('show');
    };

    $scope.checkOrder= function(){
 $http.get(orderCheck).success(function(data) {

console.log(data);

 });

};

   $scope.loadEBSShoppingPayment = function () {

   		var netAmt =  $scope.scGrantToTal + $scope.scShippingCharges;
   		var params='account_id='+$scope.EBSAccountId+"&amount="+netAmt+"&reference_no="+$scope.userInfo.memberCode+"&return_url="+$scope.EBSReturnURL+"&mode="+$scope.EBSMode;
     	
     	var paymentStatus=0;

     	if(!$scope.selectedState){
     		$scope.selectedState = $scope.states[0];
     	}
     	
     	if( !$scope.selectedCity){
     		$scope.selectedCity = $scope.cities[0];
     	}

     	if( !$scope.selectedDistrict){
     		$scope.selectedDistrict = $scope.cities[0];
     	}
     	
        var orderParam = 
        "userId=" + $scope.userInfo.id +
        "&contactFirstName=" + $scope.userInfo.firstName +
        "&contactLastName=" + $scope.userInfo.lastName +
        "&contactEmail=" + $scope.userInfo.email +
        "&contactMobile=" + $scope.userInfo.mobile +
        "&totalAmount=" + $scope.scGrantToTal +
        "&billingAddress="+ $scope.shippingAdd.address + 
        "&billingCountryName=INDIA"+
        "&billingCountry=1"+
        "&billingState="+  $scope.shippingAdd.stateId + 
        "&billingStateName="+  $scope.selectedState.name + 
        "&billingDistrict="+ $scope.shippingAdd.districtId  + 
        "&billingDistrictName="+  $scope.selectedDistrict.name + 
        "&billingCity="+  $scope.shippingAdd.cityId + 
        "&billingCityName="+  $scope.selectedCity.name + 
        "&billingLandmark="+ $scope.shippingAdd.landmark + 
        "&billingPincode=" + $scope.userInfo.pin+
        "&shippingAddress="+  $scope.shippingAdd.address + 
        "&shippingState="+  $scope.shippingAdd.stateId + 
        "&shippingStateName="+ $scope.selectedState.name + 
        "&shippingDistrict="+ $scope.shippingAdd.districtId +
        "&shippingDistrictName="+$scope.selectedDistrict.name +
        "&shippingCity="+ $scope.shippingAdd.cityId +
        "&shippingCityName="+ $scope.selectedCity.name +
        "&shippingLandmark="+$scope.shippingAdd.landmark +
        "&shippingCharges="+ $scope.scShippingCharges + 
        "&shippingPincode=" + $scope.shippingAdd.pinCode+
        "&shippingCountryName=INDIA"+
        "&shippingCountry=1"+
        "&paymentStatus="+paymentStatus+
        "&totalNetAmount=" + netAmt;

        oUrl =  addOrderUrl + orderParam;
        var orderId=0;

		$http.get(oUrl).success(function(data) {
			orderId=data.id;
		    //console.log( data);


		

			 OrderService.poll($scope);

	    	angular.forEach($scope.shoppingCart, function(cartItem){

	             orderDetailParam ="orderId="+ orderId +
		         "&totalAmount="+ cartItem.total+
		         "&productId="+ cartItem.id +
		         "&quantity="+ cartItem.qty + 
		         "&price="+ cartItem.price + 
		         "&businessPoint="+ cartItem.pp + 
		         "&productName=" + cartItem.name+"&orderId="+orderId ;

				 $http.get(addOrderDetailUrl +orderDetailParam ).success(function(data) {
					//console.log( data);
					$scope.showTab = "processModal";

					//OrderService.getStatus();

					
        
					
					// window.location="jsp/secure.jsp?"+params;
					 window.open('jsp/secure.jsp?'+params,'mywin',
						'left=100,top=20,width=800,height=500,toolbar=0,resizable=0');




				 });

			});

		});

	   
    };



 $scope.$watch(OrderService.get, function (newVal) {
       
       console.log("Check"+newVal);
     // $scope.tags = newVal;

   }, true);
    





    $scope.displayEPINList= function(){

		$scope.showTab = "show_EPIN_list";
		$scope.loadEPINList();

	};

    $scope.loadPages = function (val) {
	
		$scope.showTab = "staticPages";
	
    };

	$scope.displayHome = function(){
		$scope.showTab = "home";
	};

	$scope.hideUpgrade = function(){
		$('#upgradeModal').modal('hide');
	};

	$scope.removeUpgrade = function(){

	params="memberCode="+$scope.userInfo.memberCode+"&epinstatus=true&data=true";
		$http.get(hideUpgradeURL+params).success(function(data) {

		});
	};
	
	$('#tncRegModalWindow').css('width', '960px'); 
	$('#tncRegModalWindow').css('margin-left', '-483px');

	$('#productdetail').css('width', '803px'); 
	$('#productdetail').css('margin-left', '-400px');

	$scope.loadCatagory();
	$scope.loadCatalog();
	$scope.loadCity();
	$scope.loadState();	

});