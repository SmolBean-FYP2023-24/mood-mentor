import { Outlet } from "react-router-dom"
import TopNav from "./top_nav"

export default function Root() {
    return(
        <>
            <TopNav />
            <Outlet />
        </>
    )
}