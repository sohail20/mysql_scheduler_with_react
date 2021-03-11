module.exports = function(){
    var Observers = []

    return{
        subscribeObserver:function(observer){
            Observers.push(observer)
        },
        unSubscribeObserver:function(observerToRemove){
           Observers = Observers.filter(val=>{
               if(val !== observerToRemove){
                   return val
               }
               return false;
            })
        },
        fire:function(){
            Observers.forEach(observer=>{
                observer.call()
            })
        }
    }
}
