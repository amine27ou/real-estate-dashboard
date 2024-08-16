import { createContext,ReactNode,useContext, useEffect, useState } from "react";

const ToastContext = createContext<{
    toastMessage: ToastMessage;
    setToastMessage: React.Dispatch<React.SetStateAction<ToastMessage>>;
  } | undefined>(undefined);
interface ToastMessage{
    type:string,
    message:string,
}

export default function ToastMessageProvider({ children }: { children: ReactNode }) {
    const [toastMessage, setToastMessage] = useState<ToastMessage>({
      message: '',
      type: ''
    })
    useEffect(()=>{},[
      setTimeout(()=>{
        setToastMessage({type:'',message:''})
      },15000)
    ])
    return(
        <ToastContext.Provider value={{toastMessage,setToastMessage}} >
            {children}
        </ToastContext.Provider>
    )
}

export const useToastContext = () => {
    const context = useContext(ToastContext);
    if (!context) {
      throw new Error("useToastContext must be used within a ToastMessageProvider");
    }
    return context;
  };