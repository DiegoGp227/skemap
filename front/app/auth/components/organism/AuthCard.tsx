import AuthSistem from "./AuthSistem";
import InfoSection from "../molecules/InfoDiv";

export default function AuthCard() {
    return(
        <div className="w-215 h-137.5 rounded-md overflow-hidden border-2 border-border flex">
            <InfoSection /> 
            <AuthSistem />
        </div>
    )
}