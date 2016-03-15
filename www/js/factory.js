//var base ="http://www.shopkare.com/";
var base ='http://0.0.0.0:5000';
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
    
    getProductImages: function(cid, pid, category){
      return $http.get('http://www.lenme.in/api/productimages/?category='+category+'&pid='+pid+'&cid='+cid);
    },
    
    registerProduct: function (product){
      return $http.post('http://www.lenme.in/APIproductregister/?product='+JSON.stringify(product));
    }
    };
  return Products;
}])

.factory('CartFactory', ['$http', function($http){
  var Items = {
    
    addToCart: function(Items){
      return $http.get('http://www.lenme.in/APIcart/?operation=store&products='+Items);
    },
    
    getCartItems: function(){
      return $http.get('http://www.lenme.in/APIcart/?operation=get');
    }
    
    };
  return Items;
}])

.factory('FaqFactory', [function(){
  var faq = {
    
    getGeneralFaq: function(){
     var generalfaq = [{
      title: 'Q1. What is lenme?',
      text: "Its all in the name. LEND ME. A platform where we allow users to lend their product at rents they decide, whilst allowing other users to rent items according to their own needs thus inculcating the habit of sharing and a step towards saving your resources. After all its all about saving money!"
    },{
      title: 'Q2. Is lenme a solution to my problem?',
      text: "Let’s get realistic about this problem. If you need a product immediately you got two options. An e-commerce site + additional fast delivery charges. Borrow it from a friend and return it after use."
    },{
      title: 'Q3. How can I trust Lenme?',
      text: "We cover our deal with a MOU. We give you the right to claim us in case of any damage to your product. The product served by us our Lenme verified. If any problems arise we will reach out to you in no time."
    },{
      title: 'Q4. Do I need to register before making any transaction?',
      text: "Yes , upon registration you are entitled with your own dashboard  where you can manage your product as you require. We assure you that any information provided to us will not be shared with any third party unless you permit."
    },{
      title: 'Q5. When does it come to my city?',
      text: "As soon as we start getting registrations from your city!!"
  }];
       return generalfaq;
    },
    
    getLenderFaq: function(){
      var lenderfaq = [{
      title: 'Q1. What do I have to do?',
      text: "Just find a product which you think can fetch you some money. Upload your product with the rent value you want (refer to the guide for doing god business) , mark it active or dormant. We’ll contact you ASAP and figure out the estimate value of your product, certifying it as Lenme verified which attract more customers. Upon any future request we sign a MOU and pick your product, which is finally returned with all policies covered*."
    },{
      title: 'Q2. How do I select a rent value?',
      text: "We suggest you a value to keep it as low as possible so that your product is picked more often. A projected value lenme promotes is around 1-2% of the M.R.P. , refer full lending guide for making a good move. At the end it all depends on you!!!"
    },{
      title: 'Q3. Will I get an initial security for my product?',
      text: "A post-dated check which is 60% of the estimated value is provided for products estimated above 10000. Refer T&C for detailed instructions."
    },{
      title: 'Q4. When does my product appear?',
      text: "After uploading your product we need 12 hrs. of scrutiny of any unwanted or malicious information."
    },{
      title: 'Q5. When does it come to my city?',
      text: "As soon as we start getting registrations from your city!!0"
  },{
      title: "Q6. How do I decide my rent value for maximum transactions?",
      text: "The rent value for a day must be 1% to 2% of the actual market value of the product."
  }];
      return lenderfaq;
    },
    
    getBorrowerFaq: function (){
      var borrowerfaq = [{
      title: 'Q1.  Does the product that appears is same as what I get?',
      text: "We try to as authentic as we can, but if there is any emergency we get back to you with the nearest possible solution."
    },{
      title: 'Q2. Do I have to give a security deposit?',
      text: "For products valued above 10000 you are required to supply a refundable post-dated cheque. In case of any damage a repair amount is deducted from the value with the rent of days. See full T&C."
    },{
      title: 'Q3. How fast can I receive my product?',
      text: "We guarantee you a delivery that is made within 2 Hrs ( see standards)."
    }];
      return borrowerfaq;
    }
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
	'Baby Products': ['Diapers', 'Baby Creams', 'Baby Lotions', 'Baby Shampoo', 'Baby Powder', 'Baby Soap', 'Baby body wash', 'Baby Wipes', 'Baby Food'],
	'Cereals':['Cornflakes', 'Oats', 'Muesli', 'Other Cereals'],
	'Beverages and Drinks': ['Cold Drinks', 'Soda', 'Tea and Coffee', 'Health Drinks'],
	'Personal Care': ['Oral Care'],
	'Pulses and Grains':['Soya'],
	'Flours':[],
	'Household Cleaning':['Detergents'],
	'Snacks':['Maggi and Noodles', 'Pasta']
     }
    };
      return cat[level1category][mainCategory];
    }
  };
  
  return categories;
}])
;