import { Navigate, Outlet } from "react-router-dom";

function AdminRoute() {

    const token = localStorage.getItem("adminToken");

    if (!token) {
        return <Navigate to="/admin/login" replace />;
    }

    try {

        const payload = JSON.parse(
            atob(
                token
                    .split(".")[1]
                    .replace(/-/g, "+")
                    .replace(/_/g, "/")
            )
        );

        if (
            payload.exp &&
            payload.exp * 1000 < Date.now()
        ) {
            localStorage.removeItem("adminToken");
            localStorage.removeItem("adminUser");

            return <Navigate to="/admin/login" replace />;
        }

    } catch (error) {

        console.error("Invalid admin token:", error);

        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");

        return <Navigate to="/admin/login" replace />;
    }

    return <Outlet />;
}

export default AdminRoute;

