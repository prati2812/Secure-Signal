import { useSelector } from "react-redux";


const checkSubscriptionStatus = () => {
  const isSubscribed = useSelector((state : any) => state.subscription.isSubscribed);

    console.log("====");
    
    console.log("======",isSubscribed);
    if (isSubscribed === false) {
        console.log("false");
    }
  };
  
  export const startSubscriptionService = () => {
    checkSubscriptionStatus();
  
    setInterval(checkSubscriptionStatus, 1000); 
};