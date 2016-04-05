  var base ="http://www.shopkare.com";
//   var base ='http://0.0.0.0:5000';

angular.module('Data.factory', [])

.factory('Loader',['$ionicLoading', '$timeout', function($ionicLoading, $timeout){
  var LOADERAPI = {
    showLoading: function(text){
      text = text || 'Loading...';
      $ionicLoading.show({
	template: text
      });
    },
    
    hideLoading: function(){
      $ionicLoading.hide();
    },
    
    toggleLoadingWithMessage: function(text, timeout) {
      
      this.showLoading(text);
      
      $timeout(function(){
	$ionicLoading.hide();
      }, timeout || 3000);
    }
  };
  return LOADERAPI;
}])

.factory('LSFactory', [function(){
  var LSAPI = {
    clear: function(){
      localStorage.clear();
    },
    
    get: function(key){
      return JSON.parse(localStorage.getItem(key));
    },
    
    set: function(key, data){
      return localStorage.setItem(key, JSON.stringify(data));
    },
    
    delete: function(key){
      return localStorage.removeItem(key);
    },
  };
  
  return LSAPI;
}])

.factory('UserFactory', ['$http', 'AuthFactory', function($http, AuthFactory){
  
  var UserAPI = {
    
    login: function(user){
       return $http.post(base+'/api/Customer/login/?user='+user);
    },
    
    register: function(user){
      return $http.post(base+'/api/Customer/signup/?user='+user);
    },
    
    logout: function(){
      return $http.post(base+'/api/Customer/logout/');
    }
  };
  return UserAPI;
}])

.factory('ProductFactory', ['$http', function($http){
  var Products = {
    
    getProducts: function(category, MainCategory, SubCategory){
       return $http.get(base + '/api/Product/getCategoryProducts/?level1Category='+category+'&MainCategory='+MainCategory+'&SubCategory='+SubCategory);
    },
    getRandomMainCategoryProducts: function(level1category, MainCategory){
       return $http.get(base + '/api/Product/getRandomMainCategoryProducts/?level1category='+level1category+'&mainCategory='+MainCategory);
    },
    getRandomProducts: function(level1category){
       return $http.get(base + '/api/Product/getRandomProducts/?level1category='+level1category);
    },
    searchProduct: function (level1Category, query){
      return $http.get(base+'/api/Product/searchProduct/?level1category='+level1Category+'&query='+query);
    }
    };
  return Products;
}])

.factory('CartFactory', ['$http', 'LSFactory', function($http, LSFactory){
  var cartKey='CartKey';
  var Items = {
    
    addToCart: function(product){
	return $http.post(base + '/api/Customer/addToCart/?cartItem='+JSON.stringify(product));
    },
    
    getCartItems: function(){
      return $http.post(base + '/api/Customer/getCartItems/');
    },
    
    removeCartItem: function(product){
      return $http.post(base + '/api/Customer/removeFromCart/?cartItem='+JSON.stringify(product));
    },
    newCourierOrder: function(order){
      return $http.post(base+'/api/Customer/NewCourierOrder/?order='+JSON.stringify(order));
    }
    };
  return Items;
}])

.factory('FaqFactory', [function(){
  var faq = {
    
    
    };
  return faq;
}])

.factory('AuthFactory', ['LSFactory', function(LSFactory){
  var userKey = 'user';
  var emailKey = 'email';
  var passwordKey = 'password';
  
  var AuthAPI = {
    
    isLoggedIn : function(){
      return this.getUser() === null ? false: true;
    },
    
    setUser: function(user){
      return LSFactory.set(userKey, user);
    },
    
    getUser: function(){
      return LSFactory.get(userKey);
    },
    
    getEmail: function(){
      return LSFactory.get(emailKey);
    },
    
    setEmail: function(email){
      return LSFactory.set(emailKey, email);
    },

    getPassword: function(){
      return LSFactory.get(passwordKey);
    },
    
    setPassword: function(password){
      return LSFactory.set(passwordKey, password);
    },
    
    deleteAuth: function(){
      LSFactory.delete(userKey);
      LSFactory.delete(passwordKey);
      LSFactory.delete(emailKey);
    }
  };
  
  return AuthAPI;
}])
.factory('Categories', [function(){
  var  categories = {
    getSubCategories: function(level1category, mainCategory){
    var cat={ 
      'Grocery':{
	"Baby Products" : [ "Baby Food", "Baby Hygiene", "Baby Care" ] ,
	"Cereals and Spreads" : [ "Canned Food", "Jams and Honey", "Ready to Eat", "Cereals" ],
	"Beverages and Drinks" : [ "Cold Drinks", "Tea and Coffee", "Health Drinks", "Other" ] ,
	"Personal Care" : [ "Oral Care", "Hair Care", "Skin Care", "Hand and Body Wash", "Fragrances", "Feminine Needs", "Male Grooming" ],
	 "Biscuits and Snacks" : [ "Chips and Namkeen", "Cookies", "Bakery Products", "Other" ],
	"Chocolates and Candy" : [ "Candy", "Chocolates" ],
	"Cleaning and Hygiene" : [ "Laundry", "Cleaning", "Pet Care", "Pest Control", "Air Freshners" ],
	"Staples" : [ "Pulses and Grains", "Masala and Spices" ],
	 "Pickles and Sauces" : [ "Pickles", "Sauces" ],
	 "Home Care" : [ "Pooja Items" ]
     }
    };
      return cat[level1category][mainCategory];
    }
  };
  
  return categories;
}])
;