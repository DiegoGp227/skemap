import AuthSystem from "./AuthSystem";
import InfoSection from "../molecules/InfoDiv";

export default function AuthCard() {
    return(
        <div className="w-full max-w-3xl rounded-md overflow-hidden border-2 border-border flex">
            <InfoSection /> 
            <AuthSystem />
        </div>
    )
}